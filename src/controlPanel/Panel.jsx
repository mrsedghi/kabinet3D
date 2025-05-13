/* eslint-disable react/no-unknown-property */
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  OrbitControls,
  RandomizedLight,
} from "@react-three/drei";
import * as THREE from "three";
import ControlPanel from "./ControlPanel";
import NodeSidebar from "./NodeSidebar";

function Panel() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <Canvas
        gl={{
          logarithmicDepthBuffer: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.8,
        }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 20], fov: 25 }}
        shadows
      >
        <color attach="background" args={["#f0f0f0"]} />
        <Environment preset="apartment" background backgroundBlurriness={100} />

        <ambientLight intensity={0.2} color="#ffffff" />
        <hemisphereLight
          intensity={0.5}
          color="#ffffff"
          groundColor="#b97a20"
          position={[0, 50, 0]}
        />
        <directionalLight
          position={[5, 10, 7]}
          intensity={1.5}
          color="#ffebc1"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-bias={-0.0001}
        />
        <directionalLight
          position={[-5, 5, -5]}
          intensity={0.8}
          color="#a6c1ff"
        />
        <directionalLight
          position={[0, -5, 0]}
          intensity={0.3}
          color="#ffffff"
        />

        <ControlPanel
          rotation={[0, -1.6, 0]}
          position={[0, -1.155, 0]}
          scale={1.5}
          onNodeClick={handleNodeClick}
          selectedNode={selectedNode}
        />

        <ContactShadows
          resolution={1024}
          frames={1}
          position={[0, -1.16, 0]}
          scale={15}
          blur={2}
          opacity={0.6}
          far={10}
          color="#474747"
        />

        <RandomizedLight
          amount={8}
          radius={5}
          ambient={0.5}
          intensity={1}
          position={[5, 5, -5]}
          bias={0.001}
        />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minPolarAngle={Math.PI / 2.6}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>

      <NodeSidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        selectedNode={selectedNode}
      />
    </>
  );
}

export default Panel;
