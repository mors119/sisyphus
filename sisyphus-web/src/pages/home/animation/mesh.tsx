import * as THREE from 'three';

// 사람
export const Character = ({ position }: { position: THREE.Vector3 }) => {
  return (
    <mesh position={position.toArray()}>
      <boxGeometry args={[0.4, 0.8, 0.1]} />
      <meshStandardMaterial color="skyblue" />
    </mesh>
  );
};

// 지형
export const Ground = () => {
  const geometry = new THREE.BufferGeometry();

  // Z축이 0인 평면상에서 XY 삼각형 꼭짓점 정의
  const vertices = new Float32Array([
    -10,
    -2,
    0, // 왼쪽 아래
    10,
    -2,
    0, // 오른쪽 아래
    0,
    5,
    0, // 위쪽
  ]);

  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();

  return (
    <mesh geometry={geometry} position={[0, 0, 0]}>
      <meshStandardMaterial color="#1186ce" side={THREE.DoubleSide} />
    </mesh>
  );
};

// 공
export const Ball = ({ position }: { position: THREE.Vector3 }) => {
  return (
    <mesh position={position.toArray()}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color="#ffcd49" />
    </mesh>
  );
};
