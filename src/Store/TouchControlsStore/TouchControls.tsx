import { create } from "zustand";
import "./TouchControls.scss";
import {
  PiArrowFatLinesLeftDuotone,
  PiArrowFatLinesRightDuotone,
} from "react-icons/pi";
import { FaShoePrints } from "react-icons/fa6";
import { BiSolidBinoculars } from "react-icons/bi";

export type TouchControlState = {
  up: boolean;
  down: boolean;
  right: boolean;
  jump: boolean;
  lookUp: boolean;

  // Additional controls
  setUp: (value: boolean | ((prev: boolean) => boolean)) => void;
  setDown: (value: boolean | ((prev: boolean) => boolean)) => void;
  setRight: (value: boolean | ((prev: boolean) => boolean)) => void;
  setJump: (value: boolean | ((prev: boolean) => boolean)) => void;
  setLookUp: (value: boolean | ((prev: boolean) => boolean)) => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTouchControls = create<TouchControlState>((set) => ({
  up: false,
  down: false,
  right: false,
  jump: false,
  lookUp: false,

  setUp: (value) =>
    set((state) => ({
      up: typeof value === "function" ? value(state.up) : value,
    })),
  setDown: (value) =>
    set((state) => ({
      down: typeof value === "function" ? value(state.down) : value,
    })),
  setRight: (value) =>
    set((state) => ({
      right: typeof value === "function" ? value(state.right) : value,
    })),
  setJump: (value) =>
    set((state) => ({
      jump: typeof value === "function" ? value(state.jump) : value,
    })),
  setLookUp: (value) =>
    set((state) => ({
      lookUp: typeof value === "function" ? value(state.lookUp) : value,
    })),
}));

export const TouchControls = () => {
  const { setUp, setDown, setJump, setLookUp } = useTouchControls((state) => ({
    setUp: state.setUp,
    setDown: state.setDown,
    setJump: state.setJump,
    setLookUp: state.setLookUp,
  }));

  const getPointerEvents = (
    event: (value: boolean | ((prev: boolean) => boolean)) => void
  ) => ({
    onPointerDown: () => event(true),
    onPointerUp: () => event(false),
    onPointerLeave: () => event(false),
  });

  return (
    <div className="touch-controls">
      <div className="touch-controls__direction">
        <button
          className="touch-controls__direction__left"
          {...getPointerEvents(setUp)}
        >
          <PiArrowFatLinesLeftDuotone />
        </button>
        <button
          className="touch-controls__direction__right"
          {...getPointerEvents(setDown)}
        >
          <PiArrowFatLinesRightDuotone />
        </button>
      </div>
      <div className="touch-controls__action">
        <button
          className="touch-controls__action__jump"
          {...getPointerEvents(setJump)}
        >
          <FaShoePrints />
        </button>
        <button
          className="touch-controls__action__lookup"
          {...getPointerEvents(setLookUp)}
        >
          <BiSolidBinoculars />
        </button>
      </div>
    </div>
  );
};
