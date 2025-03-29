import { Canvas } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  ContactShadows,
  OrbitControls,
  useHelper,
} from "@react-three/drei";
import { Effects } from "./Effects";
import ModelLaundry from "./ModelLaundry";
import { useControls } from "leva";
import { useRef } from "react";
import * as THREE from "three";

// Light Component with useHelper
function RealisticLighting() {
  const directionalLight = useRef();

  return (
    <>
      <directionalLight
        ref={directionalLight}
        position={[5, 10, 5]}
        intensity={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
      />
      <ambientLight intensity={0.5} />
    </>
  );
}

function Kabinet() {
  return (
    <Canvas
      gl={{ logarithmicDepthBuffer: true, antialias: true }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 20], fov: 25 }}
    >
      <color attach="background" args={["#ffffff"]} />

      {/* Realistic Lighting */}
      {/* <RealisticLighting /> */}

      <ModelLaundry
        rotation={[0, -1.6, 0]}
        position={[0, -1.2, 0]}
        scale={1.5}
      />

      <ContactShadows
        resolution={1024}
        frames={1}
        position={[0, -1.16, 0]}
        scale={15}
        blur={2}
        opacity={0.8}
        far={20}
      />

      <Environment
        preset="apartment"
        background
        backgroundBlurriness={100}
      ></Environment>

      <Effects />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  );
}

export default Kabinet;
