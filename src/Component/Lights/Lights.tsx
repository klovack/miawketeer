import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { DirectionalLight } from "three";

export default function Lights() {
  const directionalLightRef = useRef<DirectionalLight>(null);

  useFrame(({ camera }) => {
    if (directionalLightRef.current) {
      directionalLightRef.current.position.setZ(camera.position.z - 2);
      directionalLightRef.current.target.position.setZ(camera.position.z - 3);
      directionalLightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <>
      <directionalLight
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
      />
      <ambientLight intensity={1.5} />
    </>
  );
}
