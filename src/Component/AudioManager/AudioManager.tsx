import { useEffect } from "react";
import { useAudioStore } from "../../Store/AudioStore/AudioStore";
import { useGameManagerStore } from "../../Store/GameManagerStore/GameManagerStore";

const bgMusic = new Audio("/audio/bgmusic.mp3");
const bgDeath = new Audio("/audio/death.mp3");
const impact = new Audio("/sfx/cue/impact.mp3");

const AudioManager = () => {
  const { health, levelPhase } = useGameManagerStore((state) => ({
    health: state.health,
    levelPhase: state.levelPhase,
  }));

  const { isBgMusicPlaying, isGameOverPlaying, canPlay, masterVolume } =
    useAudioStore((state) => ({
      isBgMusicPlaying: state.isBgMusicPlaying,
      isGameOverPlaying: state.isGameOverPlaying,
      canPlay: state.canPlay,
      masterVolume: state.masterVolume,
    }));

  useEffect(() => {
    if (!canPlay) {
      bgDeath.pause();
      bgMusic.pause();
      bgMusic.currentTime = 0;
      bgDeath.currentTime = 0.5;
      return;
    }

    bgMusic.volume = 0.5 * masterVolume;
    bgDeath.volume = 0.5 * masterVolume;

    if (health > 0 && !isBgMusicPlaying && bgMusic.paused) {
      bgDeath.pause();

      bgMusic.currentTime = 0;
      bgMusic.loop = true;
      bgMusic.play();
    } else if (health <= 0 && !isGameOverPlaying && bgDeath.paused) {
      bgDeath.currentTime = 0.5;
      bgMusic.pause();
      bgDeath.play();
    }
  }, [canPlay, health, isBgMusicPlaying, isGameOverPlaying, masterVolume]);

  useEffect(() => {
    if (levelPhase === 0) {
      bgMusic.pause();
      bgDeath.pause();
    }
  }, [levelPhase]);

  useEffect(() => {
    if (health <= 0) {
      impact.volume = 0.5 * masterVolume;
      impact.currentTime = 0;
      impact.play();
    }
  }, [health, masterVolume]);

  return <></>;
};

export default AudioManager;
