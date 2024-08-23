import { useKeyboardControls } from "@react-three/drei";
import Musketeer from "../Model/Musketeer/Musketeer";
import {
  CollisionTarget,
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controls } from "../../controls";
import { useFrame } from "@react-three/fiber";
import { Euler, Quaternion, Vector3 } from "three";
import { useControls } from "leva";
import { clamp, debounce } from "lodash";
import {
  LevelPhase,
  useGameManagerStore,
} from "../../Store/GameManagerStore/GameManagerStore";

const MAX_SPEED = {
  IMPULSE: 0.0055,
  TORQUE: 0.0055,
};

const SPEED = {
  IMPULSE: 10,
  TORQUE: 10,
};

const DAMAGE_TIME = 500;

const Player = () => {
  // const playerProps = useControls("Player", {
  //   isJumping: false,
  //   isAttacking: false,
  //   isDamaged: false,
  //   isVictorious: false,
  //   velocity: 0,
  // });
  const { orbit } = useControls("Experience", {
    orbit: false,
  });
  const rbRef = useRef<RapierRigidBody>(null);
  const [isJumping, setIsJumping] = useState(false);
  const [velocity, setVelocity] = useState(0);
  // for using ray
  // const { rapier, world } = useRapier();

  const [subKey, getKey] = useKeyboardControls<Controls>();
  const [smoothCameraPosition] = useState(() => new Vector3(3, 1.5, -5));
  const [smoothCameraTarget] = useState(() => new Vector3());
  const [isDamaged, setIsDamaged] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const { isPlayerDead, takeDamage, levelPhase, level } = useGameManagerStore(
    (state) => ({
      isPlayerDead: state.isPlayerDead,
      takeDamage: state.takeDamage,
      levelPhase: state.levelPhase,
      level: state.level,
    })
  );

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
          const linVel = rbRef.current?.linvel() ?? { x: 0, y: 0, z: 0 };
          rbRef.current?.applyImpulse(
            {
              x: linVel.x * 0.012,
              y: linVel.y + 0.07,
              z: linVel.z * 0.012,
            },
            true
          );
        }
      }
    );
  });

  useFrame(({ camera }, delta) => {
    if (levelPhase !== LevelPhase.PLAYING) {
      return;
    }

    if (isPlayerDead()) {
      setVelocity(0);
      const pos = rbRef.current?.translation() ?? { x: 0, y: 0, z: 0 };
      pos.y = 0;
      rbRef.current?.setNextKinematicTranslation(pos);
      return;
    }
    const { forward, back, left, right, lookUp } = getKey();

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = SPEED.IMPULSE * delta;
    const torqueStrength = SPEED.TORQUE * delta;
    let eulerRot: Euler | undefined = undefined;

    if (!lookUp && !isJumping) {
      if (right) {
        impulse.z -= impulseStrength;
        torque.x -= torqueStrength;
        eulerRot = new Euler(0, 0, 0);
      }

      if (left) {
        impulse.z += impulseStrength;
        torque.x += torqueStrength;
        eulerRot = new Euler(0, Math.PI, 0);
      }

      if (forward) {
        impulse.x -= impulseStrength;
        torque.z -= torqueStrength;
        eulerRot = new Euler(0, Math.PI / 2, 0);
      }

      if (back) {
        impulse.x += impulseStrength;
        torque.z += torqueStrength;
        eulerRot = new Euler(0, -Math.PI / 2, 0);
      }
    }

    const isPressedDiagonal = (forward || back) && (left || right);

    if (isPressedDiagonal) {
      const totalImpulse = Math.abs(impulse.x) + Math.abs(impulse.z);
      const diagonalImpulse =
        clamp(totalImpulse, -MAX_SPEED.IMPULSE, MAX_SPEED.IMPULSE) *
        Math.sqrt(totalImpulse);
      impulse.x = diagonalImpulse * Math.sign(impulse.x);
      impulse.z = diagonalImpulse * Math.sign(impulse.z);

      const totalTorque = Math.abs(torque.x) + Math.abs(torque.z);
      const diagonalTorque =
        clamp(totalTorque, -MAX_SPEED.TORQUE, MAX_SPEED.TORQUE) *
        Math.sqrt(totalTorque);

      torque.x = diagonalTorque * Math.sign(torque.x);
      torque.z = diagonalTorque * Math.sign(torque.z);

      if (forward && right) {
        eulerRot = new Euler(0, Math.PI / 4, 0);
      } else if (forward && left) {
        eulerRot = new Euler(0, Math.PI - Math.PI / 4, 0);
      } else if (back && right) {
        eulerRot = new Euler(0, -Math.PI / 4, 0);
      } else if (back && left) {
        eulerRot = new Euler(0, Math.PI + Math.PI / 4, 0);
      }
    }

    // Max Speed
    impulse.z = clamp(impulse.z, -MAX_SPEED.IMPULSE, MAX_SPEED.IMPULSE);
    impulse.x = clamp(impulse.x, -MAX_SPEED.IMPULSE, MAX_SPEED.IMPULSE);
    torque.x = clamp(torque.x, -MAX_SPEED.TORQUE, MAX_SPEED.TORQUE);
    torque.z = clamp(torque.z, -MAX_SPEED.TORQUE, MAX_SPEED.TORQUE);

    if (eulerRot && !isDamaged) {
      const rot = new Quaternion().setFromEuler(eulerRot);
      rbRef.current?.setRotation(rot, true);
    }

    if (!isDamaged && !isJumping) {
      rbRef.current?.applyImpulse(impulse, true);
      rbRef.current?.applyTorqueImpulse(torque, true);
      const vel = new Vector3().copy(
        rbRef.current?.linvel() ?? { x: 0, y: 0, z: 0 }
      );
      vel.setY(0);

      setVelocity(forward || back || left || right ? vel.length() : 0);
    }

    /**
     * Camera
     */
    if (orbit) {
      return;
    }

    const bodyPos = rbRef.current?.translation() ?? { x: 0, y: 0, z: 0 };
    const cameraPos = new Vector3().copy(bodyPos);
    const camTarget = new Vector3().copy(bodyPos);

    if (lookUp) {
      cameraPos.y += 2;
      cameraPos.z += 2;
      camTarget.z += -2;
    } else {
      cameraPos.y += 1;
      cameraPos.z += -0.5;
      cameraPos.x += 3;
    }
    camTarget.z += -0.5;

    // Simple Camera Shake
    if (isDamaged) {
      cameraPos.x += Math.random() * 3 + 1;
      cameraPos.z += Math.random() * -0.5 + 1;

      camTarget.x += Math.random() * 0.5;
      camTarget.z += Math.random() * -0.5 + 1;
    }

    cameraPos.x = clamp(cameraPos.x, -1.5, 3.7);
    cameraPos.z = clamp(cameraPos.z, -(level + 1) * 4.2, 0);

    smoothCameraPosition.lerp(cameraPos, 5 * delta);
    smoothCameraTarget.lerp(camTarget, 5 * delta);

    camera.position.copy(smoothCameraPosition);

    camera.lookAt(smoothCameraTarget);
  });

  const resetIsDamage = debounce(
    () => {
      setIsDamaged(false);
    },
    DAMAGE_TIME,
    {
      trailing: true,
      maxWait: DAMAGE_TIME,
    }
  );

  useEffect(() => {
    if (isDamaged) {
      setVelocity(0);
      rbRef.current?.applyImpulse(
        { x: Math.random() * 0.1, y: 0.07, z: 0.1 },
        true
      );

      resetIsDamage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDamaged]);

  const takeDamageDebounce = useMemo(
    () =>
      debounce(
        (num: number) => {
          takeDamage(num);
        },
        DAMAGE_TIME * 2,
        {
          leading: true,
          trailing: false,
        }
      ),
    [takeDamage]
  );

  const handleCollision = (other: CollisionTarget) => {
    if (
      other.rigidBodyObject?.name === "obstacle" &&
      !isPlayerDead() &&
      !isDamaged
    ) {
      setIsDamaged(true);
      takeDamageDebounce(1);
    } else if (other.rigidBodyObject?.name === "chest") {
      setIsVictory(true);
      setTimeout(() => {
        setIsVictory(false);
      }, 1000);
    } else if (other.rigidBodyObject?.name === "death" && !isPlayerDead()) {
      setIsDamaged(true);
      takeDamageDebounce(Infinity);
    }
  };

  return (
    <>
      <RigidBody
        name="player"
        position={[0, 1, 0]}
        restitution={0}
        friction={2}
        linearDamping={2}
        angularDamping={2}
        enabledRotations={[false, false, false]}
        ref={rbRef}
        mass={5}
        colliders={false}
        onCollisionEnter={({ other }) => handleCollision(other)}
        type={isPlayerDead() ? "kinematicPosition" : "dynamic"}
      >
        <CuboidCollider args={[0.1, 0.2, 0.1]} position={[0, 0.2, 0]} />
        <CuboidCollider
          onIntersectionEnter={({ other }) => {
            if (
              other.rigidBodyObject?.name === "ground" ||
              other.rigidBodyObject?.name === "obstacle"
            ) {
              setIsJumping(false);
            }
          }}
          args={[0.01, 0.01, 0.01]}
          sensor
        />
        <Musketeer
          isDead={isPlayerDead()}
          isDamaged={isDamaged}
          isJumping={isJumping}
          isAttacking={isVictory}
          velocity={velocity}
        />
      </RigidBody>
    </>
  );
};

export default Player;
