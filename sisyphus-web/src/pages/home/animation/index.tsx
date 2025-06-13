import { Canvas } from '@react-three/fiber';
import { Scene } from './scene';

const MainAnimation = () => {
  // position(x, y z) / fov: 시야각
  return (
    <Canvas
      dpr={Math.min(window.devicePixelRatio, 2)} // 렌더링 부하 줄이기
      camera={{
        position: [0, 0, 10], // Z축에서 정면으로 바라보게
        fov: 1,
        near: 0.1,
        far: 100,
        zoom: 10,
      }}
      orthographic>
      <Scene />
    </Canvas>
  );
};

export default MainAnimation;
