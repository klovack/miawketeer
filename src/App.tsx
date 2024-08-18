import { Perf } from "r3f-perf";
import "./App.scss";
import { Canvas } from "@react-three/fiber";
import Experience from "./Component/Experience/Experience";
import { KeyboardControls, KeyboardControlsEntry } from "@react-three/drei";
import { useMemo } from "react";
import { controlMap, Controls } from "./controls";

const App = () => {
  const map = useMemo<KeyboardControlsEntry<Controls>[]>(() => controlMap, []);

  return (
    <>
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
          <Perf position={"top-left"} />
          <Experience />
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default App;
