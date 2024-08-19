import { OrbitControls } from "@react-three/drei";
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
import { useEffect } from "react";

export default function Experience() {
  const { orbit } = useControls("Experience", {
    orbit: false,
  });

  const level = useGameManagerStore((state) => state.level);
  const phase = useGameManagerStore((state) => state.levelPhase);
  const start = useGameManagerStore((state) => state.start);

  useEffect(() => {
    if (phase === LevelPhase.END) {
      setTimeout(() => {
        start();
      }, 1000);
    }
  }, [phase, start]);

  const isDebugMode = isDebug();

  return (
    <>
      {orbit && <OrbitControls makeDefault />}

      <Lights />

      {phase !== LevelPhase.END && (
        <Physics debug={isDebugMode}>
          <Level count={level} />
          <Player />
        </Physics>
      )}
    </>
  );
}
