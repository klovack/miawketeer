import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import Block, { BlockProps } from "../Block/Block";
import { useControls } from "leva";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Euler, Quaternion } from "three";

type BlockSpinnerProps = BlockProps;

export default function BlockSpinner(props: BlockSpinnerProps) {
  const { obstaclePosition, obstacleRotation, friction, restitution, speed } =
    useControls(
      "BlockSpinner",
      {
        obstaclePosition: [0, 0.3, 0],
        obstacleRotation: [0, 0, 0],
        friction: 0.5,
        restitution: 0.5,
        speed: 5,
      },
      {
        collapsed: true,
      }
    );

  const [randomness] = useState(Math.random() - 0.5);
  const obstacle = useRef<RapierRigidBody | null>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const euler = new Euler(0, time * speed * randomness, 0);
    const quot = new Quaternion().setFromEuler(euler);
    obstacle.current?.setNextKinematicRotation(quot);
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
          size={[3.8, 0.05, 0.05]}
          position={[0, 0, 0.2]}
          type="obstacle"
          castShadow
        />
        <Block
          castShadow
          size={[3.8, 0.05, 0.05]}
          position={[0, 0, -0.2]}
          type="obstacle"
        />
      </RigidBody>
    </group>
  );
}
