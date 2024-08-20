import {
  CollisionTarget,
  CuboidCollider,
  RigidBody,
} from "@react-three/rapier";
import Chest from "../../Model/Chest/Chest";
import Block, { BlockProps } from "../Block/Block";
import { useState } from "react";
import Door from "../../Model/Door/Door";
import {
  LevelPhase,
  useGameManagerStore,
} from "../../../Store/GameManagerStore/GameManagerStore";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

export type BlockEndProps = BlockProps;

export default function BlockEnd({
  size = [4, 0.2, 4],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: BlockEndProps) {
  const [isChestOpen, setIsChestOpen] = useState(false);
  const {
    nextLevel,
    increasePointMultiplier,
    resetPointMultiplier,
    addPoints,
    pointMultiplier,
    level,
    levelPhase,
    play,
  } = useGameManagerStore((state) => ({
    level: state.level,
    levelPhase: state.levelPhase,
    play: state.play,
    pointMultiplier: state.pointMultiplier,
    nextLevel: state.nextLevel,
    increasePointMultiplier: state.increasePointMultiplier,
    resetPointMultiplier: state.resetPointMultiplier,
    addPoints: state.addPoints,
  }));
  const [chestPoints] = useState(Math.floor(Math.random() * 10 + level * 10));
  const [smoothCameraPosition] = useState(new Vector3(0, 2, 3.5));

  useFrame(({ camera }, delta) => {
    if (levelPhase === LevelPhase.START) {
      smoothCameraPosition.lerp(
        { x: position[0] + 3.5, y: position[1] + 1.5, z: position[2] },
        0.5 * delta
      );
      camera.position.copy(smoothCameraPosition);
      camera.lookAt(position[0], position[1], position[2]);

      if (
        camera.position.distanceTo({
          x: position[0] + 3.5,
          y: position[1] + 1.5,
          z: position[2],
        }) < 0.8
      ) {
        play();
      }
    }
  });

  const handleChestOpen = (other: CollisionTarget) => {
    if (other.rigidBodyObject?.name === "player") {
      addPoints(chestPoints * pointMultiplier);
      resetPointMultiplier();
      setIsChestOpen(true);
    }
  };

  const handleDoorEnter = (other: CollisionTarget) => {
    if (other.rigidBodyObject?.name === "player") {
      if (!isChestOpen) {
        increasePointMultiplier();
      }
      nextLevel();
    }
  };

  return (
    <group position={position} rotation={rotation}>
      {/* <RigidBody ref={floorRef} type={"fixed"}> */}
      <Block receiveShadow size={size} type="floor1" />
      {/* </RigidBody> */}

      <RigidBody
        name="chest"
        onIntersectionEnter={({ other }) => {
          handleChestOpen(other);
        }}
        colliders={false}
        position={[0, 0, -1.2]}
      >
        <CuboidCollider args={[0.3, 0.3, 0.2]} position={[0, 0.3, 0.05]} />
        <CuboidCollider args={[0.5, 0.3, 0.5]} position={[0, 0.3, 0]} sensor />
        <Chest isOpen={isChestOpen} scale={0.3} />
      </RigidBody>

      <Door onDoorEnter={handleDoorEnter} position={[1.92, 0, 0]} />
    </group>
  );
}
