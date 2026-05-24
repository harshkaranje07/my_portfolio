import React, { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Center, useProgress, Html } from "@react-three/drei";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ 
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '10px',
        color: '#facc15',
        letterSpacing: '2px',
        opacity: 0.7
      }}>
        LOADING_MODEL {Math.round(progress)}%
      </div>
    </Html>
  );
}

function Model() {
  const { scene } = useGLTF("/models/D2.glb");

  useEffect(() => {
    // Optimize materials on load
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
        if (child.material) {
          child.material.needsUpdate = false;
        }
      }
    });
  }, [scene]);

  return (
    <Center>
      <primitive object={scene} scale={0.01} />
    </Center>
  );
}

export default function DroneModel() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 2, 6], fov: 45 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={1.8} castShadow={false} />

        <Suspense fallback={<Loader />}>
          <Model />
        </Suspense>

        <OrbitControls 
          enablePan={false} 
          enableDamping={true}
          dampingFactor={0.05}
          autoRotate={true}
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}

// Preload at module level
useGLTF.preload("/models/D2.glb");