// 'use client';

// import { useRef, useState, useEffect } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { OrbitControls, useGLTF, Center } from '@react-three/drei';
// import * as THREE from 'three';
// import { TextGeometry } from 'three/examples/jsm/Addons.js';

// interface ModelProps {
//   url: string;
//   visible?: boolean       
// }                                        

// function Model({ url, visible = true }: ModelProps) {
//   const [error, setError] = useState<string | null>(null);
//   const ref = useRef<THREE.Group>(null);
//   const isCentered = useRef(false); // Prevent repeated centering

//   // const { scene } = useGLTF(url, true, (err) => {
//   //   setError('Failed to load 3D model. Please ensure it is a valid .glb or .gltf file.');
//   //   console.error('Error loading model:', err);
//   // });

//   const { scene } = useGLTF(url, true); // Second arg is for Draco compression

//   useEffect(() => {
//     if (!scene) {
//       setError('Failed to load 3D model. Please ensure it is a valid .glb or .gltf file.');
//     }
//   }, [scene]);

//   useFrame(() => {
//     if (ref.current && !isCentered.current) {
//       const box = new THREE.Box3().setFromObject(ref.current);
//       const center = box.getCenter(new THREE.Vector3());
//       ref.current.position.sub(center); // Center the model
//       if (url.includes('clothing')) ref.current.position.y += 0.1; // Offset clothing
//       isCentered.current = true; // Mark as centered
//     }
//   });

//   if (error) {
//     return <mesh><TextGeometry args={[error, { size: 0.1, height: 0.02 }]} /></mesh>;
//   }

//   return <primitive object={scene} ref={ref} visible={visible} />;
// }

// interface SceneProps {
//   avatarUrl: string | null;
//   clothingUrl: string | null;
//   showClothing: boolean;
// } 

// export default function Scene({ avatarUrl, clothingUrl, showClothing }: SceneProps) {
//   // Log render for debugging
//   useEffect(() => {
//     console.log('Scene component rendered:', { avatarUrl, clothingUrl, showClothing });
//   }, [avatarUrl, clothingUrl, showClothing]);
 
//   return (
//     <Canvas style={{ height: '100vh', width: '100%' }} camera={{ position: [0, 1, 5], fov: 50 }}>
//       <ambientLight intensity={0.5} />
//       <directionalLight position={[5, 5, 5]} intensity={1} />
//       <Center>
//         {avatarUrl && <Model url={avatarUrl} />}
//         {clothingUrl && <Model url={clothingUrl} visible={showClothing} />}
//       </Center>
//       <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
//     </Canvas>
//   );
// }


import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Text } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
  url: string;
  visible?: boolean;
}

function Model({ url, visible = true }: ModelProps) {
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<THREE.Group>(null);
  const isCentered = useRef(false);

  const { scene } = useGLTF(url, true);

  useEffect(() => {
    if (!scene) {
      setError('Failed to load 3D model. Please ensure it is a valid .glb or .gltf file.');
    }
  }, [scene]);

  useFrame(() => {
    if (ref.current && !isCentered.current) {
      const box = new THREE.Box3().setFromObject(ref.current);
      const center = box.getCenter(new THREE.Vector3());
      ref.current.position.sub(center);
      if (url.includes('clothing')) ref.current.position.y += 0.1;
      isCentered.current = true;
    }
  });

  if (error) {
    return (
      <Text
        color="red"
        fontSize={0.1}
        maxWidth={2}
        textAlign="center"
        position={[0, 0, 0]}
      >
        {error}
      </Text>
    );
  }

  return <primitive object={scene} ref={ref} visible={visible} />;
}

interface SceneProps {
  avatarUrl: string | null;
  clothingUrl: string | null;
  showClothing: boolean;
}

export default function Scene({ avatarUrl, clothingUrl, showClothing }: SceneProps) {
  useEffect(() => {
    console.log('Scene component rendered:', { avatarUrl, clothingUrl, showClothing });
  }, [avatarUrl, clothingUrl, showClothing]);

  return (
    <Canvas style={{ height: '100vh', width: '100%' }} camera={{ position: [0, 1, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Center>
        {avatarUrl && <Model url={avatarUrl} />}
        {clothingUrl && <Model url={clothingUrl} visible={showClothing} />}
      </Center>
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </Canvas>
  );
}