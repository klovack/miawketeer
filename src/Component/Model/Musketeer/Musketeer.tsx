import { useAnimations, useGLTF } from "@react-three/drei";
import { Euler, Vector3 } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { LoopOnce, Mesh } from "three";

export type MusketeerProps = {
  position?: Vector3;
  rotation?: Euler;
  velocity?: number;
  isJumping?: boolean;
  isAttacking?: boolean;
  isDamaged?: boolean;
  isVictorious?: boolean;
};

enum MusketeerAnimState {
  Idle = "Idle",
  Run = "Run",
  Attack = "Attack",
  Damage = "Damage",
  Jump = "Jump",
  Victory = "Victory",
}

const Musketeer = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  velocity,
  isJumping,
  isAttacking,
  isDamaged,
  isVictorious,
}: MusketeerProps) => {
  const musketeer = useGLTF("/models/musketeer.glb");
  const musketeerRef = useRef<Mesh>(null);
  const musketeerAnim = useAnimations(musketeer.animations, musketeerRef);
  const [animState, setAnimState] = useState<MusketeerAnimState>(
    MusketeerAnimState.Idle
  );
  const [prevAnimState, setPrevAnimState] =
    useState<MusketeerAnimState>(animState);

  useEffect(() => {
    musketeerAnim?.actions[MusketeerAnimState.Jump]?.setLoop(LoopOnce, 1);
    musketeerAnim?.actions[MusketeerAnimState.Victory]?.setLoop(LoopOnce, 1);
    musketeerAnim?.actions[MusketeerAnimState.Damage]?.setLoop(LoopOnce, 1);
    musketeer.scene.traverse((child) => {
      child.castShadow = true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (musketeerAnim && musketeerRef.current) {
      if (musketeerAnim.actions[animState]) {
        if (musketeerAnim.actions[prevAnimState]) {
          musketeerAnim.actions[prevAnimState].crossFadeTo(
            musketeerAnim.actions[animState],
            0.2,
            true
          );
          musketeerAnim.actions[prevAnimState].stop();
        }

        musketeerAnim.actions[animState].reset();
        musketeerAnim.actions[animState].play();
        musketeerAnim.mixer.addEventListener("finished", (a) => {
          if (a.action.getClip().name === animState) {
            setAnimState(MusketeerAnimState.Idle);
          }
        });
      }
    }
  }, [musketeerAnim, animState, prevAnimState]);

  useEffect(() => {
    if (isJumping) {
      setAnimState((prev) => {
        setPrevAnimState(prev);
        return MusketeerAnimState.Jump;
      });
    } else if (isAttacking) {
      setAnimState((prev) => {
        setPrevAnimState(prev);
        return MusketeerAnimState.Attack;
      });
    } else if (isDamaged) {
      setAnimState((prev) => {
        setPrevAnimState(prev);
        return MusketeerAnimState.Damage;
      });
    } else if (isVictorious) {
      setAnimState((prev) => {
        setPrevAnimState(prev);
        return MusketeerAnimState.Victory;
      });
    } else if (Math.abs(velocity ?? 0) <= 0.01) {
      setAnimState((prev) => {
        setPrevAnimState(prev);
        return MusketeerAnimState.Idle;
      });
    } else if (velocity ?? 0 > 0) {
      setAnimState((prev) => {
        setPrevAnimState(prev);
        return MusketeerAnimState.Run;
      });
    }
  }, [velocity, isJumping, isAttacking, isDamaged, isVictorious]);

  return (
    <group position={position} rotation={rotation}>
      <primitive
        object={musketeer.scene}
        ref={musketeerRef}
        receiveShadow
        castShadow
        rotation={[0, Math.PI, 0]}
        scale={2}
      />
    </group>
  );
};

useGLTF.preload("/models/musketeer.glb");

export default Musketeer;
