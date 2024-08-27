import {
  CollisionTarget,
  CuboidCollider,
  RigidBody,
} from "@react-three/rapier";
import Chest from "../../Model/Chest/Chest";
import Block, { BlockProps } from "../Block/Block";
import { useEffect, useMemo, useRef, useState } from "react";
import Door from "../../Model/Door/Door";
import {
  LevelPhase,
  useGameManagerStore,
} from "../../../Store/GameManagerStore/GameManagerStore";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { Text } from "@react-three/drei";
import { debounce } from "lodash";
import { useControls } from "leva";
import Pillar from "../../Model/Pillar/Pillar";
import ChestOpenSfx from "../../SFX/ChestOpenSfx";
import { useAudioStore } from "../../../Store/AudioStore/AudioStore";
import BlockGate from "../BlockGate/BlockGate";

export type BlockEndProps = BlockProps;

type ChestContent = "points" | "health" | "pointMultiplier";
type ChestContentValue = {
  content: ChestContent;
  value: number;
};

const chestContentChance = {
  points: {
    min: 4,
    max: 10,
  },
  health: {
    min: 2,
    max: 3.9,
  },
  pointMultiplier: {
    min: 0,
    max: 1.9,
  },
};

const calculateChestContent = (
  chestPoints: number,
  numOfHealth: number = 1,
  numberOfPointMultiplier: number = Math.floor(Math.random() * 10 + 1)
): ChestContentValue => {
  const content = Math.random() * 10;
  if (content < chestContentChance.pointMultiplier.max) {
    return {
      content: "pointMultiplier",
      value: numberOfPointMultiplier,
    };
  } else if (content < chestContentChance.health.max) {
    return {
      content: "health",
      value: numOfHealth,
    };
  } else {
    return {
      content: "points",
      value: chestPoints,
    };
  }
};

