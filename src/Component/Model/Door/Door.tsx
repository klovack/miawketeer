import { useGLTF } from "@react-three/drei";
import { Euler, Vector3 } from "@react-three/fiber";
import {
  CollisionTarget,
  CuboidCollider,
  RigidBody,
} from "@react-three/rapier";

export type DoorProps = {
  position?: Vector3;
  scale?: number;
  rotation?: Euler;
  onDoorEnter?: (other: CollisionTarget) => void;
};

export default function Door({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  onDoorEnter,
}: DoorProps) {
  const door = useGLTF("/models/door1.glb");

  return (
    <RigidBody
      position={position}
      rotation={rotation}
      scale={scale}
      type="fixed"
      colliders={undefined}
    >
      <CuboidCollider
        sensor
        args={[0.1, 0.5, 0.5]}
        position={[-0.05, 0.6, 0]}
        onIntersectionEnter={({ other }) => {
          onDoorEnter?.(other);
        }}
      />
      <primitive
        object={door.scene}
        rotation={[0, -Math.PI / 2, 0]}
        scale={0.3}
      />
    </RigidBody>
  );
}
