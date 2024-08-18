import { Perf } from "r3f-perf";
import "./App.scss";
import { Canvas } from "@react-three/fiber";
import Experience from "./Component/Experience/Experience";

const App = () => {
  return (
    <>
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
    </>
  );
};

export default App;
