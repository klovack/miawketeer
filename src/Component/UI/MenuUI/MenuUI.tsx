import { useAudioStore } from "../../../Store/AudioStore/AudioStore";
import { useGameManagerStore } from "../../../Store/GameManagerStore/GameManagerStore";
import "./MenuUI.scss";

const MenuUI = () => {
  const { start } = useGameManagerStore((state) => ({
    start: state.start,
  }));

  const { playInteract } = useAudioStore((state) => ({
    playInteract: state.playInteract,
  }));

  return (
    <div className="menu-ui">
      <div className="menu-ui__content">
        <ul className="menu-ui__content__menu">
          <li className="menu-ui__content__menu__item">
            <button
              onClick={() => {
                playInteract();

                setTimeout(() => {
                  start();
                }, 500);
              }}
            >
              New Game
            </button>
          </li>
        </ul>

        <div className="menu-ui__content__how-to-play">
          <p>WASD ←↑↓→ - move</p>
          <p>space bar - jump</p>
          <p>Q - stop</p>
        </div>
      </div>
    </div>
  );
};

export default MenuUI;
