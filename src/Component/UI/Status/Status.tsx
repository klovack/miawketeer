import { useGameManagerStore } from "../../../Store/GameManagerStore/GameManagerStore";

const Status = () => {
  const { points, pointMultiplier, level, health, newGame } =
    useGameManagerStore((state) => ({
      points: state.points,
      pointMultiplier: state.pointMultiplier,
      level: state.level,
      health: state.health,
      newGame: state.newGame,
    }));

  return (
    <>
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          color: "white",
        }}
      >
        <p>
          Points: {points}, mult: {pointMultiplier}, level: {level}, health:{" "}
          {health}
        </p>
        <button onClick={() => newGame()}>New Game</button>
      </div>
    </>
  );
};

export default Status;
