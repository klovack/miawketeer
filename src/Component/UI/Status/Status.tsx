import { useGameManagerStore } from "../../../Store/GameManagerStore/GameManagerStore";

const Status = () => {
  const { points, pointMultiplier, level, health } = useGameManagerStore(
    (state) => ({
      points: state.points,
      pointMultiplier: state.pointMultiplier,
      level: state.level,
      health: state.health,
    })
  );

  return (
    <div style={{ position: "absolute", bottom: "20px", left: "20px" }}>
      Points: {points}, mult: {pointMultiplier}, level: {level}, health:{" "}
      {health}
    </div>
  );
};

export default Status;
