import { useAnimations, useGLTF } from "@react-three/drei";
import { Euler, Vector3 } from "@react-three/fiber";
import { useCallback, useEffect, useRef } from "react";
import { FrontSide, LoopOnce, Mesh, MeshPhysicalMaterial } from "three";

export type ChestProps = {
  position?: Vector3;
  scale?: number;
  isOpen: boolean;
  rotation?: Euler;
};

export default function Chest({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 0.5,
  isOpen = false,
}: ChestProps) {
  const chest = useGLTF("/models/chest.glb");
  const chestRef = useRef<Mesh>(null);

  const chestAnim = useAnimations(chest.animations, chestRef);
  chest.scene.traverse((child) => {
    child.castShadow = true;
  });

  useEffect(() => {
    chestAnim.actions["Closed"]?.play();
  }, [chestAnim]);

  useEffect(() => {
    const material = chest.materials[
      "atlas_retroForest_extras_A.005"
    ] as MeshPhysicalMaterial;
    material.roughness = 0.3;
    material.metalness = 0.85;
    material.side = FrontSide;
  }, [chest.materials]);

  const openChest = useCallback(() => {
    chestAnim.actions["Closed"]?.stop();
    chestAnim.actions["Open"]?.play().setLoop(LoopOnce, 1);
    if (chestAnim.actions["Open"]) {
      chestAnim.actions["Open"].clampWhenFinished = true;
    }
  }, [chestAnim]);

  useEffect(() => {
    if (isOpen) {
      openChest();
    }
  }, [isOpen, openChest]);

  return (
    <>
      <primitive
        ref={chestRef}
        object={chest.scene}
        position={position}
        scale={scale}
        rotation={rotation}
      />
    </>
  );
}

useGLTF.preload("/models/chest.glb");
