import { Text } from "@react-three/drei";
import { useGameManagerStore } from "../../../Store/GameManagerStore/GameManagerStore";
import Block, { BlockProps } from "../Block/Block";

export type BlockStartProps = BlockProps;

export default function BlockStart({
  size = [4, 0.2, 4],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: BlockStartProps) {
  const level = useGameManagerStore((state) => state.level);

  return (
    <>
      <Block
        receiveShadow
        size={size}
        position={position}
        rotation={rotation}
        type="floor1"
      />
      <Text
        font="/fonts/MedievalSharp.ttf"
        position={[0, 0.00005, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        scale={2}
        outlineColor={"#000000"}
        outlineWidth={0.02}
        color={"#f8ffc7"}
      >
        {level}
      </Text>
    </>
  );
}
