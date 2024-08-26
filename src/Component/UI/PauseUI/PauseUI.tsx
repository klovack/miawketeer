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
  const { levelPhase, pause, play, newGame, exit } = useGameManagerStore(
    (state) => ({
      levelPhase: state.levelPhase,
      pause: state.pause,
      play: state.play,
      newGame: state.newGame,
      exit: state.exit,
    })
  );

  const [subKey] = useKeyboardControls<Controls>();

  const {
    masterVolume,
    canPlay,
    setMasterVolume,
    setCanPlay,
    playInteractBack,
    playInteract,
  } = useAudioStore((state) => ({
    masterVolume: state.masterVolume,
    canPlay: state.canPlay,
    setMasterVolume: state.setMasterVolume,
    setCanPlay: state.setCanPlay,
    playInteract: state.playInteract,
    playInteractBack: state.playInteractBack,
  }));

  useEffect(() => {
    return subKey(
      (state) => state.escape,
      (pressed) => {
        if (pressed) {
          if (levelPhase === LevelPhase.PLAYING) {
            playInteract();
            pause();
          } else if (levelPhase === LevelPhase.PAUSED) {
            playInteractBack();
            play();
          }
        }
      }
    );
  }, [levelPhase, pause, play, playInteract, playInteractBack, subKey]);

  return (
    <>
      {levelPhase === LevelPhase.PLAYING && (
        <button
          className="pause-ui-button"
          onClick={() => {
            playInteract();
            pause();
          }}
        >
          <FaPause />
        </button>
      )}
      {levelPhase === LevelPhase.PAUSED && (
        <div className="pause-ui">
          <div className="pause-ui__content">
            <ul className="pause-ui__content__menu">
              <li className="pause-ui__content__menu__item">
                <button
                  onClick={() => {
                    playInteractBack();
                    play();
                  }}
                >
                  Resume
                </button>
              </li>
              <li className="pause-ui__content__menu__item">
                <button
                  onClick={() => {
                    playInteract();
                    newGame();

                    // Hacky way to restart the music
                    if (canPlay) {
                      setCanPlay(false);
                      setTimeout(() => {
                        setCanPlay(true);
                      }, 10);
                    }
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
                  onChange={(e) => {
                    playInteract();
                    setCanPlay(e.target.checked);
                  }}
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
              <li className="pause-ui__content__menu__item">
                <button
                  onClick={() => {
                    playInteractBack();
                    exit();
                  }}
                >
                  Exit
                </button>
              </li>
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
