import DeathUI from "./DeathUI/DeathUI";
import LoadingUI from "./LoadingUI/LoadingUI";
import PauseUI from "./PauseUI/PauseUI";
import StatusUI from "./StatusUI/StatusUI";

export default function UI() {
  return (
    <>
      <StatusUI />
      <PauseUI />
      <DeathUI />
      <LoadingUI />
    </>
  );
}
