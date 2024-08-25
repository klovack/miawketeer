import { Perf } from "r3f-perf";
import "./App.scss";
import { Canvas } from "@react-three/fiber";
import Experience from "./Component/Experience/Experience";
import { KeyboardControls, KeyboardControlsEntry } from "@react-three/drei";
import { useMemo } from "react";
import { controlMap, Controls } from "./controls";
import { isDebug } from "./utils/isDebug";
import { Leva } from "leva";
import UI from "./Component/UI/UI";
import AudioManager from "./Component/AudioManager/AudioManager";

const App = () => {
  const map = useMemo<KeyboardControlsEntry<Controls>[]>(() => controlMap, []);

  const isDebugMode = isDebug();

  return (
    <>
      <Leva hidden={!isDebugMode} collapsed={true} />
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

        <UI />
      </KeyboardControls>
    </>
  );
};

export default App;
