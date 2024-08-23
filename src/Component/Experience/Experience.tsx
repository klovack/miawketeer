import Lights from "../Lights/Lights";
import Level from "../Level/Level";
import { Physics } from "@react-three/rapier";
import Player from "../Player/Player";
import { useControls } from "leva";
import { isDebug } from "../../utils/isDebug";
import {
  LevelPhase,
  useGameManagerStore,
} from "../../Store/GameManagerStore/GameManagerStore";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";

const OrbitControls = lazy(() =>
  import("@react-three/drei").then((mod) => ({ default: mod.OrbitControls }))
);

const bgMusic = new Audio("/audio/bgmusic.mp3");
const bgDeath = new Audio("/audio/death.mp3");

export default function Experience() {
  const { orbit } = useControls("Experience", {
    orbit: false,
  });

  const { level, phase, start, health } = useGameManagerStore((state) => ({
    level: state.level,
    phase: state.levelPhase,
    start: state.start,
    health: state.health,
  }));
  const [isPlaying, setIsPlaying] = useState(phase !== LevelPhase.END);
  const [isDebugMode] = useState(isDebug());

  useEffect(() => {
    if (health > 0 && bgMusic.paused) {
      bgDeath.pause();

      bgMusic.currentTime = 0;
      bgMusic.volume = 0.5;
      bgMusic.loop = true;
      bgMusic.play();
    } else if (health <= 0 && bgDeath.paused) {
      bgDeath.volume = 0.5;
      bgDeath.currentTime = 0.5;
      bgMusic.pause();
      bgDeath.play();
    }
  }, [health]);

  useEffect(() => {
    if (phase === LevelPhase.END) {
      setIsPlaying(false);
      setTimeout(() => {
        start();
        setIsPlaying(true);
      }, 10);
    }
  }, [phase, start]);

  const game = useMemo(() => {
    return (
      isPlaying && (
        <Suspense fallback={null}>
          <Physics debug={isDebugMode}>
            <Level count={level} />
            <Player />
          </Physics>
        </Suspense>
      )
    );
  }, [isPlaying, isDebugMode, level]);

  return (
    <>
      {orbit && <OrbitControls makeDefault />}

      <Lights />

      {game}
    </>
  );
}
