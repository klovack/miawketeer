import { create } from "zustand";

export enum LevelPhase {
  START,
  PLAYING,
  END,
  DEAD,
}

export type GameManagerState = {
  level: number;
  health: number;
  levelPhase: LevelPhase;
  points: number;
  pointMultiplier: number;
  setLevel: (level: number) => void;
  setHealth: (health: number) => void;
  newGame: () => void;
  nextLevel: () => void;
  play: () => void;
  start: () => void;
  end: () => void;
  addPoints: (points: number) => void;
  increasePointMultiplier: () => void;
  resetPointMultiplier: () => void;
};

export const useGameManagerStore = create<GameManagerState>((set) => ({
  level: 1,
  health: 3,
  levelPhase: LevelPhase.START,
  points: 0,
  pointMultiplier: 1,
  start: () => set({ levelPhase: LevelPhase.START }),
  play: () => set({ levelPhase: LevelPhase.PLAYING }),
  end: () => set({ levelPhase: LevelPhase.END }),
  nextLevel: () =>
    set((state) => ({ level: state.level + 1, levelPhase: LevelPhase.END })),
  setLevel: (level: number) => set({ level }),
  setHealth: (health: number) => set({ health }),
  newGame: () => {
    set({ level: 1, health: 3 });
  },
  addPoints: (points: number) => {
    set((state) => ({ points: state.points + points }));
  },
  increasePointMultiplier: () => {
    set((state) => ({ pointMultiplier: state.pointMultiplier + 1 }));
  },
  resetPointMultiplier: () => {
    set({ pointMultiplier: 1 });
  },
}));
