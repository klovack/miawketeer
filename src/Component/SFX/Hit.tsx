import { PositionalAudio } from "@react-three/drei";
import { Vector3 } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { PositionalAudio as PositionalAudioImpl } from "three";

export type HitProps = {
  position?: Vector3;
  volume?: number;
  isPlaying: boolean;
};

const audioSrcSet = ["/sfx/cat/hit1.mp3", "/sfx/cat/hit2.mp3"];

const Hit = ({ volume = 1, isPlaying, ...props }: HitProps) => {
  const [curAudioSrcIndex, setCurAudioSrcIndex] = useState(0);
  const audioRef = useRef<PositionalAudioImpl>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current?.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current?.isPlaying) {
      setCurAudioSrcIndex((prev) => (prev + 1) % audioSrcSet.length);
      audioRef.current?.setDetune(Math.random() * 2400 - 1200);
    }
  }, [audioRef.current?.isPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current?.play();
    }
  }, [isPlaying]);

  return (
    <>
      <PositionalAudio
        ref={audioRef}
        url={audioSrcSet[curAudioSrcIndex]}
        loop={false}
        distance={10}
        {...props}
      />
    </>
  );
};

export default Hit;
