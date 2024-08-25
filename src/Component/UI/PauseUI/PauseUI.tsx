import { useKeyboardControls } from "@react-three/drei";
import {
  LevelPhase,
  useGameManagerStore,
} from "../../../Store/GameManagerStore/GameManagerStore";
import { Controls } from "../../../controls";
import { useEffect } from "react";
import { FaPause } from "react-icons/fa6";
import "./PauseUI.scss";
import { useAudioStore } from "../../../Store/AudioStore/AudioStore";
import { clamp } from "lodash";

const PauseUI = () => {
  const { levelPhase, pause, play, newGame } = useGameManagerStore((state) => ({
    levelPhase: state.levelPhase,
    pause: state.pause,
    play: state.play,
    newGame: state.newGame,
  }));

  const [subKey] = useKeyboardControls<Controls>();

  const { masterVolume, canPlay, setMasterVolume, setCanPlay } = useAudioStore(
    (state) => ({
      masterVolume: state.masterVolume,
      canPlay: state.canPlay,
      setMasterVolume: state.setMasterVolume,
      setCanPlay: state.setCanPlay,
    })
  );

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
                <input
                  type="checkbox"
                  checked={canPlay}
                  onChange={(e) => setCanPlay(e.target.checked)}
                  id="pause-ui__audio"
                  name="audio"
                />
              </li>
              <li className="pause-ui__content__menu__item">
                <label htmlFor="pause-ui__volume">Volume</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={masterVolume * 100}
                  onChange={(e) => {
                    setMasterVolume(
                      clamp(parseInt(e.target.value) / 100, 0, 1)
                    );
                  }}
                  id="pause-ui__volume"
                  name="volume"
                />
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
