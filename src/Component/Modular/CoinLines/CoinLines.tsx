import { Euler, Vector3 } from "@react-three/fiber";
import { useState } from "react";
import Coin from "../../Model/Coin/Coin";
import { useGameManagerStore } from "../../../Store/GameManagerStore/GameManagerStore";
import { useAudioStore } from "../../../Store/AudioStore/AudioStore";

export type CoinLinesProps = {
  position?: Vector3;
  rotation?: Euler;
  max?: number;
  min?: number;
  gap?: number;
  values?: number[];
};

const CoinLines = ({
  max = 5,
  min = 1,
  gap = 0.8,
  values = [1],
  ...props
}: CoinLinesProps) => {
  const [numOfCoins] = useState(
    Math.floor(Math.random() * (max - min + 1)) + min
  );
  const { addPoints } = useGameManagerStore((state) => ({
    addPoints: state.addPoints,
  }));
  const { playCoinSound } = useAudioStore((state) => ({
    playCoinSound: state.playCoinSound,
  }));

  const onCoinIntersect = (value: number) => {
    addPoints(value);
    playCoinSound();
  };

  return (
    <group {...props}>
      {Array.from({ length: numOfCoins }).map((_, index) => {
        const value = values[Math.floor(Math.random() * values.length)];

        return (
          <Coin
            key={index}
            position={[0, 0, -index * gap]}
            value={value}
            onCoinCollected={onCoinIntersect}
            collectorNames={["player"]}
          />
        );
      })}
    </group>
  );
};

export default CoinLines;
