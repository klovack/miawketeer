import { Gltf } from "@react-three/drei";
import { Euler, Vector3 } from "@react-three/fiber";

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
