import { create } from "zustand";

const LOCAL_STORAGE_KEY = {
  MASTER_VOLUME: "masterVolume",
  CAN_PLAY: "canPlay",
};

const getMasterVolumeLocalStorage = () => {
  const masterVolume = localStorage.getItem(LOCAL_STORAGE_KEY.MASTER_VOLUME);
  return masterVolume ? parseFloat(masterVolume) : 1;
};

const getCanPlayLocalStorage = () => {
  const canPlay = localStorage.getItem(LOCAL_STORAGE_KEY.CAN_PLAY);
  return canPlay ? canPlay === "true" : true;
};

const interactSfx = new Audio("/sfx/cue/interact.mp3");
const interactBackSfx = new Audio("/sfx/cue/interact-back.mp3");

export type AudioState = {
  isBgMusicPlaying: boolean;
  isGameOverPlaying: boolean;
  canPlay: boolean;
  masterVolume: number;
  playBgMusic: () => void;
  playGameOver: () => void;
  setMasterVolume: (volume: number) => void;
  setCanPlay: (canPlay: boolean | ((prev: boolean) => boolean)) => void;
  playInteract: () => void;
  playInteractBack: () => void;
};

export const useAudioStore = create<AudioState>((set, get) => ({
  isBgMusicPlaying: false,
  isGameOverPlaying: false,
  canPlay: getCanPlayLocalStorage(),
  masterVolume: getMasterVolumeLocalStorage(),
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
  setMasterVolume: (volume) => {
    localStorage.setItem(LOCAL_STORAGE_KEY.MASTER_VOLUME, volume.toString());
    set({ masterVolume: volume });
  },
  setCanPlay: (canPlay) => {
    localStorage.setItem(LOCAL_STORAGE_KEY.CAN_PLAY, canPlay.toString());
    set({
      canPlay: typeof canPlay === "function" ? canPlay(get().canPlay) : canPlay,
    });
  },

  playInteract: () => {
    interactSfx.pause();
    interactSfx.currentTime = 0;
    interactSfx.volume = get().masterVolume;
    interactSfx.play();
  },
  playInteractBack: () => {
    interactBackSfx.pause();
    interactBackSfx.currentTime = 0;
    interactBackSfx.volume = get().masterVolume;
    interactBackSfx.play();
  },
}));
