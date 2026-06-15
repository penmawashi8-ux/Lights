#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
「ポコっとライト」十字型4x4 実況解説ショート(音声・BGM・効果音つき).

- 描画ヘルパは make_video.py を再利用.
- ナレーション: pyopenjtalk (オフライン日本語TTS) を 1.3倍速.
- BGM / 効果音: numpy で合成.
- ナレーション長に合わせて各ビートの尺を決め、映像と音声を同期.

依存: Pillow, numpy, scipy, pyopenjtalk, imageio-ffmpeg
"""
import os, math, subprocess, shutil, glob, io, wave
import numpy as np
from scipy.io import wavfile
from scipy.signal import resample_poly
from PIL import Image, ImageDraw

import importlib.util
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = importlib.util.spec_from_file_location("mv", os.path.join(ROOT, "scripts/make_video.py"))
mv = importlib.util.module_from_spec(spec); spec.loader.exec_module(mv)

W, H, FPS = mv.W, mv.H, mv.FPS
SR = 48000
FRAMES_DIR = "/tmp/lights_av_frames"
NARR_DIR = "/tmp/narr_s"          # 1.3倍速済みナレーション
OUT = os.path.join(ROOT, "media", "poko-light-cross4x4-short-bgm.mp4")

# ---------------------------------------------------------------- ナレーション
# pyopenjtalk -> /tmp/narr/nNN.wav -> atempo 1.3 -> /tmp/narr_s/nNN.wav を作る
NARR_TEXT = [
 "今日はポコっとライトを実況解説していくよ！",
 "今回は十字型のよんバイよんをやさしく攻略していくよ！",
 "暗いマスをぜんぶ点灯させたらクリアのライトパズルだよ。",
 "まずはマスを押してみるよ。",
 "押したマスと上下左右のあわせてごマスが切り替わるんだ！",
 "この十字の動きを使ってぜんぶ点灯させよう！",
 "コツはライトチェイス。暗いマスの下を押していくだけだよ！",
 "いちだんめの暗いマスはすぐ下を押すよ。",
 "となりの暗いマスも下を押して点灯。",
 "右はしまで同じように送っていくよ。",
 "にだんめに残った暗いマスも下を押すよ。",
 "さんだんめも同じで光を下の段へ送るんだ。",
 "最後のいちマス！これでぜんぶつくよ！",
 "ぜんぶついた！クリア！ろくてでクリアだよ！",
 "十字型のほかにもエックス型や四角型などいろんなパターンに挑戦できるよ！",
 "ボードゲーム広場で検索して遊んでみてね！",
]

# --- VOICEVOX 設定 (ニューラル日本語音声) -------------------------------
# 利用規約によりクレジット「VOICEVOX:ずんだもん」を動画内に表示しています。
VV_LIB = sorted(glob.glob("/tmp/vv/voicevox_onnxruntime-*/lib/libvoicevox_onnxruntime.so*"))
VV_MODELS = "/tmp/vv/vvcore"
VV_DICT = "/usr/local/lib/python3.11/dist-packages/pyopenjtalk/open_jtalk_dic_utf_8-1.11"
VV_STYLE = 3        # ずんだもん / ノーマル
VV_SPEED = 1.4      # 1.4倍速（テンポよく）
VOICE_CREDIT = "音声: VOICEVOX:ずんだもん"

def voicevox_available():
    return bool(VV_LIB) and bool(glob.glob(VV_MODELS+"/*.vvm")) and os.path.isdir(VV_DICT)

def _synth_voicevox():
    from voicevox_core.blocking import Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile
    ort = Onnxruntime.load_once(filename=VV_LIB[0])
    syn = Synthesizer(ort, OpenJtalk(VV_DICT))
    for vvm in sorted(glob.glob(VV_MODELS+"/*.vvm")):
        with VoiceModelFile.open(vvm) as m:
            syn.load_voice_model(m)
    for i, t in enumerate(NARR_TEXT):
        aq = syn.create_audio_query(t, VV_STYLE)
        aq.speed_scale = VV_SPEED
        aq.pre_phoneme_length = 0.03    # 前後の無音を最小化
        aq.post_phoneme_length = 0.03
        w = wave.open(io.BytesIO(syn.synthesis(aq, VV_STYLE)))
        sr = w.getframerate()
        data = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32)/32768.0
        if sr != SR:
            g = math.gcd(sr, SR); data = resample_poly(data, SR//g, sr//g)
        # 前後の無音をトリム（途切れ感を防ぐ）
        peak = max(1e-6, np.max(np.abs(data)))
        idx = np.where(np.abs(data) > 0.012*peak)[0]
        if idx.size:
            a = max(0, idx[0]-int(0.015*SR)); b = min(len(data), idx[-1]+int(0.03*SR))
            data = data[a:b]
        data = data/peak*0.92            # 音量を揃える
        wavfile.write(f"{NARR_DIR}/n{i:02d}.wav", SR, (np.clip(data, -1, 1)*32767).astype(np.int16))

def _synth_pyopenjtalk():
    import imageio_ffmpeg, pyopenjtalk
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    raw = "/tmp/narr"; os.makedirs(raw, exist_ok=True)
    for i, t in enumerate(NARR_TEXT):
        wav, sr = pyopenjtalk.tts(t)
        wav = wav / max(1e-9, np.max(np.abs(wav)))
        wavfile.write(f"{raw}/n{i:02d}.wav", sr, (wav*32767*0.95).astype(np.int16))
        subprocess.run([ff, "-y", "-i", f"{raw}/n{i:02d}.wav", "-filter:a", "atempo=1.3",
                        "-ar", str(SR), "-ac", "1", f"{NARR_DIR}/n{i:02d}.wav"],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def ensure_narration():
    os.makedirs(NARR_DIR, exist_ok=True)
    if all(os.path.exists(f"{NARR_DIR}/n{i:02d}.wav") for i in range(len(NARR_TEXT))):
        return
    if voicevox_available():
        print("ナレーション: VOICEVOX (ずんだもん) で合成")
        _synth_voicevox()
    else:
        print("ナレーション: pyopenjtalk で合成 (VOICEVOX未検出)")
        _synth_pyopenjtalk()

def narr_dur(i):
    sr, d = wavfile.read(f"{NARR_DIR}/n{i:02d}.wav")
    return len(d)/sr

# ---------------------------------------------------------------- 描画ビート
def bg(gt):
    b = mv.BG_BASE.convert("RGBA"); mv.draw_fireflies(b, gt); return b

def draw_title(base, gt, stage):
    a = mv.ease_out(min(1, 1.0))
    bob = math.sin(gt*2)*10; ty = 760
    mv.paste_center(base, mv.GLOW, W//2, int(ty-150+bob), scale=1.3)
    lan = mv.rounded(mv.LANTERN.resize((220, 220), Image.LANCZOS), 36)
    mv.paste_center(base, lan, W//2, int(ty-150+bob))
    d = ImageDraw.Draw(base)
    mv.text(d, W//2, ty, "ポコっとライト", mv.F_TITLE, fill=(255,236,170,255), stroke=(60,35,10,255), sw=8)
    mv.text(d, W//2, ty+110, "森のランプを全部つけよう！", mv.F_TAG, fill=(220,245,210,255), sw=4)

def draw_promo(base, lt, gt, chars_anim):
    d = ImageDraw.Draw(base)
    mv.paste_center(base, mv.GLOW, W//2, 430, scale=1.6)
    mv.text(d, W//2, 360, "ボードゲーム広場", mv.F_BIG, fill=(255,236,170,255), stroke=(60,35,10,255), sw=7)
    mv.text(d, W//2, 460, "で 今すぐ遊べる！", mv.F_CTA, fill=(230,250,220,255), sw=5)
    names = ["owl","fox","bear","rabbit","raccoon","hedgehog"]; cw = 150
    x0 = (W-cw*len(names))//2 + cw//2
    for k, nm in enumerate(names):
        ch = mv.CHARS[nm]; ratio = 200/ch.size[1]
        im = ch.resize((int(ch.size[0]*ratio), 200), Image.LANCZOS)
        ap = mv.ease_out(min(1, max(0, (lt-0.2-k*0.1)/0.4))) if chars_anim else 1.0
        if ap <= 0: continue
        y = 760 + math.sin(gt*2+k)*12 + (1-ap)*30
        tmp = im.copy(); tmp.putalpha(tmp.getchannel("A").point(lambda v: int(v*ap)))
        mv.paste_center(base, tmp, x0+k*cw, int(y))
    mv.text(d, W//2, 1865, VOICE_CREDIT, mv.F_SMALL, fill=(205,222,200,235),
            stroke=(18,38,18,210), sw=3)

def render(beat, lt, dur, gt):
    k = beat["kind"]
    base = bg(gt)
    if k == "title":
        draw_title(base, gt, beat["stage"])
        mv.subtitle(base, beat["cap"], y=(1500 if beat["stage"] == 1 else 1620))
    elif k == "game":
        mv.header_chip(base, "★ どんなゲーム？", y=300)
        mv.draw_board(base, mv.STATES[0], appear=mv.ease_out(min(1, lt/0.5)))
        mv.subtitle(base, beat["cap"], y=1640)
    elif k == "rule_point":
        mv.header_chip(base, "＋ 十字型のルール", y=300)
        mv.draw_board(base, mv.STATES[0], marker_cell=(1,1), marker_t=lt)
        mv.subtitle(base, beat["cap"], y=1640)
    elif k == "rule_flip":
        mv.header_chip(base, "＋ 十字型のルール", y=300)
        before = mv.STATES[0]; after = mv.apply(before, [(1,1)]); flip = set(mv.plus_cells(1,1))
        if lt < 0.5:
            ft = lt/0.5
            mv.draw_board(base, after, prev=before, flip_cells=flip, flip_t=ft,
                          press_cell=(1,1), press_scale=0.84+0.16*ft)
        else:
            mv.draw_board(base, after, marker_cell=(1,1), marker_t=lt)
        mv.subtitle(base, beat["cap"], y=1640)
    elif k == "rule_reset":
        mv.header_chip(base, "＋ 十字型のルール", y=300)
        mv.draw_board(base, mv.STATES[0])
        mv.subtitle(base, beat["cap"], y=1640)
    elif k == "solve_intro":
        mv.header_chip(base, "▶ 実況クリア！", y=300)
        mv.move_counter(base, 0); mv.draw_board(base, mv.STATES[0])
        mv.subtitle(base, beat["cap"], y=1640)
    elif k == "press":
        i = beat["i"]; pcell = mv.PRESSES[i]
        before = mv.STATES[i]; after = mv.STATES[i+1]; flip = set(mv.plus_cells(*pcell))
        mv.header_chip(base, "▶ 実況クリア！", y=300)
        pe = max(0.6, dur-1.1)
        if lt < pe:
            mv.move_counter(base, i); mv.draw_board(base, before, marker_cell=pcell, marker_t=lt)
        elif lt < pe+0.45:
            ft = (lt-pe)/0.45; mv.move_counter(base, i+1)
            mv.draw_board(base, after, prev=before, flip_cells=flip, flip_t=ft,
                          press_cell=pcell, press_scale=0.84+0.16*ft)
        else:
            mv.move_counter(base, i+1); mv.draw_board(base, after)
        mv.subtitle(base, mv.PRESS_CAPTIONS[i], y=1640)
    elif k == "clear":
        return mv.s_clear(lt, gt)
    elif k == "promo_chars":
        draw_promo(base, lt, gt, chars_anim=True)
        mv.subtitle(base, beat["cap"], y=1100)
    elif k == "promo_url":
        draw_promo(base, lt, gt, chars_anim=False)
        d = ImageDraw.Draw(base)
        box = [200, 1260, 880, 1370]
        mv.panel(base, box, 30, (255,248,225,245), outline=(250,190,80,255), ow=6)
        mv.text(d, W//2, 1315, "boardgamecat.com", mv.F_CTA, fill=(150,90,30,255),
                stroke=(255,255,255,0), sw=0)
        mv.subtitle(base, beat["cap"], y=1560)
    return base

# ---------------------------------------------------------------- ビート定義
LEAD, TAIL = 0.12, 0.28
def build_beats():
    specs = [
        dict(kind="title", stage=1, cap="今日は“ポコっとライト”を実況解説！", narr=0),
        dict(kind="title", stage=2, cap=["十字型(プラス型)・4×4を", "やさしく攻略していくよ！"], narr=1),
        dict(kind="game", cap=["暗いマスをぜんぶ点灯させたら", "クリアのライトパズル！"], narr=2),
        dict(kind="rule_point", cap="まずはマスを押してみよう", narr=3),
        dict(kind="rule_flip", cap=["押したマスと上下左右、", "あわせて5マスが切り替わる！"], narr=4),
        dict(kind="rule_reset", cap=["この“十字”の動きを使って", "全部を点灯させよう！"], narr=5),
        dict(kind="solve_intro", cap=["コツは「ライトチェイス」。", "暗いマスの“下”を押すだけ！"], narr=6),
    ]
    for i in range(len(mv.PRESSES)):
        specs.append(dict(kind="press", i=i, narr=7+i))
    specs += [
        dict(kind="clear", narr=13),
        dict(kind="promo_chars", cap=["十字型・X型・四角型…", "いろんなパターンに挑戦できる！"], narr=14),
        dict(kind="promo_url", cap=["「ボードゲーム広場」で検索して", "遊んでみてね！"], narr=15),
    ]
    t = 0.0
    for b in specs:
        nd = narr_dur(b["narr"])
        extra = 0.35 if b["kind"] in ("title", "clear", "promo_url") else 0.0
        b["dur"] = round(nd + LEAD + TAIL + extra, 3)
        b["start"] = t
        t += b["dur"]
    return specs, t

# ---------------------------------------------------------------- 音声合成
def bell(freq, dur, amp=0.5, harm=True):
    seg = np.arange(int(dur*SR))/SR; env = np.exp(-seg*5)
    w = np.sin(2*np.pi*freq*seg)
    if harm:
        w += 0.4*np.sin(2*np.pi*2*freq*seg) + 0.2*np.sin(2*np.pi*3*freq*seg)
    return amp*w*env

def sfx_pop():
    n = int(0.16*SR); seg = np.arange(n)/SR
    f = 300 + 500*np.exp(-seg*9)
    phase = 2*np.pi*np.cumsum(f)/SR
    out = 0.5*np.sin(phase)*np.exp(-seg*16)
    b = bell(1320, 0.14, 0.16); m = min(n, len(b))
    out[:m] += b[:m]
    return out

def sfx_fanfare():
    notes = [523.25, 659.25, 783.99, 1046.5]; out = np.zeros(int(1.5*SR))
    for i, f in enumerate(notes):
        b = bell(f, 1.0, 0.5); st = int(i*0.11*SR)
        out[st:st+len(b)] += b[:len(out)-st]
    return out

def sfx_twinkle():
    notes = [1046.5, 1318.5, 1568.0]; out = np.zeros(int(0.9*SR))
    for i, f in enumerate(notes):
        b = bell(f, 0.55, 0.3); st = int(i*0.08*SR)
        out[st:st+len(b)] += b[:len(out)-st]
    return out

def synth_bgm(total):
    n = int(total*SR); out = np.zeros(n)
    prog = [[261.63,329.63,392.00],[220.0,261.63,329.63],
            [174.61,220.0,261.63],[196.0,246.94,293.66]]
    cd = 2.0
    for i in range(int(total/cd)+1):
        ch = prog[i % 4]; s = int(i*cd*SR); e = int(min(total, (i+1)*cd)*SR)
        if s >= n: break
        e = min(e, n); seg = np.arange(e-s)/SR
        env = np.minimum(1, seg/0.3)*np.minimum(1, (cd-seg)/0.3)
        for f in ch:
            out[s:e] += 0.045*np.sin(2*np.pi*f*seg)*env
    step = 0.5
    for k in range(int(total/step)):
        ch = prog[int(k*step/cd) % 4]; f = ch[k % 3]*2
        st = int(k*step*SR); seg = np.arange(int(0.45*SR))/SR
        if st >= n: break
        env = np.exp(-seg*6)
        tone = 0.05*(np.sin(2*np.pi*f*seg)+0.3*np.sin(2*np.pi*2*f*seg))*env
        ee = min(n, st+len(tone)); out[st:ee] += tone[:ee-st]
    peak = np.max(np.abs(out)) or 1.0
    out = out/peak*0.11
    fi = int(1.2*SR); out[:fi] *= np.linspace(0,1,fi); out[-fi:] *= np.linspace(1,0,fi)
    return out

def add(master, clip, at, gain=1.0):
    s = int(at*SR); e = min(len(master), s+len(clip))
    if s < 0 or s >= len(master): return
    master[s:e] += clip[:e-s]*gain

def build_audio(beats, total, sfx_events):
    master = synth_bgm(total)
    for b in beats:
        sr, d = wavfile.read(f"{NARR_DIR}/n{b['narr']:02d}.wav")
        clip = d.astype(np.float32)/32768.0
        add(master, clip, b["start"]+LEAD, gain=0.97)
    for (t, kind) in sfx_events:
        if kind == "pop": add(master, sfx_pop(), t, 0.42)
        elif kind == "fanfare": add(master, sfx_fanfare(), t, 0.5)
        elif kind == "twinkle": add(master, sfx_twinkle(), t, 0.4)
    peak = np.max(np.abs(master))
    if peak > 0.98: master = master/peak*0.98
    wavfile.write("/tmp/master.wav", SR, (master*32767).astype(np.int16))

# ---------------------------------------------------------------- ビルド
def main():
    ensure_narration()
    beats, total = build_beats()
    print(f"総尺 {total:.1f}s / 総フレーム {int(total*FPS)} / ビート {len(beats)}")
    if os.path.exists(FRAMES_DIR): shutil.rmtree(FRAMES_DIR)
    os.makedirs(FRAMES_DIR)
    sfx = [(beats[0]["start"]+0.15, "twinkle")]
    gframe = 0
    for b in beats:
        nf = int(round(b["dur"]*FPS))
        if b["kind"] == "press":
            sfx.append((b["start"] + max(0.6, b["dur"]-1.1), "pop"))
        elif b["kind"] == "rule_flip":
            sfx.append((b["start"] + 0.05, "pop"))
        elif b["kind"] == "clear":
            sfx.append((b["start"] + 0.15, "fanfare"))
        for f in range(nf):
            lt = f/FPS; gt = gframe/FPS
            img = render(b, lt, b["dur"], gt)
            img.convert("RGB").save(f"{FRAMES_DIR}/f{gframe:05d}.png")
            gframe += 1
        print(f"  {b['kind']:12s} {b['dur']:.2f}s -> {nf}f")
    build_audio(beats, gframe/FPS, sfx)
    # エンコード(映像+音声)
    import imageio_ffmpeg
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    cmd = [ff, "-y", "-framerate", str(FPS), "-i", f"{FRAMES_DIR}/f%05d.png",
           "-i", "/tmp/master.wav",
           "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20",
           "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart",
           "-shortest", OUT]
    subprocess.run(cmd, check=True)
    print("出力:", OUT, f"({gframe/FPS:.1f}s)")

if __name__ == "__main__":
    main()
