import { PositionalAudio } from "@react-three/drei";
import { Euler, Vector3 } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { PositionalAudio as PositionalAudioImpl } from "three";
import { useAudioStore } from "../../Store/AudioStore/AudioStore";
import { debounce } from "lodash";

export type ChestOpenSoundType = "points" | "health" | "pointMultiplier";

export type ChestOpenSfxProps = {
  position?: Vector3;
  rotation?: Euler;
  isPlaying: boolean;
  soundType: ChestOpenSoundType;
  volume?: number;
};

const chestOpenSfx = "/sfx/cue/chest-opening.mp3";
const healthSfx = "/sfx/cue/chest-pickup_health.mp3";
const pointsSfx = "/sfx/cue/chest-pickup_points.mp3";
const pointMultiplierSfx = "/sfx/cue/chest-pickup_mult.mp3";

const getOpenSoundAccordingToType = (soundType: ChestOpenSoundType) => {
  switch (soundType) {
    case "points":
      return pointsSfx;
    case "health":
      return healthSfx;
    case "pointMultiplier":
      return pointMultiplierSfx;
  }
};

const ChestOpenSfx = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isPlaying,
  soundType,
  volume = 1,
}: ChestOpenSfxProps) => {
  const { masterVolume } = useAudioStore((state) => ({
    masterVolume: state.masterVolume,
  }));

  const [openSoundType] = useState(getOpenSoundAccordingToType(soundType));
  const chestOpenAudioRef = useRef<PositionalAudioImpl>(null);
  const openSoundTypeAudioRef = useRef<PositionalAudioImpl>(null);

  const playChestOpenSound = useMemo(
    () =>
      debounce(
        () => {
          chestOpenAudioRef.current?.play();
        },
        1000,
        {
          trailing: true,
          maxWait: 1000,
        }
      ),
    []
  );

  useEffect(() => {
    if (isPlaying) {
      chestOpenAudioRef.current?.setVolume(volume * masterVolume);
      openSoundTypeAudioRef.current?.setVolume(volume * masterVolume);
      openSoundTypeAudioRef.current?.play();
      playChestOpenSound();
    }
  }, [isPlaying, volume, masterVolume, playChestOpenSound]);

  return (
    <>
      <PositionalAudio
        ref={chestOpenAudioRef}
        url={chestOpenSfx}
        position={position}
        rotation={rotation}
        distance={5}
        loop={false}
      />
      <PositionalAudio
        ref={openSoundTypeAudioRef}
        url={openSoundType}
        position={position}
        rotation={rotation}
        distance={5}
        loop={false}
      />
    </>
  );
};

export default ChestOpenSfx;
