import { OrbitControls } from "@react-three/drei";
import Lights from "../Lights/Lights";
import Level from "../Level/Level";
import { Physics } from "@react-three/rapier";
import Player from "../Player/Player";
import { useControls } from "leva";

export default function Experience() {
  const { orbit } = useControls("Experience", {
    orbit: false,
  });
  
  return (
    <>
      {orbit && <OrbitControls makeDefault />}

      <Lights />

      <Physics debug={true}>
        <Level count={0} />
        <Player />
      </Physics>
    </>
  );
}
