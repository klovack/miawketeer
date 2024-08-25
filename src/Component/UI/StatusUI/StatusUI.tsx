import { FaHeart } from "react-icons/fa6";
import { useGameManagerStore } from "../../../Store/GameManagerStore/GameManagerStore";
import "./StatusUI.scss";

const StatusUI = () => {
  const { points, pointMultiplier, health } = useGameManagerStore((state) => ({
    points: state.points,
    pointMultiplier: state.pointMultiplier,
    health: state.health,
  }));

  return (
    <>
      <div className="status-ui">
        <div className="status-ui__point">{points}</div>
        <div className="status-ui__point-multiplier">x{pointMultiplier}</div>
        <div className="status-ui__health">
          {new Array(Math.min(health, 20)).fill(0).map((_, i) => (
            <div key={i} className="status-ui__health__heart">
              <FaHeart size={30} />
            </div>
          ))}
          {health > 20 && <span>x{health - 20}</span>}
        </div>
      </div>
    </>
  );
};

export default StatusUI;
