import { PositionalAudio } from "@react-three/drei";
import { useFrame, Vector3 } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { PositionalAudio as PositionalAudioImpl } from "three";
import { useAudioStore } from "../../Store/AudioStore/AudioStore";

type FootstepProps = {
  position?: Vector3;
  isPlaying: boolean;
  volume?: number;
  pitch?: number;
  volumeVariation?: number;
  pitchVariation?: number;
  speed?: number;
  distance?: number;
  loop?: boolean;
  playOnce?: boolean;
};

const Footstep = ({
  isPlaying = false,
  volume = 1,
  volumeVariation = 1.5,
  pitch = 1,
  speed = 1,
  pitchVariation = 1,
  loop = true,
  ...props
}: FootstepProps) => {
  const audioRef = useRef<PositionalAudioImpl>(null);

  const masterVolume = useAudioStore((state) => state.masterVolume);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current?.setVolume(volume * masterVolume);
    audioRef.current?.setPlaybackRate(speed);
  }, [speed, volume, masterVolume]);

  useEffect(() => {
    if (!loop) {
      audioRef.current?.stop();
    }

    if (isPlaying && !audioRef.current?.isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.stop();
    }
  }, [isPlaying, loop]);

  useFrame(() => {
    if (audioRef.current) {
      const v =
        (volume + (Math.random() * volumeVariation - volumeVariation / 2)) *
        masterVolume;
      const p = pitch + (Math.random() * pitchVariation - pitchVariation / 2);

      audioRef.current?.setVolume(v);
      audioRef.current?.setDetune(p);
    }
  });

  return (
    <>
      <PositionalAudio
        url="/sfx/footsteps/footstep1.mp3"
        ref={audioRef}
        loop={loop}
        distance={10}
        {...props}
      />
    </>
  );
};

export default Footstep;
