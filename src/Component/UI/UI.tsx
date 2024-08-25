import DeathUI from "./DeathUI/DeathUI";
import PauseUI from "./PauseUI/PauseUI";
import StatusUI from "./StatusUI/StatusUI";

export default function UI() {
  return (
    <>
      <StatusUI />
      <PauseUI />
      <DeathUI />
    </>
  );
}
