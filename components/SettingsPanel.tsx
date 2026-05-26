"use client";

import {
  Pattern,
  Difficulty,
  BoardSize,
  PATTERN_LABELS,
  DIFFICULTY_LABELS,
} from "@/lib/gameLogic";

interface SettingsPanelProps {
  pattern: Pattern;
  difficulty: Difficulty;
  boardSize: BoardSize;
  onPatternChange: (p: Pattern) => void;
  onDifficultyChange: (d: Difficulty) => void;
  onBoardSizeChange: (s: BoardSize) => void;
  onStart: () => void;
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
      <p className="text-sm font-semibold text-slate-300 tracking-wide">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(([v, label]) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={[
              "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
              value === v
                ? "bg-yellow-400 text-slate-900 shadow-lg shadow-yellow-400/30"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPanel({
  pattern,
  difficulty,
  boardSize,
  onPatternChange,
  onDifficultyChange,
  onBoardSizeChange,
  onStart,
}: SettingsPanelProps) {
  return (
    <div className="w-full max-w-md mx-auto space-y-6 fade-in-down">
      <div className="text-center space-y-1">
        <h1 className="text-4xl font-bold tracking-tight text-yellow-400">
          💡 ライツアウト
        </h1>
        <p className="text-slate-400 text-sm">全てのマスを消灯させよう</p>
      </div>

      <div className="bg-slate-800/60 rounded-2xl p-5 space-y-5 border border-slate-700/50">
        <SelectGroup<Pattern>
          label="めくりパターン"
          options={Object.entries(PATTERN_LABELS) as [Pattern, string][]}
          value={pattern}
          onChange={onPatternChange}
        />
        <SelectGroup<BoardSize>
          label="ボードサイズ"
          options={([3, 4, 5, 6] as BoardSize[]).map((s) => [s, `${s}×${s}`])}
          value={boardSize}
          onChange={onBoardSizeChange}
        />
        <SelectGroup<Difficulty>
          label="難易度"
          options={Object.entries(DIFFICULTY_LABELS) as [Difficulty, string][]}
          value={difficulty}
          onChange={onDifficultyChange}
        />
      </div>

      <button
        onClick={onStart}
        className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-slate-900 font-bold text-lg rounded-xl transition-all duration-150 shadow-lg shadow-yellow-400/30"
      >
        ゲームスタート
      </button>
    </div>
  );
}
