import { OrbitControls } from "@react-three/drei";
import Lights from "../Lights/Lights";
import Level from "../Level/Level";
import { Physics } from "@react-three/rapier";
import Player from "../Player/Player";
import { useControls } from "leva";
import { isDebug } from "../../utils/isDebug";

export default function Experience() {
  const { orbit } = useControls("Experience", {
    orbit: false,
  });

  const isDebugMode = isDebug();

  return (
    <>
      {orbit && <OrbitControls makeDefault />}

      <Lights />

      <Physics debug={isDebugMode}>
        <Level count={10} />
        <Player />
      </Physics>
    </>
  );
}
