"use client";

import { useState } from "react";
import ModeSelectScreen from "@/components/ModeSelectScreen";
import SettingsPanel from "@/components/SettingsPanel";
import GameScreen from "@/components/GameScreen";
import ChallengeGameScreen from "@/components/ChallengeGameScreen";
import LevelSelectScreen from "@/components/LevelSelectScreen";
import AdventureGameScreen from "@/components/AdventureGameScreen";
import { Pattern, BoardSize } from "@/lib/gameLogic";
import { type PatternKey } from "@/lib/levels";

type Screen = "mode-select" | "settings" | "game" | "challenge-settings" | "challenge" | "level-select" | "adventure";

const FIREFLIES = [
  { top: "8%",  left: "12%", delay: "0s",   dur: "2.8s" },
  { top: "15%", left: "80%", delay: "0.7s", dur: "3.2s" },
  { top: "30%", left: "5%",  delay: "1.2s", dur: "2.5s" },
  { top: "45%", left: "92%", delay: "0.3s", dur: "3.6s" },
  { top: "60%", left: "18%", delay: "1.8s", dur: "2.9s" },
  { top: "75%", left: "88%", delay: "0.9s", dur: "3.1s" },
  { top: "85%", left: "35%", delay: "2.1s", dur: "2.7s" },
  { top: "20%", left: "50%", delay: "1.5s", dur: "3.4s" },
  { top: "55%", left: "65%", delay: "0.5s", dur: "2.6s" },
  { top: "90%", left: "72%", delay: "1.1s", dur: "3.0s" },
];

export default function Home() {
  const [screen, setScreen] = useState<Screen>("mode-select");
  const [pattern, setPattern] = useState<Pattern>("plus");
  const [boardSize, setBoardSize] = useState<BoardSize>(5);

  // Adventure mode state
  const [advPattern, setAdvPattern] = useState<PatternKey>("plus");
  const [advSize, setAdvSize]       = useState<BoardSize>(3);
  const [advIndex, setAdvIndex]     = useState(0);

  function handleAdventureComplete(pat: PatternKey, sz: BoardSize, completedIdx: number) {
    const nextIdx = completedIdx + 1;
    if (nextIdx <= 99) {
      setAdvPattern(pat);
      setAdvSize(sz);
      setAdvIndex(nextIdx);
    } else {
      setScreen("level-select");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#071407] via-[#0d2410] to-[#071407] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* String lights */}
      <div className="absolute top-0 left-0 right-0 flex justify-around pointer-events-none z-10 px-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="w-3 h-3 rounded-full bg-yellow-300 mt-3 firefly-dot shadow-sm shadow-yellow-300/60"
            style={{ animationDelay: `${i * 0.4}s`, animationDuration: `${2 + (i % 3) * 0.5}s` }} />
        ))}
      </div>

      {/* Fireflies */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {FIREFLIES.map((f, i) => (
          <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-yellow-300 firefly-dot"
            style={{ top: f.top, left: f.left, animationDelay: f.delay, animationDuration: f.dur, boxShadow: "0 0 6px 2px rgba(253,224,71,0.6)" }} />
        ))}
      </div>

      {/* Trees */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pointer-events-none z-0 opacity-20 select-none text-6xl sm:text-7xl leading-none">
        <span>🌲</span><span>🌳</span><span>🌲</span><span>🌳</span><span>🌲</span><span>🌳</span>
      </div>

      <div className="relative z-10 w-full">
        {screen === "mode-select" ? (
          <ModeSelectScreen
            onFreeMode={() => setScreen("settings")}
            onChallenge={() => setScreen("challenge-settings")}
            onAdventure={() => setScreen("level-select")}
          />
        ) : screen === "settings" ? (
          <SettingsPanel
            pattern={pattern} boardSize={boardSize}
            title="フリーモード"
            onPatternChange={setPattern} onBoardSizeChange={setBoardSize}
            onStart={() => setScreen("game")}
            onBack={() => setScreen("mode-select")}
          />
        ) : screen === "game" ? (
          <GameScreen pattern={pattern} boardSize={boardSize}
            onChangeSettings={() => setScreen("settings")} />
        ) : screen === "challenge-settings" ? (
          <SettingsPanel
            pattern={pattern} boardSize={boardSize}
            title="チャレンジモード"
            onPatternChange={setPattern} onBoardSizeChange={setBoardSize}
            onStart={() => setScreen("challenge")}
            onBack={() => setScreen("mode-select")}
          />
        ) : screen === "challenge" ? (
          <ChallengeGameScreen pattern={pattern} boardSize={boardSize}
            onChangeSettings={() => setScreen("challenge-settings")} />
        ) : screen === "level-select" ? (
          <LevelSelectScreen
            onSelectLevel={(pat, sz, idx) => {
              setAdvPattern(pat); setAdvSize(sz); setAdvIndex(idx);
              setScreen("adventure");
            }}
            onBack={() => setScreen("mode-select")}
          />
        ) : (
          <AdventureGameScreen
            key={`${advPattern}_${advSize}_${advIndex}`}
            pattern={advPattern} size={advSize} levelIndex={advIndex}
            onComplete={handleAdventureComplete}
            onBack={() => setScreen("level-select")}
          />
        )}
      </div>
    </main>
  );
}
