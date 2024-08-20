import { Gltf } from "@react-three/drei";
import { Euler, Vector3 } from "@react-three/fiber";

export type PillarProps = {
  position?: Vector3;
  rotation?: Euler;
  scale?: number;
};

const Pillar = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: PillarProps) => {
  return (
    <>
      <Gltf
        position={position}
        rotation={rotation}
        src={"/models/pillar.glb"}
        scale={0.54 * scale}
      />
    </>
  );
};

export default Pillar;
