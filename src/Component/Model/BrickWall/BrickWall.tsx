import { Gltf, useGLTF } from "@react-three/drei";
import { Euler, Vector3 } from "@react-three/fiber";
import { useEffect } from "react";
import { FrontSide, MeshPhysicalMaterial } from "three";

export type BrickWallProps = {
  position?: Vector3;
  rotation?: Euler;
  scale?: number;
};

const BrickWall = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: BrickWallProps) => {
  const { materials } = useGLTF("/models/wall.glb");

  useEffect(() => {
    const material = materials["retroVillage_varA.042"] as MeshPhysicalMaterial;
    material.roughness = 0.6;
    material.metalness = 0.8;
    material.side = FrontSide;
  }, [materials]);

  return (
    <>
      <Gltf
        receiveShadow
        position={position}
        rotation={rotation}
        src={"/models/wall.glb"}
        scale={0.54 * scale}
      />
    </>
  );
};

export default BrickWall;
