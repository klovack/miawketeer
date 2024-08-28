import { useEffect, useState } from "react";
import {
  LevelPhase,
  useGameManagerStore,
} from "../../../Store/GameManagerStore/GameManagerStore";
import "./LoadingUI.scss";

const loadingTexts = [
  "There are 3 types of chest, I only care about coins.",
  "Do you know that the more levels I complete, the more coins I get?",
  "Look at the coins, they are so shiny.",
  "Maybe I need to open the chest and see if I can find any health.",
  "I see that the chest will give me coins according to the multiplier.",
];

const LoadingUI = () => {
  const { levelPhase } = useGameManagerStore((state) => ({
    levelPhase: state.levelPhase,
  }));
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  useEffect(() => {
    if (levelPhase === LevelPhase.END) {
      setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }
  }, [levelPhase]);

  return (
    <>
      {levelPhase === LevelPhase.END && (
        <div className="loading-ui">
          <h2
            style={{ transform: `rotate(${Math.random() * 10 - 5}deg)` }}
            className="loading-ui__text"
          >
            {loadingTexts[loadingTextIndex]}
          </h2>
        </div>
      )}
    </>
  );
};

export default LoadingUI;
