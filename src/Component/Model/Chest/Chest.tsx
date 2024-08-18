import { useAnimations, useGLTF } from "@react-three/drei";
import { Vector3 } from "@react-three/fiber";
import { useCallback, useEffect, useRef } from "react";
import { LoopOnce, Mesh } from "three";

export type ChestProps = {
  position?: Vector3;
  scale?: number;
  isOpen: boolean;
};

export default function Chest({
  position = [0, 0, 0],
  scale = 0.5,
  isOpen = false,
}: ChestProps) {
  const chest = useGLTF("/models/chest.glb");
  const chestRef = useRef<Mesh>(null);

  const chestAnim = useAnimations(chest.animations, chestRef);
  chest.scene.children.forEach((child) => {
    child.castShadow = true;
  });

  useEffect(() => {
    chestAnim.actions["Closed"]?.play();
  }, [chestAnim]);

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
      />
    </>
  );
}

useGLTF.preload("/models/chest.glb");
