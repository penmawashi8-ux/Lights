"use client";

import { useState } from "react";
import SettingsPanel from "@/components/SettingsPanel";
import GameScreen from "@/components/GameScreen";
import { Pattern, Difficulty, BoardSize } from "@/lib/gameLogic";

type Screen = "settings" | "game";

// Firefly dots scattered in background
const FIREFLIES = [
  { top: "8%",  left: "12%", delay: "0s",    dur: "2.8s" },
  { top: "15%", left: "80%", delay: "0.7s",  dur: "3.2s" },
  { top: "30%", left: "5%",  delay: "1.2s",  dur: "2.5s" },
  { top: "45%", left: "92%", delay: "0.3s",  dur: "3.6s" },
  { top: "60%", left: "18%", delay: "1.8s",  dur: "2.9s" },
  { top: "75%", left: "88%", delay: "0.9s",  dur: "3.1s" },
  { top: "85%", left: "35%", delay: "2.1s",  dur: "2.7s" },
  { top: "20%", left: "50%", delay: "1.5s",  dur: "3.4s" },
  { top: "55%", left: "65%", delay: "0.5s",  dur: "2.6s" },
  { top: "90%", left: "72%", delay: "1.1s",  dur: "3.0s" },
];

export default function Home() {
  const [screen, setScreen] = useState<Screen>("settings");
  const [pattern, setPattern] = useState<Pattern>("plus");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [boardSize, setBoardSize] = useState<BoardSize>(5);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#071407] via-[#0d2410] to-[#071407] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* String lights at the top */}
      <div className="absolute top-0 left-0 right-0 flex justify-around pointer-events-none z-10 px-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-yellow-300 mt-3 firefly-dot shadow-sm shadow-yellow-300/60"
            style={{
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${2 + (i % 3) * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Firefly dots */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {FIREFLIES.map((f, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-yellow-300 firefly-dot"
            style={{
              top: f.top,
              left: f.left,
              animationDelay: f.delay,
              animationDuration: f.dur,
              boxShadow: "0 0 6px 2px rgba(253, 224, 71, 0.6)",
            }}
          />
        ))}
      </div>

      {/* Tree silhouettes */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pointer-events-none z-0 opacity-20 select-none text-6xl sm:text-7xl leading-none">
        <span>🌲</span>
        <span>🌳</span>
        <span>🌲</span>
        <span>🌳</span>
        <span>🌲</span>
        <span>🌳</span>
      </div>

      {/* Game content */}
      <div className="relative z-10 w-full">
        {screen === "settings" ? (
          <SettingsPanel
            pattern={pattern}
            difficulty={difficulty}
            boardSize={boardSize}
            onPatternChange={setPattern}
            onDifficultyChange={setDifficulty}
            onBoardSizeChange={setBoardSize}
            onStart={() => setScreen("game")}
          />
        ) : (
          <GameScreen
            pattern={pattern}
            difficulty={difficulty}
            boardSize={boardSize}
            onChangeSettings={() => setScreen("settings")}
          />
        )}
      </div>
    </main>
  );
}
