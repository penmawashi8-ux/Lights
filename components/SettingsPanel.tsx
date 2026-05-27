"use client";

import {
  Pattern,
  Difficulty,
  BoardSize,
  PATTERN_LABELS,
  DIFFICULTY_LABELS,
} from "@/lib/gameLogic";
import {
  OwlIcon,
  FoxIcon,
  BearIcon,
  RabbitCharacter,
  RaccoonCharacter,
  HedgehogCharacter,
  CampfireIcon,
} from "./illustrations/Characters";

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
    <div className="w-full max-w-sm mx-auto space-y-5 fade-in-up">
      {/* Wooden title sign */}
      <div className="text-center space-y-2">
        <div className="relative inline-block">
          <div className="absolute -top-3 left-8 w-2.5 h-6 bg-amber-600 rounded-full opacity-80" />
          <div className="absolute -top-3 right-8 w-2.5 h-6 bg-amber-600 rounded-full opacity-80" />
          <div className="bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 rounded-3xl px-8 py-3.5 shadow-2xl border-2 border-amber-500/60">
            <h1 className="text-yellow-100 font-black text-2xl tracking-wide drop-shadow-lg">
              💡 ポコっとライト
            </h1>
          </div>
        </div>
        <p className="text-green-400 text-sm font-medium">
          全部のマスを光らせよう！✨
        </p>
      </div>

      {/* Character decorations */}
      <div className="flex items-end justify-around px-2">
        <div className="float-anim" style={{ animationDelay: "0s" }}>
          <OwlIcon size={52} />
        </div>
        <div className="float-anim" style={{ animationDelay: "0.5s" }}>
          <RabbitCharacter size={64} />
        </div>
        <div className="float-anim" style={{ animationDelay: "1s" }}>
          <BearIcon size={44} />
        </div>
        <div className="float-anim" style={{ animationDelay: "1.5s" }}>
          <FoxIcon size={52} />
        </div>
      </div>

      {/* Settings card */}
      <div className="bg-gradient-to-br from-green-900/60 to-green-950/80 backdrop-blur-sm rounded-3xl p-5 space-y-5 border border-green-700/50 shadow-xl">
        <SelectGroup<Pattern>
          label="🐾 めくりパターン"
          options={Object.entries(PATTERN_LABELS) as [Pattern, string][]}
          value={pattern}
          onChange={onPatternChange}
        />
        <div className="border-t border-green-700/40" />
        <SelectGroup<BoardSize>
          label="🌿 ボードサイズ"
          options={([3, 4, 5, 6] as BoardSize[]).map((s) => [s, `${s}×${s}`])}
          value={boardSize}
          onChange={onBoardSizeChange}
        />
        <div className="border-t border-green-700/40" />
        <SelectGroup<Difficulty>
          label="🍀 難易度"
          options={Object.entries(DIFFICULTY_LABELS) as [Difficulty, string][]}
          value={difficulty}
          onChange={onDifficultyChange}
        />
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        className="w-full py-4 bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 active:scale-95 text-white font-black text-lg rounded-2xl transition-all duration-150 shadow-xl shadow-green-900/50 border-b-4 border-green-800/60 flex items-center justify-center gap-2"
      >
        🌟 ゲームスタート
      </button>

      {/* Bottom characters */}
      <div className="flex items-end justify-around px-4">
        <div className="float-anim" style={{ animationDelay: "0.3s" }}>
          <HedgehogCharacter size={54} />
        </div>
        <div className="float-anim" style={{ animationDelay: "0.8s" }}>
          <CampfireIcon size={52} />
        </div>
        <div className="float-anim" style={{ animationDelay: "1.3s" }}>
          <RaccoonCharacter size={64} />
        </div>
      </div>
    </div>
  );
}
