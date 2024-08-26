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

export default function Experience() {
  const { orbit } = useControls("Experience", {
    orbit: false,
  });

  const { level, phase, start } = useGameManagerStore((state) => ({
    level: state.level,
    phase: state.levelPhase,
    start: state.start,
  }));
  const [isPlaying, setIsPlaying] = useState(phase !== LevelPhase.END);
  const [isDebugMode] = useState(isDebug());

  useEffect(() => {
    if (phase === LevelPhase.END) {
      setIsPlaying(false);
      setTimeout(() => {
        start();
        setIsPlaying(true);
      }, 5000);
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
