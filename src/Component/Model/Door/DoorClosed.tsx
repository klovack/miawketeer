import { Gltf } from "@react-three/drei";
import { Euler, Vector3 } from "@react-three/fiber";

export type DoorClosedProps = {
  position?: Vector3;
  scale?: number;
  rotation?: Euler;
};

export function DoorClosed({ scale = 1, ...props }: DoorClosedProps) {
  return (
    <>
      <Gltf src="/models/door1_closed.glb" scale={0.3 * scale} {...props} />
    </>
  );
}
