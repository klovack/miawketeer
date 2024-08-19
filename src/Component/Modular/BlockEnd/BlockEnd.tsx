import { CuboidCollider, RigidBody } from "@react-three/rapier";
import Chest from "../../Model/Chest/Chest";
import Block, { BlockProps } from "../Block/Block";
import { useState } from "react";

export type BlockEndProps = BlockProps;

export default function BlockEnd({
  size = [4, 0.2, 4],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: BlockEndProps) {
  const [isChestOpen, setIsChestOpen] = useState(false);

  const handleChestOpen = () => {
    setIsChestOpen(true);
  };

  return (
    <group position={position} rotation={rotation}>
      {/* <RigidBody ref={floorRef} type={"fixed"}> */}
      <Block size={size} type="floor1" />
      {/* </RigidBody> */}

      <RigidBody
        name="chest"
        onIntersectionEnter={({ other }) => {
          if (other.rigidBodyObject?.name === "player") {
            handleChestOpen();
          }
        }}
        colliders={false}
        position={[0, 0, -1.2]}
      >
        <CuboidCollider args={[0.3, 0.3, 0.2]} position={[0, 0.3, 0.05]} />
        <CuboidCollider args={[0.5, 0.3, 0.5]} position={[0, 0.3, 0]} sensor />
        <Chest isOpen={isChestOpen} scale={0.3} />
      </RigidBody>
    </group>
  );
}
