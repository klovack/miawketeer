import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import Block, { BlockProps } from "../Block/Block";
import { useControls } from "leva";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

type BlockAxeProps = BlockProps;

export default function BlockAxe(props: BlockAxeProps) {
  const { obstaclePosition, obstacleRotation, friction, restitution, speed } =
    useControls(
      "BlockAxe",
      {
        obstaclePosition: [0, 0.1, 0],
        obstacleRotation: [0, 0, 0],
        friction: 0.5,
        restitution: 0.5,
        speed: 1,
      },
      {
        collapsed: true,
      }
    );

  const [randomness] = useState(() => Math.random() * Math.PI);
  const obstacle = useRef<RapierRigidBody | null>(null);

  useFrame(({ clock }) => {
    if (!obstacle.current) return;

    const time = clock.getElapsedTime();
    const x = Math.sin(time * speed * randomness) * 1.15;
    obstacle.current?.setNextKinematicTranslation({
      x: x,
      y: (props.position?.[1] ?? 0) + 1,
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
        <Block castShadow size={[0.05, 1.5, 0.05]} type="obstacle" />
        <Block
          size={[0.05, 1.5, 0.05]}
          position={[0.3, 0, 0]}
          type="obstacle"
        />
        <Block
          castShadow
          size={[0.05, 1.5, 0.05]}
          position={[0.6, 0, 0]}
          type="obstacle"
        />
        <Block
          castShadow
          size={[0.05, 1.5, 0.05]}
          position={[-0.3, 0, 0]}
          type="obstacle"
        />
        <Block
          castShadow
          size={[0.05, 1.5, 0.05]}
          position={[-0.6, 0, 0]}
          type="obstacle"
        />
      </RigidBody>
    </group>
  );
}
