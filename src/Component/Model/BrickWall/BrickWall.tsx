import { Gltf } from "@react-three/drei";
import { Euler, Vector3 } from "@react-three/fiber";

export type BrickWallProps = {
  position?: Vector3;
  rotation?: Euler;
};

const BrickWall = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: BrickWallProps) => {
  return (
    <>
      <Gltf
        receiveShadow
        castShadow
        position={position}
        rotation={rotation}
        src={"/models/wall.glb"}
        scale={0.5}
      />
    </>
  );
};

export default BrickWall;
