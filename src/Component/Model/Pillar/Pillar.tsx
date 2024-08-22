import { Gltf, useGLTF } from "@react-three/drei";
import { Euler, Vector3 } from "@react-three/fiber";
import { useEffect } from "react";
import { MeshPhysicalMaterial } from "three";

export type PillarProps = {
  position?: Vector3;
  rotation?: Euler;
  scale?: number;
};

const Pillar = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: PillarProps) => {
  const { materials } = useGLTF("/models/pillar.glb");
  useEffect(() => {
    const material = materials[
      "retroInteriors_varC.029"
    ] as MeshPhysicalMaterial;
    material.roughness = 0.8;
    material.metalness = 0.3;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Gltf
        position={position}
        rotation={rotation}
        src={"/models/pillar.glb"}
        scale={0.54 * scale}
      />
    </>
  );
};

export default Pillar;
