import { Euler, useFrame, Vector3 } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { Euler as EulerThree, Quaternion } from "three";

export type CoinProps = {
  position?: Vector3;
  rotation?: Euler;
  speed?: number;
  randomness?: number;
  value?: number;
  collectorNames: string[];
  onCoinCollected?: (value: number) => void;
};

const Coin = ({
  speed = 2,
  randomness = 1,
  onCoinCollected,
  value = 1,
  collectorNames = ["player"],
  ...props
}: CoinProps) => {
  const coinRef = useRef<RapierRigidBody>(null);
  useFrame(({ clock }) => {
    if (coinRef.current && !isCollected) {
      const time = clock.getElapsedTime();
      const euler = new EulerThree(0, time * speed * randomness, 0);
      const quot = new Quaternion().setFromEuler(euler);
      coinRef.current.setNextKinematicRotation(quot);
    }
  });
  const [isCollected, setIsCollected] = useState(false);

  useEffect(() => {
    if (isCollected) {
      coinRef.current?.sleep();
    }
  }, [isCollected]);

  return (
    <RigidBody
      onIntersectionEnter={({ other }) => {
        if (!other.rigidBodyObject?.name || isCollected) return;

        if (collectorNames.includes(other.rigidBodyObject.name)) {
          setIsCollected(true);
          onCoinCollected?.(value);
        }
      }}
      type={"kinematicPosition"}
      canSleep={true}
      sensor
      name="coin"
      scale={1 + value * 0.2}
      ref={coinRef}
      {...props}
    >
      <mesh
        visible={!isCollected}
        position={[0, 0.2, 0]}
        scale={0.3}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.5, 0.5, 0.1, 8]} />
        <meshStandardMaterial color="gold" />
      </mesh>
    </RigidBody>
  );
};

export default Coin;
