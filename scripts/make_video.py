#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
「ポコっとライト」十字型(プラス型)4x4 実況解説ショート動画ジェネレーター.

- 出力: 1080x1920 縦長 MP4 (YouTube ショート用)
- 内容: ゲーム紹介 -> ルール(十字型) -> 実況クリア(ライトチェイス) -> クリア演出 -> 宣伝
- ゲーム本体の見た目(ランタン点灯/森テーマ)に合わせて描画.

依存: Pillow, imageio-ffmpeg (ffmpeg バイナリ)
"""
import os, math, subprocess, shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, "public")
OUT_DIR = os.path.join(ROOT, "media")
FRAMES_DIR = "/tmp/lights_frames"
FONT_PATH = "/usr/share/fonts/opentype/ipafont-gothic/ipagp.ttf"  # IPA P Gothic

W, H = 1080, 1920
FPS = 30

# ---------------------------------------------------------------- パズル定義
N = 4
def plus_cells(r, c):
    cs = [(r, c)]
    if r > 0: cs.append((r-1, c))
    if r < N-1: cs.append((r+1, c))
    if c > 0: cs.append((r, c-1))
    if c < N-1: cs.append((r, c+1))
    return cs

def apply(board, presses):
    b = [row[:] for row in board]
    for (r, c) in presses:
        for (rr, cc) in plus_cells(r, c):
            b[rr][cc] = not b[rr][cc]
    return b

# 検証済み: 8マス消灯, ライトチェイス6手で完成
PUZZLE = [
    [True,  False, False, False],
    [False, True,  True,  True ],
    [True,  True,  False, False],
    [True,  False, False, True ],
]
PRESSES = [(1,1),(1,2),(1,3),(2,2),(3,2),(3,3)]

# 各手の後の状態を事前計算
STATES = [PUZZLE]
for p in PRESSES:
    STATES.append(apply(STATES[-1], [p]))
assert all(all(row) for row in STATES[-1]), "解になっていません"

# 各手の解説字幕
PRESS_CAPTIONS = [
    "1段目の暗いマスは すぐ「下」を押す",
    "となりの暗いマスも 下を押して点灯",
    "右はしまで 同じように送っていく",
    "2段目に残った暗いマスも 下を押す",
    "3段目も同じ。光を下の段へ送る",
    "最後の1マス！ これで全部つくよ",
]

# ---------------------------------------------------------------- レイアウト
CELL = 168
GAP = 20
PAD = 36
BOARD_W = N*CELL + (N-1)*GAP + 2*PAD      # 804
BOARD_X = (W - BOARD_W)//2                 # 138
BOARD_Y = 600
BOARD_H = BOARD_W

def cell_box(r, c):
    x0 = BOARD_X + PAD + c*(CELL+GAP)
    y0 = BOARD_Y + PAD + r*(CELL+GAP)
    return x0, y0, x0+CELL, y0+CELL

def cell_center(r, c):
    x0, y0, x1, y1 = cell_box(r, c)
    return (x0+x1)//2, (y0+y1)//2

# ---------------------------------------------------------------- フォント
def font(sz):
    return ImageFont.truetype(FONT_PATH, sz)

F_TITLE = font(110)
F_TAG   = font(40)
F_HEAD  = font(58)
F_SUB   = font(46)
F_SMALL = font(36)
F_COUNT = font(40)
F_BIG   = font(72)
F_CTA   = font(56)

# ---------------------------------------------------------------- 素材
def load(path):
    return Image.open(path).convert("RGBA")

def rounded(img, radius):
    mask = Image.new("L", img.size, 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle([0, 0, img.size[0]-1, img.size[1]-1], radius=radius, fill=255)
    out = img.copy()
    out.putalpha(mask)
    return out

TILE_ON  = rounded(load(os.path.join(PUB, "icons/tile_on.png")).resize((CELL, CELL), Image.LANCZOS), 30)
TILE_OFF = rounded(load(os.path.join(PUB, "icons/tile_off.png")).resize((CELL, CELL), Image.LANCZOS), 30)
CLEAR_IMG = load(os.path.join(PUB, "chars/game_clear.png"))
CHARS = {n: load(os.path.join(PUB, f"chars/{n}.png"))
         for n in ["owl","fox","bear","rabbit","raccoon","hedgehog"]}
LANTERN = load(os.path.join(PUB, "icons/tile_on.png"))  # ランタン素材

# ON タイル用グロー
def make_glow(size, color=(255, 200, 90)):
    g = Image.new("RGBA", (size, size), (0,0,0,0))
    d = ImageDraw.Draw(g)
    cx = size//2
    for i in range(cx, 0, -2):
        a = int(120 * (1 - i/cx)**2)
        d.ellipse([cx-i, cx-i, cx+i, cx+i], fill=color+(a,))
    return g.filter(ImageFilter.GaussianBlur(14))

GLOW = make_glow(int(CELL*1.7))

# ---------------------------------------------------------------- 背景
import random
random.seed(42)
FIREFLIES = [(random.randint(0, W), random.randint(0, H),
              random.uniform(2, 6), random.uniform(0, 2*math.pi),
              random.uniform(0.7, 1.6)) for _ in range(70)]

def make_background():
    bg = Image.new("RGB", (W, H))
    top = (16, 46, 22)
    bot = (6, 18, 9)
    px = bg.load()
    for y in range(H):
        t = y / H
        # 中央付近を少し明るく(焚き火/ランタンの暖かみ)
        warm = math.exp(-((y-820)/520)**2) * 0.5
        r = int(top[0]*(1-t) + bot[0]*t + warm*40)
        g = int(top[1]*(1-t) + bot[1]*t + warm*30)
        b = int(top[2]*(1-t) + bot[2]*t + warm*10)
        row = (r, g, b)
        for x in range(W):
            px[x, y] = row
    return bg

BG_BASE = make_background()

def draw_fireflies(img, t):
    d = ImageDraw.Draw(img, "RGBA")
    for (x, y, sz, ph, sp) in FIREFLIES:
        a = (math.sin(t*sp + ph) * 0.5 + 0.5)
        alpha = int(20 + a*150)
        rr = sz * (0.7 + a*0.6)
        d.ellipse([x-rr*2, y-rr*2, x+rr*2, y+rr*2], fill=(255, 240, 160, alpha//4))
        d.ellipse([x-rr, y-rr, x+rr, y+rr], fill=(255, 250, 200, alpha))

# ---------------------------------------------------------------- 描画ヘルパ
def ease_out(t): return 1 - (1-t)**3
def ease_in_out(t): return 0.5 - 0.5*math.cos(math.pi*max(0,min(1,t)))

def paste_center(base, img, cx, cy, scale=1.0):
    if scale != 1.0:
        w = max(1, int(img.size[0]*scale)); h = max(1, int(img.size[1]*scale))
        img = img.resize((w, h), Image.LANCZOS)
    base.alpha_composite(img, (int(cx-img.size[0]/2), int(cy-img.size[1]/2)))

def text(draw, cx, cy, s, fnt, fill=(255,255,255,255),
         stroke=(20,40,20,255), sw=4, anchor="mm"):
    draw.text((cx, cy), s, font=fnt, fill=fill, anchor=anchor,
              stroke_width=sw, stroke_fill=stroke)

def panel(base, box, radius, fill, outline=None, ow=0):
    layer = Image.new("RGBA", base.size, (0,0,0,0))
    d = ImageDraw.Draw(layer)
    d.rounded_rectangle(box, radius=radius, fill=fill,
                        outline=outline, width=ow)
    base.alpha_composite(layer)

# ---------------------------------------------------------------- 盤面描画
def draw_board(base, state, prev=None, flip_cells=None, flip_t=1.0,
               press_cell=None, press_scale=1.0,
               marker_cell=None, marker_t=0.0, board_scale=1.0,
               appear=1.0):
    flip_cells = flip_cells or set()
    # 盤パネル
    bx0, by0 = BOARD_X, BOARD_Y
    bx1, by1 = BOARD_X+BOARD_W, BOARD_Y+BOARD_H
    # board_scale を中心基準で適用するため一旦別レイヤに描く
    layer = Image.new("RGBA", base.size, (0,0,0,0))
    # 緑グラデのパネル
    pan = Image.new("RGBA", (BOARD_W, BOARD_H), (0,0,0,0))
    pd = ImageDraw.Draw(pan)
    for y in range(BOARD_H):
        t = y/BOARD_H
        r = int(22*(1-t) + 9*t); g = int(74*(1-t) + 30*t); b = int(30*(1-t)+14*t)
        pd.line([(0,y),(BOARD_W,y)], fill=(r,g,b,235))
    pan = rounded(pan, 44)
    od = ImageDraw.Draw(pan)
    od.rounded_rectangle([2,2,BOARD_W-3,BOARD_H-3], radius=42,
                         outline=(96,150,70,235), width=6)
    layer.alpha_composite(pan, (bx0, by0))
    # セル
    for r in range(N):
        for c in range(N):
            cx, cy = cell_center(r, c)
            on = state[r][c]
            sc = press_scale if (press_cell == (r,c)) else 1.0
            if (r,c) in flip_cells and prev is not None and flip_t < 1.0:
                # クロスフェード(消灯<->点灯)
                a = ease_in_out(flip_t)
                old_on = prev[r][c]
                if old_on:
                    paste_center(layer, GLOW, cx, cy, scale=1.0-a)
                if on:
                    paste_center(layer, GLOW, cx, cy, scale=a)
                old_img = (TILE_ON if old_on else TILE_OFF).copy()
                new_img = (TILE_ON if on else TILE_OFF).copy()
                blended = Image.blend(old_img, new_img, a)
                paste_center(layer, blended, cx, cy, scale=sc)
            else:
                if on:
                    paste_center(layer, GLOW, cx, cy)
                paste_center(layer, TILE_ON if on else TILE_OFF, cx, cy, scale=sc)
    # マーカー(押す場所)
    if marker_cell is not None:
        cx, cy = cell_center(*marker_cell)
        d = ImageDraw.Draw(layer)
        pulse = 0.5 + 0.5*math.sin(marker_t*7)
        rad = CELL*0.62 + pulse*16
        for k in range(3):
            a = int(200*(1-k*0.3)*(0.5+0.5*pulse))
            d.ellipse([cx-rad+k*8, cy-rad+k*8, cx+rad-k*8, cy+rad-k*8],
                      outline=(255, 230, 120, a), width=7)
    # スケール/出現
    if board_scale != 1.0 or appear < 1.0:
        # 中心基準スケール
        cx, cy = BOARD_X+BOARD_W/2, BOARD_Y+BOARD_H/2
        s = board_scale
        nw, nh = int(W), int(H)
        scaled = layer.resize((max(1,int(W*s)), max(1,int(H*s))), Image.LANCZOS)
        # 中心を合わせて貼る
        off_x = int(cx - cx*s); off_y = int(cy - cy*s)
        tmp = Image.new("RGBA", base.size, (0,0,0,0))
        tmp.alpha_composite(scaled, (off_x, off_y))
        if appear < 1.0:
            tmp.putalpha(tmp.getchannel("A").point(lambda v: int(v*appear)))
        base.alpha_composite(tmp)
    else:
        base.alpha_composite(layer)

# ---------------------------------------------------------------- 字幕バンド
def subtitle(base, lines, y=1640, accent=False):
    if isinstance(lines, str): lines = [lines]
    draw = ImageDraw.Draw(base)
    # 横幅測定
    maxw = 0
    for ln in lines:
        bb = draw.textbbox((0,0), ln, font=F_SUB, stroke_width=4)
        maxw = max(maxw, bb[2]-bb[0])
    lh = 64
    bw = maxw + 90
    bh = lh*len(lines) + 44
    box = [(W-bw)//2, y-bh//2, (W+bw)//2, y+bh//2]
    fill = (20, 50, 24, 215) if not accent else (120, 30, 20, 225)
    outline = (120, 200, 110, 220) if not accent else (250, 180, 90, 230)
    panel(base, box, 30, fill, outline=outline, ow=4)
    cy = y - lh*(len(lines)-1)//2
    for ln in lines:
        text(draw, W//2, cy, ln, F_SUB, fill=(255,255,240,255), sw=4)
        cy += lh

def header_chip(base, s, y=300):
    draw = ImageDraw.Draw(base)
    bb = draw.textbbox((0,0), s, font=F_HEAD, stroke_width=5)
    bw = (bb[2]-bb[0]) + 80
    box = [(W-bw)//2, y-50, (W+bw)//2, y+50]
    panel(base, box, 28, (180, 110, 30, 235), outline=(250, 210, 110, 240), ow=5)
    text(draw, W//2, y, s, F_HEAD, fill=(255,250,235,255), sw=5)

def move_counter(base, n, y=500):
    draw = ImageDraw.Draw(base)
    s = f"手数  {n}"
    box = [W//2-150, y-44, W//2+150, y+44]
    panel(base, box, 24, (245, 235, 200, 240), outline=(180,140,60,240), ow=4)
    text(draw, W//2, y, s, F_COUNT, fill=(90, 60, 20, 255), stroke=(255,255,255,0), sw=0)

# ---------------------------------------------------------------- コンフェッティ
random.seed(7)
CONFETTI = [(random.randint(0,W), random.uniform(-H,0), random.uniform(60,200),
            random.choice([(255,210,90),(120,200,110),(250,150,150),(150,200,250),(255,255,255)]),
            random.uniform(8,18), random.uniform(0,2*math.pi)) for _ in range(120)]

def draw_confetti(base, t):
    d = ImageDraw.Draw(base, "RGBA")
    for (x, y0, sp, col, sz, ph) in CONFETTI:
        y = (y0 + sp*t*60) % (H+200) - 100
        x2 = x + math.sin(t*3+ph)*30
        ang = t*6+ph
        dx, dy = math.cos(ang)*sz, math.sin(ang)*sz
        d.line([(x2-dx, y-dy), (x2+dx, y+dy)], fill=col+(235,), width=6)

# ================================================================ シーン構成
# 各シーンを (duration秒, render関数) で定義. render(local_t, frame_global_t)
SCENES = []
def scene(dur):
    def deco(fn):
        SCENES.append((dur, fn))
        return fn
    return deco

# ---- A: イントロ ------------------------------------------------- 5.0s
@scene(5.0)
def s_intro(lt, gt):
    base = BG_BASE.convert("RGBA")
    draw_fireflies(base, gt)
    a = ease_out(min(1, lt/0.7))
    # ランタンのアイコン(タイトル横)
    bob = math.sin(gt*2)*10
    # タイトル
    ty = 760 + (1-a)*40
    paste_center(base, GLOW, W//2, int(ty-150+bob), scale=1.3)
    lan = rounded(LANTERN.resize((220,220), Image.LANCZOS), 36)
    paste_center(base, lan, W//2, int(ty-150+bob))
    d = ImageDraw.Draw(base)
    sc = 0.7 + 0.3*ease_out(min(1, lt/0.6))
    tt = F_TITLE
    text(d, W//2, int(ty), "ポコっとライト", tt, fill=(255, 236, 170, int(255*a)),
         stroke=(60, 35, 10, int(255*a)), sw=8)
    if lt > 0.5:
        text(d, W//2, int(ty)+110, "森のランプを全部つけよう！", F_TAG,
             fill=(220, 245, 210, 255), sw=4)
    if lt > 1.2:
        subtitle(base, "今日は“ポコっとライト”を実況解説！", y=1500)
    if lt > 2.6:
        subtitle(base, ["十字型(プラス型)・4×4 を", "やさしく攻略していくよ！"], y=1680)
    return base

# ---- B: ゲーム紹介 ---------------------------------------------- 7.0s
@scene(7.0)
def s_intro_game(lt, gt):
    base = BG_BASE.convert("RGBA")
    draw_fireflies(base, gt)
    header_chip(base, "★ どんなゲーム？", y=300)
    ap = ease_out(min(1, lt/0.5))
    draw_board(base, PUZZLE, appear=ap)
    if lt > 0.8:
        subtitle(base, ["暗いマスを ぜんぶ点灯させたら", "クリアの ライトパズル！"], y=1640)
    return base

# ---- C: ルール(十字)説明 --------------------------------------- 8.0s
@scene(8.0)
def s_rule(lt, gt):
    base = BG_BASE.convert("RGBA")
    draw_fireflies(base, gt)
    header_chip(base, "＋ 十字型のルール", y=300)
    demo_cell = (1, 1)
    on_off = STATES[0]
    after = apply(on_off, [demo_cell])      # 押した後(十字5マス反転)
    flip = set(plus_cells(*demo_cell))
    # フェーズ: 0-1.4 マーカー / 1.4-1.85 反転 / 1.85-5.5 保持 / 5.5- 通常
    if lt < 1.4:
        draw_board(base, on_off, marker_cell=demo_cell, marker_t=lt)
        if lt > 0.3:
            subtitle(base, ["このマスを押すと…"], y=1640)
    elif lt < 1.85:
        ft = (lt-1.4)/0.45
        draw_board(base, after, prev=on_off, flip_cells=flip, flip_t=ft,
                   press_cell=demo_cell, press_scale=0.84+0.16*ft)
        subtitle(base, ["押したマスと 上下左右、", "あわせて5マスが切り替わる！"], y=1640)
    elif lt < 5.5:
        draw_board(base, after, marker_cell=demo_cell, marker_t=lt)
        subtitle(base, ["押したマスと 上下左右、", "あわせて5マスが切り替わる！"], y=1640)
    else:
        draw_board(base, on_off)
        subtitle(base, ["この“十字”の動きを使って", "全部を点灯させよう！"], y=1640)
    return base

# ---- D: 実況クリア --------------------------------------------- per press
PRESS_POINT = 1.5   # マーカー表示
PRESS_FLIP  = 0.45  # 反転
PRESS_HOLD  = 0.65  # 余韻
PRESS_DUR = PRESS_POINT + PRESS_FLIP + PRESS_HOLD
D_INTRO = 2.2
D_TOTAL = D_INTRO + PRESS_DUR*len(PRESSES)

@scene(D_TOTAL)
def s_solve(lt, gt):
    base = BG_BASE.convert("RGBA")
    draw_fireflies(base, gt)
    header_chip(base, "▶ 実況クリア！", y=300)
    if lt < D_INTRO:
        move_counter(base, 0)
        draw_board(base, STATES[0])
        subtitle(base, ["コツは「ライトチェイス」。", "暗いマスの“下”を押していくだけ！"], y=1640)
        return base
    t = lt - D_INTRO
    i = int(t // PRESS_DUR)          # 0..len-1
    i = min(i, len(PRESSES)-1)
    pt = t - i*PRESS_DUR
    pcell = PRESSES[i]
    before = STATES[i]
    after = STATES[i+1]
    flip = set(plus_cells(*pcell))
    move_counter(base, i)
    if pt < PRESS_POINT:
        draw_board(base, before, marker_cell=pcell, marker_t=pt)
    elif pt < PRESS_POINT+PRESS_FLIP:
        ft = (pt-PRESS_POINT)/PRESS_FLIP
        ps = 0.84 + 0.16*ft
        draw_board(base, after, prev=before, flip_cells=flip, flip_t=ft,
                   press_cell=pcell, press_scale=ps)
        move_counter(base, i+1)
    else:
        draw_board(base, after)
        move_counter(base, i+1)
    subtitle(base, PRESS_CAPTIONS[i], y=1640)
    return base

# ---- E: クリア演出 --------------------------------------------- 6.0s
@scene(6.0)
def s_clear(lt, gt):
    base = BG_BASE.convert("RGBA")
    draw_fireflies(base, gt)
    # 盤を少し揺らして全点灯
    cel = 1.0 + 0.04*math.sin(lt*10) if lt < 0.8 else 1.0
    draw_board(base, STATES[-1], board_scale=cel)
    draw_confetti(base, lt)
    # ポップアップ
    pa = ease_out(min(1, lt/0.4))
    pscale = 0.6 + 0.4*pa
    pop_h = 520
    box = [110, 740, 970, 740+int(pop_h)]
    # 中心スケール用に別レイヤ
    layer = Image.new("RGBA", base.size, (0,0,0,0))
    panel(layer, box, 40, (255, 248, 225, 245), outline=(250, 190, 80, 255), ow=8)
    # 森の仲間たち(キャラ整列)
    names = ["owl","fox","bear","rabbit","raccoon","hedgehog"]
    cw = 138; x0 = W//2 - cw*len(names)//2 + cw//2
    for k, nm in enumerate(names):
        ch = CHARS[nm]; ratio = 170/ch.size[1]
        im = ch.resize((int(ch.size[0]*ratio), 170), Image.LANCZOS)
        paste_center(layer, im, x0+k*cw, 920)
    d = ImageDraw.Draw(layer)
    text(d, W//2, 1110, "全部ついた！クリア！", F_BIG, fill=(210, 120, 30, 255),
         stroke=(255,255,255,255), sw=6)
    text(d, W//2, 1190, f"{len(PRESSES)}手でクリア！", F_SUB, fill=(120, 90, 40, 255),
         stroke=(255,255,255,0), sw=0)
    # スケール適用
    cx, cy = W//2, 740+pop_h//2
    sc = layer.resize((int(W*pscale), int(H*pscale)), Image.LANCZOS)
    ox = int(cx - cx*pscale); oy = int(cy - cy*pscale)
    tmp = Image.new("RGBA", base.size, (0,0,0,0))
    tmp.alpha_composite(sc, (ox, oy))
    tmp.putalpha(tmp.getchannel("A").point(lambda v: int(v*pa)))
    base.alpha_composite(tmp)
    return base

# ---- F: 宣伝 --------------------------------------------------- 6.5s
@scene(6.5)
def s_promo(lt, gt):
    base = BG_BASE.convert("RGBA")
    draw_fireflies(base, gt)
    a = ease_out(min(1, lt/0.5))
    d = ImageDraw.Draw(base)
    paste_center(base, GLOW, W//2, 430, scale=1.6)
    text(d, W//2, 360, "ボードゲーム広場", F_BIG, fill=(255, 236, 170, int(255*a)),
         stroke=(60,35,10,int(255*a)), sw=7)
    text(d, W//2, 460, "で 今すぐ遊べる！", F_CTA, fill=(230, 250, 220, int(255*a)), sw=5)
    # キャラ行
    names = ["owl","fox","bear","rabbit","raccoon","hedgehog"]
    n = len(names)
    bob = lambda k: math.sin(gt*2 + k)*12
    cw = 150
    total = cw*n
    x0 = (W-total)//2 + cw//2
    for k, nm in enumerate(names):
        ch = CHARS[nm]
        ratio = 200/ch.size[1]
        im = ch.resize((int(ch.size[0]*ratio), 200), Image.LANCZOS)
        ap = ease_out(min(1, max(0, (lt-0.3-k*0.12))/0.4))
        if ap <= 0: continue
        y = 760 + bob(k) + (1-ap)*30
        tmp = im.copy(); tmp.putalpha(tmp.getchannel("A").point(lambda v:int(v*ap)))
        paste_center(base, tmp, x0+k*cw, int(y))
    # ボード(小)
    if lt > 0.6:
        subtitle(base, ["十字型・X型・四角型…", "いろんなパターンに挑戦できる！"], y=1080)
    if lt > 1.6:
        # URL チップ
        box = [200, 1260, 880, 1370]
        panel(base, box, 30, (255, 248, 225, 245), outline=(250,190,80,255), ow=6)
        text(d, W//2, 1315, "boardgamecat.com", F_CTA, fill=(150, 90, 30, 255),
             stroke=(255,255,255,0), sw=0)
    if lt > 2.4:
        subtitle(base, ["「ボードゲーム広場」で検索して", "遊んでみてね！"], y=1560)
    return base

# ================================================================ レンダリング
def render_all():
    if os.path.exists(FRAMES_DIR):
        shutil.rmtree(FRAMES_DIR)
    os.makedirs(FRAMES_DIR)
    # シーン累積
    total = sum(d for d, _ in SCENES)
    print(f"総尺: {total:.1f}s, 総フレーム: {int(total*FPS)}")
    gframe = 0
    for si, (dur, fn) in enumerate(SCENES):
        nf = int(round(dur*FPS))
        for f in range(nf):
            lt = f/FPS
            gt = gframe/FPS
            img = fn(lt, gt)
            img.convert("RGB").save(os.path.join(FRAMES_DIR, f"f{gframe:05d}.png"))
            gframe += 1
        print(f"  scene {si} ({fn.__name__}) -> {nf}f done")
    return gframe

def encode(nframes):
    import imageio_ffmpeg
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    os.makedirs(OUT_DIR, exist_ok=True)
    out = os.path.join(OUT_DIR, "poko-light-cross4x4-short.mp4")
    cmd = [ff, "-y", "-framerate", str(FPS), "-i", os.path.join(FRAMES_DIR, "f%05d.png"),
           "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20",
           "-movflags", "+faststart", out]
    subprocess.run(cmd, check=True)
    print("出力:", out, f"({nframes}f / {nframes/FPS:.1f}s)")
    return out

if __name__ == "__main__":
    nf = render_all()
    encode(nf)
