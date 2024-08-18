import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import Chest from "../../Model/Chest/Chest";
import Block, { BlockProps } from "../Block/Block";
import { useRef, useState } from "react";

export type BlockEndProps = BlockProps;

export default function BlockEnd({
  size = [4, 0.2, 4],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: BlockEndProps) {
  const floorRef = useRef<RapierRigidBody>(null);
  const [isChestOpen, setIsChestOpen] = useState(false);

  const handleChestOpen = () => {
    setIsChestOpen(true);
  };

  return (
    <group position={position} rotation={rotation}>
      <RigidBody ref={floorRef} type={"fixed"}>
        <Block size={size} type="floor1" />
      </RigidBody>

      <RigidBody
        onIntersectionEnter={({ other }) => {
          if (other.rigidBodyObject?.name === "player") {
            handleChestOpen();
          }
        }}
        colliders={false}
        position={[0, 0, -1.2]}
      >
        <CuboidCollider args={[0.5, 0.43, 0.38]} position={[0, 0.43, 0.05]} />
        <CuboidCollider args={[1, 0.5, 1]} position={[0, 0.55, 0]} sensor />
        <Chest isOpen={isChestOpen} />
      </RigidBody>
    </group>
  );
}
