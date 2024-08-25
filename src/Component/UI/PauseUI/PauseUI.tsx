import { useKeyboardControls } from "@react-three/drei";
import {
  LevelPhase,
  useGameManagerStore,
} from "../../../Store/GameManagerStore/GameManagerStore";
import { Controls } from "../../../controls";
import { useEffect } from "react";
import { FaPause } from "react-icons/fa6";
import "./PauseUI.scss";

const PauseUI = () => {
  const { levelPhase, pause, play, newGame } = useGameManagerStore((state) => ({
    levelPhase: state.levelPhase,
    pause: state.pause,
    play: state.play,
    newGame: state.newGame,
  }));

  const [subKey] = useKeyboardControls<Controls>();

  useEffect(() => {
    return subKey(
      (state) => state.escape,
      (pressed) => {
        if (pressed) {
          if (levelPhase === LevelPhase.PLAYING) {
            pause();
          } else if (levelPhase === LevelPhase.PAUSED) {
            play();
          }
        }
      }
    );
  }, [levelPhase, pause, play, subKey]);

  return (
    <>
      {levelPhase === LevelPhase.PLAYING && (
        <button
          className="pause-ui-button"
          onClick={() => {
            pause();
          }}
        >
          <FaPause />
        </button>
      )}
      {levelPhase === LevelPhase.PAUSED && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
          }}
          className="pause-ui"
        >
          <div className="pause-ui__content">
            <ul className="pause-ui__content__menu">
              <li className="pause-ui__content__menu__item">
                <button
                  onClick={() => {
                    play();
                  }}
                >
                  Resume
                </button>
              </li>
              <li className="pause-ui__content__menu__item">
                <button
                  onClick={() => {
                    newGame();
                  }}
                >
                  Restart
                </button>
              </li>
              <li className="pause-ui__content__menu__item">
                <label htmlFor="pause-ui__audio">Music</label>
                <input type="checkbox" id="pause-ui__audio" name="audio" />
              </li>
              {/* <li className="pause-ui__content__menu__item">
                <button
                  onClick={() => {
                    // TODO: go back to menu
                  }}
                >
                  Exit
                </button>
              </li> */}
            </ul>
            <div className="pause-ui__content__how-to-play">
              <p>WASD ←↑↓→ - move</p>
              <p>space bar - jump</p>
              <p>Q - stop</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PauseUI;
