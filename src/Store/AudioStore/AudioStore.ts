import { create } from "zustand";

export type AudioState = {
  isBgMusicPlaying: boolean;
  isGameOverPlaying: boolean;
  canPlay: boolean;
  masterVolume: number;
  playBgMusic: () => void;
  playGameOver: () => void;
  setMasterVolume: (volume: number) => void;
  setCanPlay: (canPlay: boolean | ((prev: boolean) => boolean)) => void;
};

export const useAudioStore = create<AudioState>((set, get) => ({
  isBgMusicPlaying: false,
  isGameOverPlaying: false,
  canPlay: true,
  masterVolume: 1,
  playBgMusic: () => {
    if (get().canPlay) {
      set({ isBgMusicPlaying: true, isGameOverPlaying: false });
    }
  },
  playGameOver: () => {
    if (get().canPlay) {
      set({ isBgMusicPlaying: false, isGameOverPlaying: true });
    }
  },
  setMasterVolume: (volume) => set({ masterVolume: volume }),
  setCanPlay: (canPlay) =>
    set({
      canPlay: typeof canPlay === "function" ? canPlay(get().canPlay) : canPlay,
    }),
}));
