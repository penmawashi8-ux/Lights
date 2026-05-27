"use client";

import {
  Pattern, Difficulty, BoardSize,
  PATTERN_LABELS, DIFFICULTY_LABELS,
} from "@/lib/gameLogic";

interface SettingsPanelProps {
  pattern: Pattern;
  difficulty: Difficulty;
  boardSize: BoardSize;
  onPatternChange: (p: Pattern) => void;
  onDifficultyChange: (d: Difficulty) => void;
  onBoardSizeChange: (s: BoardSize) => void;
  onStart: () => void;
  onBack: () => void;
}

function SelectGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: [T, string][];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-bold text-green-300 tracking-wide">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(([v, lbl]) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={[
              "px-3 py-2 rounded-xl text-sm font-bold transition-all duration-150 active:scale-95",
              value === v
                ? "bg-gradient-to-b from-yellow-300 to-amber-400 text-green-900 shadow-lg shadow-yellow-400/40 border border-yellow-200/60"
                : "bg-green-900/60 text-green-300 hover:bg-green-800/60 border border-green-700/40",
            ].join(" ")}
          >
            {lbl}
          </button>
        ))}
      </div>
    </div>
  );
}

const DIFFICULTY_ICONS: Record<Difficulty, string> = {
  easy: "/icons/clover.png",
  normal: "/icons/triangle.png",
  hard: "/icons/circle.png",
};

export default function SettingsPanel({
  pattern, difficulty, boardSize,
  onPatternChange, onDifficultyChange, onBoardSizeChange, onStart, onBack,
}: SettingsPanelProps) {
  return (
    <div className="w-full max-w-sm mx-auto space-y-5 fade-in-up">
      {/* ヘッダー（もどるボタン＋タイトル） */}
      <div className="flex items-center gap-3">
        <button onClick={onBack}
          className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform">
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center shadow-md border-2 border-green-500/60">
            <span className="text-white text-xl font-black">◀</span>
          </div>
          <span className="text-green-300 text-xs font-bold">もどる</span>
        </button>

        <div className="flex-1 text-center">
          <div className="relative inline-block">
            <div className="absolute -top-2.5 left-6 w-2 h-5 bg-amber-600 rounded-full opacity-80" />
            <div className="absolute -top-2.5 right-6 w-2 h-5 bg-amber-600 rounded-full opacity-80" />
            <div className="bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 rounded-2xl px-6 py-2.5 shadow-xl border-2 border-amber-500/50">
              <p className="text-yellow-100 font-black text-base drop-shadow-md">🎲 フリーモード</p>
            </div>
          </div>
        </div>
        <div className="w-12" />
      </div>

      {/* Character row */}
      <div className="flex items-end justify-around px-2">
        {[
          { src: "/chars/owl.png", label: "フクロウ", delay: "0s" },
          { src: "/chars/rabbit.png", label: "ウサギ", delay: "0.5s" },
          { src: "/chars/bear.png", label: "クマ", delay: "1s" },
          { src: "/chars/fox.png", label: "キツネ", delay: "1.5s" },
        ].map(({ src, label, delay }) => (
          <div key={label} className="flex flex-col items-center gap-1 float-anim" style={{ animationDelay: delay }}>
            <img src={src} alt={label} className="w-14 h-14 object-contain" draggable={false} />
          </div>
        ))}
      </div>

      {/* Settings card */}
      <div className="bg-gradient-to-br from-green-900/60 to-green-950/80 backdrop-blur-sm rounded-3xl p-5 space-y-5 border border-green-700/50 shadow-xl">
        <SelectGroup<Pattern>
          label="めくりパターン"
          options={Object.entries(PATTERN_LABELS) as [Pattern, string][]}
          value={pattern}
          onChange={onPatternChange}
        />
        <div className="border-t border-green-700/40" />
        <SelectGroup<BoardSize>
          label="ボードサイズ"
          options={([3, 4, 5, 6] as BoardSize[]).map((s) => [s, `${s}×${s}`])}
          value={boardSize}
          onChange={onBoardSizeChange}
        />
        <div className="border-t border-green-700/40" />
        {/* Difficulty with icon preview */}
        <div className="space-y-2">
          <p className="text-sm font-bold text-green-300 tracking-wide">難易度</p>
          <div className="flex gap-2">
            {(["easy", "normal", "hard"] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => onDifficultyChange(d)}
                className={[
                  "flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 flex flex-col items-center gap-1",
                  difficulty === d
                    ? "bg-gradient-to-b from-yellow-300 to-amber-400 text-green-900 shadow-lg shadow-yellow-400/40 border border-yellow-200/60"
                    : "bg-green-900/60 text-green-300 hover:bg-green-800/60 border border-green-700/40",
                ].join(" ")}
              >
                <img src={DIFFICULTY_ICONS[d]} alt="" className="w-8 h-8 object-contain" draggable={false} />
                {DIFFICULTY_LABELS[d]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        className="w-full py-4 bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 active:scale-95 text-white font-black text-lg rounded-2xl transition-all duration-150 shadow-xl shadow-green-900/50 border-b-4 border-green-800/60 flex items-center justify-center gap-2"
      >
        <span>🎲</span>
        <span>ゲームスタート</span>
      </button>

      {/* Bottom characters */}
      <div className="flex items-end justify-around px-4">
        {[
          { src: "/chars/hedgehog.png", delay: "0.3s" },
          { src: "/chars/campfire.png", delay: "0.8s" },
          { src: "/chars/raccoon.png",  delay: "1.3s" },
        ].map(({ src, delay }) => (
          <div key={src} className="float-anim" style={{ animationDelay: delay }}>
            <img src={src} alt="" className="w-14 h-14 object-contain" draggable={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
