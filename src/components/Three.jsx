import * as THREE from 'three';
import { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stats, OrbitControls, Environment, useGLTF, Clone, Html, ContactShadows } from '@react-three/drei';
import { useControls } from 'leva';

const Models = [
  { title: 'SOY', url: './SOY.glb', miEscala: 1.1, miPosicion: 4 },
  // { title: 'SOY1', url: './SOY1.glb', miEscala: 1.1, miPosicion: 4 },
  // { title: '5KG', url: './5KG.glb', miEscala: 1.1, miPosicion: 4 },
  // { title: '6KG', url: './6KG.glb', miEscala: 1.1, miPosicion: 4 },
  // { title: '7KG', url: './7KG.glb', miEscala: 1.1, miPosicion: 4 },
  // { title: '8', url: './8.glb', miEscala: 1.1, miPosicion: 4 },
  // { title: '9', url: './9.glb', miEscala: 1.1, miPosicion: 4 },
];

function Model({ url, miEscala, miPosicion }) {
  const { scene } = useGLTF(url);
  const group = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, ((-2 + Math.sin(t)) / 90) - 0.1, 1.3);
  });

  useEffect(() => {
    scene.traverse((node) => {
      if (node.isMesh) {
        node.material.transparent = true;
        node.material.roughness = 1;
      }
    });
  }, [scene]);

  return (
    <group ref={group} position={[.00, 0, .0]} scale={miEscala}>
      <Clone object={scene} castShadow receiveShadow />
    </group>
  );
}

function Fallback() {
  return <Html><div>Loading...</div></Html>;
}

export default function EstucheConAsas({ title }) {
  const [currentTitle, setCurrentTitle] = useState(title);

  const { modelo } = useControls('Model', {
    modelo: {
      value: title,
      options: Models.map(({ title }) => title),
    },
  });

  useEffect(() => {
    setCurrentTitle(modelo);
  }, [modelo]);

  const modelIndex = Models.findIndex((m) => m.title === currentTitle);
  const modelUrl = modelIndex !== -1 ? Models[modelIndex].url : null;
  const modelEscala = modelIndex !== -1 ? Models[modelIndex].miEscala : escala;
  const modelPosicion = modelIndex !== -1 ? Models[modelIndex].miPosicion : posicion;

  return (
    <Canvas camera={{ position: [0.5, 0.4, -0.6], near: 0.1, fov: 70 }}>
      <ambientLight intensity={0.3} />
      <hemisphereLight skyColor={'#ffffff'} groundColor={'#444444'} intensity={0.35} />
      <pointLight position={[30, 50, 10]} intensity={17000} decay={2} />
      <pointLight position={[-30, 45, 5]} intensity={15000} decay={2} />
      <pointLight position={[-28, 40, 45]} intensity={14000} decay={2} />
      <pointLight position={[25, -35, -20]} intensity={13000} decay={2} />
      <pointLight position={[22, -30, 35]} intensity={13000} decay={2} />
      <Suspense fallback={<Fallback />}>
        {modelUrl && <Model url={modelUrl} miEscala={modelEscala} miPosicion={modelPosicion} />}
      </Suspense>
      <OrbitControls autoRotate autoRotateSpeed={0.6} />
      <ContactShadows resolution={512} scale={30} position={[0, -0.4, 0]} blur={0.1} opacity={0.5} far={10} color='#8a6246' />
    </Canvas>
  );
}
