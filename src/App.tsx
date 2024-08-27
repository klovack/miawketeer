import { Perf } from "r3f-perf";
import "./App.scss";
import { Canvas } from "@react-three/fiber";
import Experience from "./Component/Experience/Experience";
import { KeyboardControls, KeyboardControlsEntry } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import { controlMap, Controls } from "./controls";
import { isDebug } from "./utils/isDebug";
import { Leva } from "leva";
import UI from "./Component/UI/UI";
import AudioManager from "./Component/AudioManager/AudioManager";
import MenuUI from "./Component/UI/MenuUI/MenuUI";
import {
  LevelPhase,
  useGameManagerStore,
} from "./Store/GameManagerStore/GameManagerStore";
import Menu from "./Component/Menu/Menu";
import { TouchControls } from "./Store/TouchControlsStore/TouchControls";

const App = () => {
  const map = useMemo<KeyboardControlsEntry<Controls>[]>(() => controlMap, []);
  const [isPlaying, setIsPlaying] = useState(false);
  const { levelPhase } = useGameManagerStore((state) => ({
    levelPhase: state.levelPhase,
  }));

  useEffect(() => {
    if (levelPhase === LevelPhase.MENU) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  }, [levelPhase]);

  const isDebugMode = isDebug();

  return (
    <>
      <Leva hidden={!isDebugMode} collapsed={true} />
      {!isPlaying && (
        <>
          <Menu />
          <MenuUI />
        </>
      )}
      {isPlaying && (
        <>
          <AudioManager />
          <KeyboardControls map={map}>
            <Canvas
              shadows
              camera={{
                fov: 45,
                near: 0.1,
                far: 200,
                position: [2.5, 4, 6],
              }}
            >
              {isDebugMode && <Perf position={"top-left"} />}
              <Experience />
            </Canvas>

            <TouchControls />

            <UI />
          </KeyboardControls>
        </>
      )}
    </>
  );
};

export default App;
