import { useMemo } from "react";
import BlockAxe from "../Modular/BlockAxe/BlockAxe";
import BlockEnd from "../Modular/BlockEnd/BlockEnd";
import BlockLimbo from "../Modular/BlockLimbo/BlockLimbo";
import BlockSpinner from "../Modular/BlockSpinner/BlockSpinner";
import BlockStart from "../Modular/BlockStart/BlockStart";
import { LevelBlockTypes } from "./types";
import Wall from "../Modular/Wall/Wall";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

export type LevelProps = {
  count?: number;
  types?: Set<LevelBlockTypes>;
};

export default function Level({
  count = 5,
  types = new Set([
    LevelBlockTypes.AXE,
    LevelBlockTypes.LIMBO,
    LevelBlockTypes.SPINNER,
  ]),
}: LevelProps) {
  const blocks = useMemo(() => {
    return Array.from({ length: count }, (_, index) => {
      const type = Array.from(types)[Math.floor(Math.random() * types.size)];
      const curCount = -(index + 1);
      switch (type) {
        case LevelBlockTypes.AXE:
          return <BlockAxe key={index} position={[0, 0, curCount * 4]} />;
        case LevelBlockTypes.LIMBO:
          return <BlockLimbo key={index} position={[0, 0, curCount * 4]} />;
        case LevelBlockTypes.SPINNER:
          return <BlockSpinner key={index} position={[0, 0, curCount * 4]} />;
        default:
          return null;
      }
    });
  }, [count, types]);

  return (
    <>
      <BlockStart rotation={[0, 0, 0]} />
      {blocks}
      <BlockEnd position={[0, 0, -(count + 1) * 4]} />
      <Wall length={count + 2} />

      {/* Floor */}
      <RigidBody type="fixed" restitution={0.1} friction={0.5} name="ground">
        <CuboidCollider
          args={[2, 0.1, (count + 2) * 2]}
          position={[0, -0.1, (count + 1) * -2]}
        />
      </RigidBody>
    </>
  );
}
