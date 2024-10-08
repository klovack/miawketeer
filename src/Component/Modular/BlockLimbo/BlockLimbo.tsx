import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import Block, { BlockProps } from "../Block/Block";
import { useControls } from "leva";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

type BlockLimboProps = BlockProps;

export default function BlockLimbo(props: BlockLimboProps) {
  const { obstaclePosition, obstacleRotation, friction, restitution, speed } =
    useControls(
      "BlockLimbo",
      {
        obstaclePosition: [0, 0.3, 0],
        obstacleRotation: [0, 0, 0],
        friction: 0.5,
        restitution: 0.5,
        speed: 1,
      },
      { collapsed: true }
    );

  const [randomness] = useState(() => Math.random() * Math.PI);
  const obstacle = useRef<RapierRigidBody | null>(null);

  useFrame(({ clock }) => {
    if (!obstacle.current) return;

    const time = clock.getElapsedTime();
    const y = Math.sin(time * speed * randomness) + 1.2;
    obstacle.current?.setNextKinematicTranslation({
      x: props.position?.[0] ?? 0,
      y: (props.position?.[1] ?? 0) + y,
      z: props.position?.[2] ?? 0,
    });
  });

  return (
    <group {...props}>
      <Block
        receiveShadow
        size={[4, 0.2, 4]}
        position={[0, 0, 0]}
        type="floor2"
      />
      <RigidBody
        name="obstacle"
        ref={obstacle}
        type={"kinematicPosition"}
        friction={friction}
        restitution={restitution}
        position={obstaclePosition}
        rotation={obstacleRotation}
      >
        <Block castShadow size={[3.8, 0.05, 0.05]} type="obstacle" />
        <Block
          castShadow
          size={[3.8, 0.05, 0.05]}
          position={[0, 0.1, 0]}
          type="obstacle"
        />
        <Block
          castShadow
          size={[3.8, 0.05, 0.05]}
          position={[0, 0.2, 0]}
          type="obstacle"
        />
      </RigidBody>
    </group>
  );
}
