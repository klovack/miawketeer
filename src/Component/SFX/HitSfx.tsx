import { PositionalAudio } from "@react-three/drei";
import { Vector3 } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { PositionalAudio as PositionalAudioImpl } from "three";
import { useAudioStore } from "../../Store/AudioStore/AudioStore";

export type HitSfxProps = {
  position?: Vector3;
  volume?: number;

  /**
   * Play hit sound
   */
  isPlaying: boolean;
};

const hitSrcSet = ["/sfx/cue/hit1.mp3", "/sfx/cue/hit2.mp3"];

const HitSfx = ({
  position = [0, 0, 0],
  volume = 1,
  isPlaying,
}: HitSfxProps) => {
  const [curAudioSrc, setCurAudioSrc] = useState(hitSrcSet[0]);
  const posAudioRef = useRef<PositionalAudioImpl>(null);

  const { masterVolume } = useAudioStore((state) => ({
    masterVolume: state.masterVolume,
  }));

  useEffect(() => {
    if (isPlaying) {
      posAudioRef.current?.play();
    } else {
      posAudioRef.current?.stop();
      posAudioRef.current?.setVolume(volume * masterVolume);
      posAudioRef.current?.setDetune(Math.random() * 1200 - 600);
      const randomHitSrcIndex = Math.floor(Math.random() * hitSrcSet.length);
      setCurAudioSrc(hitSrcSet[randomHitSrcIndex]);
    }
  }, [isPlaying, volume, masterVolume]);

  return (
    <>
      <PositionalAudio
        ref={posAudioRef}
        url={curAudioSrc}
        position={position}
      />
    </>
  );
};

export default HitSfx;
