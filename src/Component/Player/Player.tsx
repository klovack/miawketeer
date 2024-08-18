import { useKeyboardControls } from "@react-three/drei";
import Musketeer from "../Model/Musketeer/Musketeer";
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { Controls } from "../../controls";
import { useFrame } from "@react-three/fiber";
import { Euler, Quaternion } from "three";

const Player = () => {
  // const playerProps = useControls("Player", {
  //   isJumping: false,
  //   isAttacking: false,
  //   isDamaged: false,
  //   isVictorious: false,
  //   velocity: 0,
  // });
  const rbRef = useRef<RapierRigidBody>(null);
  const [isJumping, setIsJumping] = useState(false);
  const [velocity, setVelocity] = useState(0);
  // for using ray
  // const { rapier, world } = useRapier();

  const [subKey, getKey] = useKeyboardControls<Controls>();

  useEffect(() => {
    return subKey(
      (state) => state.jump,
      (pressed) => {
        if (pressed && !isJumping) {
          // using ray
          // const origin = rbRef.current?.translation() ?? { x: 0, y: 0, z: 0 };
          // origin.y -= 0.31;
          // const direction = { x: 0, y: -1, z: 0 };
          // const ray = new rapier.Ray(origin, direction);
          // const hit = world?.castRay(ray, 10, true);

          // if (hit?.timeOfImpact ?? 0 < 0.15 ) {
          //   rbRef.current?.applyImpulse({ x: 0, y: 0.07, z: 0 }, true);
          // }

          setIsJumping(true);
          rbRef.current?.applyImpulse({ x: 0, y: 0.07, z: 0 }, true);
        }
      }
    );
  });

  useFrame((_, delta) => {
    const { forward, back, left, right } = getKey();
    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.2 * delta;
    const torqueStrength = 0.1 * delta;
    let eulerRot: Euler | undefined = undefined;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
      eulerRot = new Euler(0, 0, 0);
    }

    if (back) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
      eulerRot = new Euler(0, Math.PI, 0);
    }

    if (left) {
      impulse.x -= impulseStrength;
      torque.z -= torqueStrength;
      eulerRot = new Euler(0, Math.PI / 2, 0);
    }

    if (right) {
      impulse.x += impulseStrength;
      torque.z += torqueStrength;
      eulerRot = new Euler(0, -Math.PI / 2, 0);
    }

    if (eulerRot) {
      const rot = new Quaternion().setFromEuler(eulerRot);
      rbRef.current?.setRotation(rot, true);
    }
    rbRef.current?.applyImpulse(impulse, true);
    rbRef.current?.applyTorqueImpulse(torque, true);

    const vel = rbRef.current?.linvel();

    setVelocity(Math.pow(vel?.x ?? 0, 2) + Math.pow(vel?.z ?? 0, 2));
  });

  return (
    <>
      <RigidBody
        name="player"
        position={[0, 1, 0]}
        restitution={0.6}
        friction={1}
        linearDamping={1.5}
        enabledRotations={[false, false, false]}
        ref={rbRef}
        mass={5}
        colliders={false}
      >
        <CuboidCollider args={[0.1, 0.2, 0.1]} position={[0, 0.2, 0]} />
        <CuboidCollider
          onIntersectionEnter={({ other }) => {
            if (other.rigidBodyObject?.name === "ground") {
              setIsJumping(false);
            }
          }}
          args={[0.01, 0.01, 0.01]}
          sensor
        />
        <Musketeer isJumping={isJumping} velocity={velocity} />
      </RigidBody>
    </>
  );
};

export default Player;
