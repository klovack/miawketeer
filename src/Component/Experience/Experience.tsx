import { OrbitControls } from "@react-three/drei";
import Lights from "../Lights/Lights";
import Level from "../Level/Level";
import { Physics } from "@react-three/rapier";

export default function Experience() {
  return (
    <>
      <OrbitControls makeDefault />

      <Lights />

      <Physics debug>
        <Level count={3} />
      </Physics>
    </>
  );
}
