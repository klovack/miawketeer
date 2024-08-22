import { useGameManagerStore } from "../../../Store/GameManagerStore/GameManagerStore";
import "./DeathUI.scss";

export default function DeathUI() {
  const { isDead, newGame } = useGameManagerStore((state) => ({
    isDead: state.isPlayerDead,
    newGame: state.newGame,
  }));

  return (
    <>
      {isDead() && (
        <div className="death-ui">
          <h1 className="death-ui__text">YOU DIED</h1>
          <button className="death-ui__button" onClick={newGame}>
            TRY AGAIN
          </button>
        </div>
      )}
    </>
  );
}