export default function BlockEnd({
  size = [4, 0.2, 4],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: BlockEndProps) {
  const { skipCinematic } = useControls("BlockEnd", {
    skipCinematic: false,
  });
  const { playInteract } = useAudioStore((state) => ({
    playInteract: state.playInteract,
  }));
  const [isChestOpen, setIsChestOpen] = useState(false);
  const {
    nextLevel,
    increasePointMultiplier,
    resetPointMultiplier,
    addPoints,
    pointMultiplier,
    level,
    levelPhase,
    play,
    setPointMultiplier,
    setHealth,
  } = useGameManagerStore((state) => ({
    level: state.level,
    levelPhase: state.levelPhase,
    play: state.play,
    pointMultiplier: state.pointMultiplier,
    nextLevel: state.nextLevel,
    increasePointMultiplier: state.increasePointMultiplier,
    setPointMultiplier: state.setPointMultiplier,
    resetPointMultiplier: state.resetPointMultiplier,
    addPoints: state.addPoints,
    setHealth: state.setHealth,
  }));
  const [chestPoints] = useState(Math.floor(Math.random() * 10 + level * 10));
  const [chestContent] = useState(calculateChestContent(chestPoints));
  const [smoothCameraPosition] = useState(new Vector3(0, 2, 3.5));
  const pointMultTextRef = useRef<Mesh>(null);
  const [pointText, setPointText] = useState(`x${pointMultiplier}`);

  useEffect(() => {
    if (chestContent.content === "points") {
      setPointText(`x${pointMultiplier}`);
    } else if (chestContent.content === "health") {
      setPointText(`+♥️`);
    } else if (chestContent.content === "pointMultiplier") {
      // increase point multiplier
      setPointText(`+ x${chestContent.value}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chestTextColor = useMemo(() => {
    switch (chestContent.content) {
      case "points":
        return "yellow";
      case "health":
        return "red";
      case "pointMultiplier":
        return "green";
      default:
        return "";
    }
  }, [chestContent.content]);

  useFrame(({ camera }, delta) => {
    if (levelPhase === LevelPhase.START) {
      if (skipCinematic) {
        setTimeout(() => {
          play();
        }, 100);
      } else {
        smoothCameraPosition.lerp(
          { x: position[0] + 3.5, y: position[1] + 1.5, z: position[2] },
          0.5 * delta
        );
        camera.position.copy(smoothCameraPosition);
        camera.lookAt(position[0], position[1], position[2]);

        if (
          camera.position.distanceTo({
            x: position[0] + 3.5,
            y: position[1] + 1.5,
            z: position[2],
          }) < 0.8
        ) {
          play();
        }
      }
    }

    if (pointMultTextRef.current) {
      // if chest is open, blink the point multiplier text
      if (!isChestOpen) {
        pointMultTextRef.current.scale.setScalar(
          0.2 + Math.sin(Date.now() / 250) * 0.03
        );
      } else {
        // otherwise, fade out the points
        pointMultTextRef.current.scale.lerp(new Vector3(0, 0, 0), 0.5 * delta);
        const curPos = pointMultTextRef.current.position;
        pointMultTextRef.current.position.lerp(
          { x: curPos.x, y: curPos.y + 0.5, z: curPos.z },
          0.5 * delta
        );
        if (pointMultTextRef.current.scale.x < 0.05) {
          pointMultTextRef.current.scale.setScalar(0);
          pointMultTextRef.current.visible = false;
        }
      }
    }
  });

  const handleChestOpen = debounce(
    () => {
      if (chestContent.content === "points") {
        const totalPoints = chestPoints * pointMultiplier;
        addPoints(totalPoints);
        setPointText(`${totalPoints}`);
        resetPointMultiplier();
      } else if (chestContent.content === "health") {
        // add health
        setHealth((prev) => prev + chestContent.value);
      } else if (chestContent.content === "pointMultiplier") {
        setPointMultiplier((prev) => prev + chestContent.value);
      }
      setIsChestOpen(true);
    },
    1000,
    {
      trailing: true,
      maxWait: 1000,
    }
  );

  const handleDoorEnter = (other: CollisionTarget) => {
    if (other.rigidBodyObject?.name === "player") {
      if (!isChestOpen) {
        increasePointMultiplier();
      }
      nextLevel();
    }
  };

  return (
    <group position={position} rotation={rotation}>
      {/* <RigidBody ref={floorRef} type={"fixed"}> */}
      <Block receiveShadow size={size} type="floor1" />
      {/* </RigidBody> */}

      <RigidBody
        name="chest"
        onIntersectionEnter={({ other }) => {
          if (other.rigidBodyObject?.name === "player" && !isChestOpen) {
            playInteract();
            handleChestOpen();
          }
        }}
        colliders={false}
        position={[0, 0, -1.2]}
        userData={{ isChestOpen }}
      >
        <CuboidCollider args={[0.35, 0.3, 0.3]} position={[0, 0.3, 0.05]} />
        <CuboidCollider args={[0.5, 0.3, 0.5]} position={[0, 0.3, 0]} sensor />
        <Chest isOpen={isChestOpen} scale={0.3} />
        <ChestOpenSfx
          isPlaying={isChestOpen}
          soundType={chestContent.content}
        />
      </RigidBody>

      <Text
        visible={isChestOpen}
        ref={pointMultTextRef}
        font="/fonts/MedievalSharp.ttf"
        scale={0.5}
        position={[0, 0.8, -1.2]}
        color={chestTextColor}
        outlineWidth={0.05}
        rotation={[0, 0, Math.PI / 24]}
      >
        {pointText}
      </Text>

      <Door onDoorEnter={handleDoorEnter} position={[1.92, 0, 0]} />

      <RigidBody type="fixed">
        <Pillar position={[2.1, 0, -1]} />
        <Pillar position={[2.1, 0, 1]} />
      </RigidBody>

      <BlockGate
        gap={0.5}
        scale={1}
        rotation={[0, Math.PI / 2, 0]}
        position={[1.75, 0.8, 1.65]}
      />
      <BlockGate
        gap={0.5}
        scale={1}
        rotation={[0, Math.PI / 2, 0]}
        position={[1.75, 0.8, -1.65]}
      />
    </group>
  );
}
