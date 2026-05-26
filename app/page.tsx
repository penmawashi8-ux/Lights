"use client";

import { useState } from "react";
import SettingsPanel from "@/components/SettingsPanel";
import GameScreen from "@/components/GameScreen";
import { Pattern, Difficulty, BoardSize } from "@/lib/gameLogic";

type Screen = "settings" | "game";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("settings");
  const [pattern, setPattern] = useState<Pattern>("plus");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [boardSize, setBoardSize] = useState<BoardSize>(5);

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-8">
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
    </main>
  );
}
