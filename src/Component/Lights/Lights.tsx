import { useHelper } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { DirectionalLight, PointLight, PointLightHelper } from "three";
import { isDebug } from "../../utils/isDebug";
import { useControls } from "leva";
import {
  LevelPhase,
  useGameManagerStore,
} from "../../Store/GameManagerStore/GameManagerStore";

export default function Lights() {
  const directionalLightRef = useRef<DirectionalLight>(null);
  const pointLightRef = useRef<PointLight>(null!);
  const { isCinematic } = useGameManagerStore((state) => ({
    isCinematic: state.levelPhase === LevelPhase.START,
  }));

  const { pointLightHelper } = useControls("Lights", {
    pointLightHelper: true,
  });

  useHelper(
    isDebug() && pointLightHelper ? pointLightRef : false,
    PointLightHelper
  );

  useFrame(({ camera }) => {
    if (directionalLightRef.current) {
      directionalLightRef.current.position.setZ(camera.position.z - 2);
      directionalLightRef.current.target.position.setZ(camera.position.z - 3);
      directionalLightRef.current.target.updateMatrixWorld();
    }

    if (pointLightRef.current) {
      pointLightRef.current.position.setZ(
        camera.position.z - (isCinematic ? 2.5 : -0.2)
      );
      pointLightRef.current.updateMatrixWorld();
    }
  });

  return (
    <>
      {/* <directionalLight
        ref={directionalLightRef}
        castShadow
        position={[3, 3, -4]}
        intensity={2}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={10}
        shadow-camera-right={10}
        shadow-camera-bottom={-10}
        shadow-camera-left={-10}
      /> */}
      <pointLight
        castShadow
        intensity={10}
        position={[0, 1.1, 0]}
        ref={pointLightRef}
        color={"#E79483"}
      />
      <ambientLight intensity={1} />
    </>
  );
}
