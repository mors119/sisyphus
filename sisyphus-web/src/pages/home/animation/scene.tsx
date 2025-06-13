import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { Ball, Character, Ground } from './mesh';

// 장면
export const Scene = () => {
  const characterRef = useRef<THREE.Vector3>(new THREE.Vector3(-5, 0, 0)); // 사람 위치
  const ballRef = useRef<THREE.Vector3>(new THREE.Vector3(-5.5, 0, 0)); // 공 위치
  // const directionRef = useRef<'up' | 'down'>('up'); // 거리 위치
  const [phase, setPhase] = useState<'climb' | 'roll' | 'wait' | 'reset'>(
    'climb',
  ); // 애니메이션 상태
  const timerRef = useRef(0);

  useFrame((_, delta) => {
    const character = characterRef.current;
    const ball = ballRef.current;
    const speed = 1.5;

    if (phase === 'climb') {
      character.x += speed * delta;
      ball.x += speed * delta * 1.05;
      if (character.x >= 0) {
        setPhase('roll');
      }
    } else if (phase === 'roll') {
      ball.x += speed * delta * 1.8;
      if (ball.x >= 5) {
        setPhase('wait');
        timerRef.current = 0;
      }
    } else if (phase === 'wait') {
      timerRef.current += delta;
      if (timerRef.current > 1) {
        character.x += speed * delta;
        if (character.x >= 5) {
          setPhase('reset');
        }
      }
    } else if (phase === 'reset') {
      character.x = -5;
      ball.x = -5.5;
      setPhase('climb');
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 5, 5]} intensity={1.2} castShadow />
      <Ground />
      <Character position={characterRef.current} />
      <Ball position={ballRef.current} />
    </>
  );
};
