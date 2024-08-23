import { create } from "zustand";

export enum LevelPhase {
  START,
  PLAYING,
  END,
}

export type GameManagerState = {
  level: number;
  health: number;
  levelPhase: LevelPhase;
  points: number;
  highscore: number;
  pointMultiplier: number;
  isPlayerDead: () => boolean;
  setLevel: (level: number) => void;
  setHealth: (healthOrFn: number | ((prev: number) => number)) => void;
  newGame: () => void;
  nextLevel: () => void;
  play: () => void;
  start: () => void;
  end: () => void;
  addPoints: (points: number) => void;
  increasePointMultiplier: () => void;
  setPointMultiplier: (multiplier: number | ((prev: number) => number)) => void;
  resetPointMultiplier: () => void;
  takeDamage: (damage: number) => void;
};

export const useGameManagerStore = create<GameManagerState>(
  (set, getState) => ({
    level: 1,
    health: 3,
    levelPhase: LevelPhase.START,
    points: 0,
    pointMultiplier: 1,
    highscore: 0,
    isPlayerDead: () => getState().health <= 0,
    start: () => set({ levelPhase: LevelPhase.START }),
    play: () => set({ levelPhase: LevelPhase.PLAYING }),
    end: () => set({ levelPhase: LevelPhase.END }),
    nextLevel: () =>
      set((state) => ({ level: state.level + 1, levelPhase: LevelPhase.END })),
    setLevel: (level: number) => set({ level }),
    setHealth: (healthOrFn: number | ((prev: number) => number)) => {
      set((state) => {
        const health =
          typeof healthOrFn === "number"
            ? healthOrFn
            : healthOrFn(state.health);
        return { health };
      });
    },
    newGame: () => {
      set({ level: 1, health: 3, points: 0 });
      getState().end();
      getState().resetPointMultiplier();
    },
    addPoints: (points: number) => {
      const newPoints = getState().points + points;
      const highscore = Math.max(getState().highscore, newPoints);
      set(() => ({ points: newPoints, highscore }));
    },
    increasePointMultiplier: () => {
      set((state) => ({ pointMultiplier: state.pointMultiplier + 1 }));
    },
    setPointMultiplier: (
      multiplierOrFn: number | ((prev: number) => number)
    ) => {
      set((state) => {
        const pointMultiplier =
          typeof multiplierOrFn === "number"
            ? multiplierOrFn
            : multiplierOrFn(state.pointMultiplier);
        return { pointMultiplier };
      });
    },
    resetPointMultiplier: () => {
      set({ pointMultiplier: 1 });
    },
    takeDamage: (damage: number = 1) => {
      set((state) => {
        const endHealth = state.health - damage;
        return { health: endHealth <= 0 ? 0 : endHealth };
      });
    },
  })
);
