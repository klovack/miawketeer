import { useGameManagerStore } from "../../../Store/GameManagerStore/GameManagerStore";
import "./MenuUI.scss";

const MenuUI = () => {
  const { play } = useGameManagerStore((state) => ({
    play: state.play,
  }));

  return (
    <div className="menu-ui">
      <div className="menu-ui__content">
        <ul className="menu-ui__content__menu">
          <li className="menu-ui__content__menu__item">
            <button onClick={() => play()}>New Game</button>
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
