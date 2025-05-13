/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function ControlPanel({ onNodeClick, selectedNode, ...props }) {
  const { scene, nodes } = useGLTF("/Laundry.glb");
  const outlineMeshes = useRef([]);
  const [outlineMaterial] = useState(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.2,
        depthTest: false,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      })
  );

  const handleClick = (e) => {
    e.stopPropagation();
    if (nodes[e.object.name]) {
      onNodeClick(e.object);
    }
  };

  useFrame(() => {
    outlineMeshes.current.forEach((item) => {
      if (item.outline && item.original) {
        item.outline.position.copy(item.original.position);
        item.outline.rotation.copy(item.original.rotation);
        item.outline.scale.set(
          item.original.scale.x * 1.05,
          item.original.scale.y * 1.05,
          item.original.scale.z * 1.05
        );
      }
    });
  });

  useEffect(() => {
    outlineMeshes.current.forEach((item) => {
      if (item.outline && item.outline.parent) {
        item.outline.parent.remove(item.outline);
      }
    });
    outlineMeshes.current = [];

    if (!selectedNode || !nodes[selectedNode.name]) return;

    const originalMesh = nodes[selectedNode.name];
    const outlineGeometry = originalMesh.geometry.clone();

    const outlineMesh = new THREE.Mesh(outlineGeometry, outlineMaterial);
    outlineMesh.name = `outline-${selectedNode.name}`;

    outlineMesh.position.copy(originalMesh.position);
    outlineMesh.rotation.copy(originalMesh.rotation);
    outlineMesh.scale.set(
      originalMesh.scale.x * 1.05,
      originalMesh.scale.y * 1.05,
      originalMesh.scale.z * 1.05
    );

    originalMesh.parent.add(outlineMesh);

    outlineMeshes.current.push({
      outline: outlineMesh,
      original: originalMesh,
      nodeName: selectedNode.name,
    });

    return () => {
      outlineMeshes.current.forEach((item) => {
        if (item.outline && item.outline.parent) {
          item.outline.parent.remove(item.outline);
        }
      });
      outlineMeshes.current = [];
    };
  }, [selectedNode, nodes, outlineMaterial]);

  return <primitive object={scene} {...props} onClick={handleClick} />;
}

export default ControlPanel;
