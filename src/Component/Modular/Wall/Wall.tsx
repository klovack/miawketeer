import { useMemo } from "react";
import BrickWall from "../../Model/BrickWall/BrickWall";
import { RigidBody } from "@react-three/rapier";

export type WallProps = {
  length: number;
};

const Wall = ({ length }: WallProps) => {
  const walls = useMemo(() => {
    return Array.from({ length }, (_, index) => {
      return (
        <group key={index} position={[0, 0, index * -4]}>
          {/* Left walls */}
          <BrickWall
            key={`${index}-l1`}
            position={[-2, 0, -1]}
            rotation={[0, Math.PI / 2, 0]}
          />
          <BrickWall
            key={`${index}-l2`}
            position={[-2, 0, 1]}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Right walls */}
          <BrickWall
            key={`${index}-r1`}
            position={[2, 0, -1]}
            rotation={[0, Math.PI / 2, 0]}
          />
          <BrickWall
            key={`${index}-r2`}
            position={[2, 0, 1]}
            rotation={[0, -Math.PI / 2, 0]}
          />
        </group>
      );
    });
  }, [length]);

  return (
    <RigidBody type="fixed" restitution={0.2} friction={0}>
      <BrickWall position={[-1, 0, 2]} />
      <BrickWall position={[1, 0, 2]} />
      {walls}
      <BrickWall position={[-1, 0, length * -4 + 2]} />
      <BrickWall position={[1, 0, length * -4 + 2]} />
    </RigidBody>
  );
};

export default Wall;
