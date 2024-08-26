import { useGameManagerStore } from "../../../Store/GameManagerStore/GameManagerStore";
import "./MenuUI.scss";

const MenuUI = () => {
  const { start } = useGameManagerStore((state) => ({
    start: state.start,
  }));

  return (
    <div className="menu-ui">
      <div className="menu-ui__content">
        <ul className="menu-ui__content__menu">
          <li className="menu-ui__content__menu__item">
            <button onClick={() => start()}>New Game</button>
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
