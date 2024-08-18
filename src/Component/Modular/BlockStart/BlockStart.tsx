import Block, { BlockProps } from "../Block/Block";

export type BlockStartProps = BlockProps;

export default function BlockStart({
  size = [4, 0.2, 4],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: BlockStartProps) {
  return (
    <Block size={size} position={position} rotation={rotation} type="floor1" />
  );
}
