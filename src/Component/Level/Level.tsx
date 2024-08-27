import { lazy, Suspense, useMemo } from "react";
import BlockEnd from "../Modular/BlockEnd/BlockEnd";
import BlockStart from "../Modular/BlockStart/BlockStart";
import { LevelBlockTypes } from "./types";
import Wall from "../Modular/Wall/Wall";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import CoinLines from "../Modular/CoinLines/CoinLines";

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
        case LevelBlockTypes.AXE: {
          const BlockAxe = lazy(() => import("../Modular/BlockAxe/BlockAxe"));
          return <BlockAxe key={index} position={[0, 0, curCount * 4]} />;
        }
        case LevelBlockTypes.LIMBO: {
          const BlockLimbo = lazy(
            () => import("../Modular/BlockLimbo/BlockLimbo")
          );
          return <BlockLimbo key={index} position={[0, 0, curCount * 4]} />;
        }
        case LevelBlockTypes.SPINNER: {
          const BlockSpinner = lazy(
            () => import("../Modular/BlockSpinner/BlockSpinner")
          );
          return <BlockSpinner key={index} position={[0, 0, curCount * 4]} />;
        }
        default:
          return null;
      }
    });
  }, [count, types]);

  const numOfCoinLines = useMemo(() => {
    return Math.max(0, Math.floor(Math.random() * (count - 1)) + 1);
  }, [count]);

  return (
    <>
      <BlockStart rotation={[0, 0, 0]} />

      <Suspense>{blocks}</Suspense>
      <BlockEnd
        position={[0, 0, -(count + 1) * 4]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <Wall length={count + 2} />

      {/* Floor */}
      <RigidBody type="fixed" restitution={0.1} friction={0} name="ground">
        <CuboidCollider
          args={[2, 0.1, (count + 2) * 2]}
          position={[0, -0.1, (count + 1) * -2]}
        />
        {/* <CuboidCollider
          args={[2, 1, (count + 2) * 2]}
          position={[0, 3.2, (count + 1) * -2]}
        /> */}
      </RigidBody>

      <RigidBody
        colliders={false}
        type={"fixed"}
        name="death"
        position={[0, -5, (count + 1) * -2]}
      >
        <CuboidCollider args={[20, 1, (count + 2) * 5]} />
      </RigidBody>

      {Array.from({ length: numOfCoinLines }).map((_, index) => (
        <CoinLines
          key={index}
          position={[
            [0, -1.2, 1.2][Math.floor(Math.random() * 3)],
            0,
            -(index + 1) * 4,
          ]}
          max={8}
          min={3}
          gap={0.8}
          values={[1]}
        />
      ))}
    </>
  );
}
