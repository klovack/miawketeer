import { PositionalAudio } from "@react-three/drei";
import { Vector3 } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { PositionalAudio as PositionalAudioImpl } from "three";

export type MeowProps = {
  position?: Vector3;
  volume?: number;

  /**
   * Play meow
   */
  isPlaying: boolean;

  /**
   * Play meow hit sound
   */
  isHit?: boolean;
};

const meowSrcSet = [
  "sfx/cat/meow1.mp3",
  "sfx/cat/meow2.mp3",
  "sfx/cat/meow3.mp3",
];
const hitSrcSet = ["/sfx/cat/hit1.mp3", "/sfx/cat/hit2.mp3"];

const Meow = ({
  volume = 1,
  isPlaying,
  isHit = false,
  ...props
}: MeowProps) => {
  const [curAudioSrc, setCurAudioSrc] = useState(meowSrcSet[0]);
  const audioRef = useRef<PositionalAudioImpl>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current?.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      const randomMeowSrcIndex = Math.floor(Math.random() * meowSrcSet.length);
      setCurAudioSrc(meowSrcSet[randomMeowSrcIndex]);
    }

    if (isHit) {
      const randomHitSrcIndex = Math.floor(Math.random() * hitSrcSet.length);
      setCurAudioSrc(hitSrcSet[randomHitSrcIndex]);
    }

    if (isHit || isPlaying) {
      audioRef.current?.setDetune(Math.random() * 1200 - 600);
      if (audioRef.current?.isPlaying) {
        audioRef.current?.stop();
      }

      setTimeout(() => {
        if (Math.random() < 0.4 || isHit) audioRef.current?.play();
      }, 10);
    }
  }, [isPlaying, isHit]);

  return (
    <>
      <PositionalAudio
        ref={audioRef}
        url={curAudioSrc}
        loop={false}
        distance={10}
        {...props}
      />
    </>
  );
};

export default Meow;
