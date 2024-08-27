import { RigidBody } from "@react-three/rapier";
import Block from "../Block/Block";
import { Euler, Vector3 } from "@react-three/fiber";

export type BlockGateProps = {
  position?: Vector3;
  rotation?: Euler;
  friction?: number;
  restitution?: number;
  scale?: Vector3;
  gap?: number;
};

const BlockGate = ({
  scale = 1,
  restitution = 0.5,
  friction = 0.5,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  gap = 1,
}: BlockGateProps) => {
  const posGap = gap * 0.3;
  return (
    <RigidBody
      name="obstacle"
      type={"fixed"}
      friction={friction}
      restitution={restitution}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <Block castShadow size={[0.05, 1.5, 0.05]} type="obstacle" />
      <Block
        size={[0.05, 1.5, 0.05]}
        position={[posGap, 0, 0]}
        type="obstacle"
      />
      <Block
        castShadow
        size={[0.05, 1.5, 0.05]}
        position={[posGap * 2, 0, 0]}
        type="obstacle"
      />
      <Block
        castShadow
        size={[0.05, 1.5, 0.05]}
        position={[-posGap, 0, 0]}
        type="obstacle"
      />
      <Block
        castShadow
        size={[0.05, 1.5, 0.05]}
        position={[-posGap * 2, 0, 0]}
        type="obstacle"
      />
    </RigidBody>
  );
};

export default BlockGate;
