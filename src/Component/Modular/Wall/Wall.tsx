import { useMemo } from "react";
import BrickWall from "../../Model/BrickWall/BrickWall";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import Pillar from "../../Model/Pillar/Pillar";

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
          <Pillar position={[-2.3, 0, 0]} />
          <BrickWall
            key={`${index}-l2`}
            position={[-2.001, 0, 1]}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Right walls */}
          {/* <BrickWall
            key={`${index}-r1`}
            position={[2, 0, -1]}
            rotation={[0, Math.PI / 2, 0]}
          />
          <BrickWall
            key={`${index}-r2`}
            position={[2, 0, 1]}
            rotation={[0, -Math.PI / 2, 0]}
          /> */}
        </group>
      );
    });
  }, [length]);

  return (
    <RigidBody type="fixed" restitution={0.2} friction={0}>
      {/* Start Wall */}
      <BrickWall position={[-1, 0, 2]} />
      <BrickWall position={[1, 0, 2]} />
      {/* <CuboidCollider args={[2, 1, 0.1]} position={[0, 1, 2]} /> */}

      {walls}

      {/* Right Collider Wall */}
      <CuboidCollider
        args={[0.1, 1, length * 2]}
        position={[2, 1, (length - 1) * -2]}
      />

      {/* End Wall */}
      <BrickWall position={[-1, 0, length * -4 + 2]} />
      <Pillar position={[0, 1.2, length * -4 + 2]} scale={0.47} />
      <BrickWall position={[1, 0, length * -4 + 2]} />
    </RigidBody>
  );
};

export default Wall;
