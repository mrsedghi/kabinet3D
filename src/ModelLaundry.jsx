import { useGLTF, Text, useTexture } from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";

export default function ModelLaundry(props) {
  const { scene, nodes, materials } = useGLTF("/Laundry.glb");
  const { gl, camera } = useThree();
  const [selectedNode, setSelectedNode] = useState(null);
  const [highlightMaterial] = useState(() => 
    new THREE.MeshStandardMaterial({ 
      color: 0xff0000,
      emissive: 0x444444,
      roughness: 0.5,
      metalness: 0.5 
    })
  );
  
  // Store initial positions, scales and materials of nodes
  const initialData = useRef({});
  
  useEffect(() => {
    if (nodes) {
      initialData.current = {};
      Object.keys(nodes).forEach((key) => {
        initialData.current[key] = {
          position: nodes[key].position?.clone(),
          scale: nodes[key].scale?.clone(),
          material: nodes[key].material
        };
      });
    }
  }, [nodes]);

  // Load JPG textures
  const texture1 = useTexture("/textures/material1.jpg");
  const texture2 = useTexture("/textures/material2.jpg");
  const texture3 = useTexture("/textures/material3.jpg");
  const texture4 = useTexture("/textures/material4.jpg");

  // Add texture selection to Leva
  const { baseTexture, topTexture } = useControls({
    baseTexture: {
      value: "Texture 1",
      options: ["Texture 1", "Texture 2", "Texture 3", "Texture 4"],
      label: "Base Texture",
    },
    topTexture: {
      value: "Texture 1",
      options: ["Texture 1", "Texture 2", "Texture 3", "Texture 4"],
      label: "Top Texture",
    },
  });

  // Map texture names to loaded textures
  const textureMap = {
    "Texture 1": texture1,
    "Texture 2": texture2,
    "Texture 3": texture3,
    "Texture 4": texture4,
  };

  // Function to update material textures
  const updateMaterialTexture = (material, texture) => {
    if (material instanceof THREE.MeshStandardMaterial) {
      const newTexture = texture.clone();
      newTexture.needsUpdate = true;
      newTexture.wrapS = THREE.RepeatWrapping;
      newTexture.wrapT = THREE.RepeatWrapping;
      newTexture.repeat.set(0.5, 0.5);
      material.map = newTexture;
      material.needsUpdate = true;
    }
  };

  // Update materials when texture selection changes
  useEffect(() => {
    if (materials["*3"]) {
      const selectedTextureBase = textureMap[baseTexture];
      updateMaterialTexture(materials["*3"], selectedTextureBase);
    }
    if (materials["*5"]) {
      const selectedTextureTop = textureMap[topTexture];
      updateMaterialTexture(materials["*5"], selectedTextureTop);
    }
  }, [baseTexture, topTexture, materials, textureMap]);

  // Improved click handler
  useEffect(() => {
    const handleClick = (event) => {
      // Only handle clicks directly on the canvas
      if (event.target !== gl.domElement) return;
      
      event.stopPropagation();
      
      const canvas = gl.domElement;
      const rect = canvas.getBoundingClientRect();
      
      // Calculate mouse position in normalized device coordinates
      const mouse = new THREE.Vector2();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Set up raycaster
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      
      // Find all intersected objects
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        // Find the first object that has a name
        let clickedObject = intersects[0].object;
        
        // Traverse up the parent chain to find a named object
        while (clickedObject && !clickedObject.name && clickedObject.parent) {
          clickedObject = clickedObject.parent;
        }
        
        if (clickedObject && clickedObject.name) {
          // Check if this is one of our known nodes
          const nodeName = Object.keys(nodes).find(key => {
            const node = nodes[key];
            return (
              node === clickedObject || 
              node.uuid === clickedObject.uuid ||
              (node.isObject3D && node.children.includes(clickedObject))
            );
          });
          
          if (nodeName) {
            setSelectedNode(nodeName);
            console.log("Selected node:", nodeName, clickedObject);
          } else {
            console.log("Clicked object not in nodes:", clickedObject.name, clickedObject);
          }
        }
      }
    };

    const canvas = gl.domElement;
    canvas.addEventListener('click', handleClick);
    return () => canvas.removeEventListener('click', handleClick);
  }, [gl, camera, scene, nodes]);

  // Highlight selected node
  useEffect(() => {
    if (!nodes) return;

    // Reset all materials to original
    Object.keys(nodes).forEach(key => {
      const node = nodes[key];
      if (node && node.material && initialData.current[key]?.material) {
        node.material = initialData.current[key].material;
      }
    });

    // Highlight selected node if it exists
    if (selectedNode && nodes[selectedNode]) {
      const node = nodes[selectedNode];
      
      // Store original material if not already stored
      if (node.material && !initialData.current[selectedNode]?.material) {
        initialData.current[selectedNode] = {
          ...initialData.current[selectedNode],
          material: node.material
        };
      }
      
      node.material = highlightMaterial;
    }
  }, [selectedNode, nodes, highlightMaterial]);

// Create controls for scaling and positioning
const {
  bulkHead,
  baseHeight,
  baseDepth,
  topHeight,
  topDepth,
  tallHeight,
  tallDepth,
  kicker,
  allwidth,
  topTwo,
  tallWidth,
  baseTwo,
  topOne,
  baseOne,
} = useControls({
  allwidth: { value: 2400, min: 1500, max: 4000, step: 100, label: "all Width" },
  bulkHead: { value: 300, min: 100, max: 500, step: 10, label: "BulkHead Height" },
  baseHeight: { value: 730, min: 500, max: 1000, step: 10, label: "Base Height" },
  baseDepth: { value: 580, min: 400, max: 800, step: 10, label: "Base Depth" },
  baseOne: { value: 800, min: 500, max: 1000, step: 10, label: "Base One" },
  baseTwo: { value: 600, min: 500, max: 1000, step: 10, label: "Base Two" },
  topHeight: { value: 730, min: 500, max: 900, step: 10, label: "Top Height" },
  topDepth: { value: 320, min: 200, max: 500, step: 10, label: "Top Depth" },
  topOne: { value: 700, min: 500, max: 900, step: 10, label: "Top One" },
  topTwo: { value: 700, min: 500, max: 900, step: 10, label: "Top Two" },
  tallHeight: { value: 2200, min: 1700, max: 2500, step: 10, label: "Tall Height" },
  tallDepth: { value: 600, min: 300, max: 700, step: 10, label: "Tall Depth" },
  tallWidth: { value: 930, min: 500, max: 2000, step: 10, label: "Tall Width" },
  kicker: { value: 140, min: 100, max: 300, step: 10, label: "Kicker" },
});

// Apply scales and positions
useEffect(() => {
  if (!nodes || !initialData.current) return;

  // Reset nodes to initial state before applying new transformations
  Object.keys(nodes).forEach((key) => {
    const node = nodes[key];
    const initial = initialData.current[key];

    if (node && initial) {
      if (initial.position) node.position.copy(initial.position);
      if (initial.scale) node.scale.copy(initial.scale);
    }
  });

  // Apply bulkHead adjustments
  nodes["3DGeom-3"].scale.x = bulkHead / 300
  nodes["3DGeom-4"].scale.y = bulkHead / 300
  nodes["3DGeom-5"].scale.y=bulkHead/300


  // Apply baseHeight adjustments
  nodes["3DGeom-10"].scale.z =  baseHeight/730;
  nodes["3DGeom-11"].scale.z = baseHeight/730;
  nodes["3DGeom-13"].position.y +=  (baseHeight-730)/25;
  nodes["3DGeom-12"].position.y += (baseHeight - 730) / 25;
 

    // Apply baseDepth adjustments
  nodes["Assembly-22"].children[7].scale.x=baseDepth/22.85
  

  // Apply baseOne adjustments 
  nodes["3DGeom-10"].scale.y = baseOne / 800
  nodes["3DGeom-13"].scale.x = baseOne / 800
  nodes["3DGeom-16"].scale.y = baseOne / 800
  nodes["3DGeom-11"].position.y += (baseOne - 800)/25.4
  nodes["3DGeom-12"].position.x += (baseOne - 800)/25.4
  nodes["3DGeom-14"].position.y += (baseOne - 800)/25.4
  nodes["3DGeom-15"].position.y += (baseOne - 800)/25.4



  // Apply baseTwo adjustments
  nodes["3DGeom-11"].scale.y =baseTwo / 600
  nodes["3DGeom-12"].scale.x =baseTwo / 600
  nodes["3DGeom-15"].scale.y =baseTwo / 600
  nodes["3DGeom-14"].position.y += (baseTwo - 600)/25.4


  // Apply topHeight adjustments
  nodes["3DGeom-6"].scale.y=topHeight/730
  nodes["3DGeom-7"].scale.y=topHeight/730
  

  // Apply topDepth adjustments
  nodes["Assembly-22"].children[4].scale.x = topDepth / 12.59
  nodes["3DGeom-4"].scale.z = topDepth / 320
  nodes["3DGeom-5"].scale.z = topDepth / 320

  // Apply topOne adjustments
  nodes["3DGeom-7"].scale.x = topOne / 700
  nodes["3DGeom-5"].scale.x = topOne / 700
  nodes["3DGeom-4"].position.x += (topOne - 700)/25.4
  nodes["3DGeom-6"].position.x += (topOne - 700)/25.4

  // Apply topTwo adjustments
  nodes["3DGeom-4"].scale.x = topTwo / 700
  nodes["3DGeom-6"].scale.x = topTwo / 700


  
  // Apply tallHeight adjustments
  const tallHeightOffset = (tallHeight - 2200) / 25.4;
  nodes["3DGeom-1"].scale.z = tallHeight / 2200
  nodes["3DGeom-3"].position.x += tallHeightOffset;
  nodes["3DGeom-4"].position.y += tallHeightOffset;
  nodes["3DGeom-5"].position.y += tallHeightOffset;
  nodes["3DGeom-6"].position.y -= tallHeightOffset;
  nodes["3DGeom-7"].position.y -= tallHeightOffset;


// Apply tallDepth adjustments
  nodes["3DGeom-1"].scale.x = tallDepth / 600
  nodes["3DGeom-2"].scale.x = tallDepth / 600
  nodes["3DGeom-3"].scale.z = tallDepth / 600
  nodes["3DGeom-8"].scale.x = tallDepth / 600
  nodes["3DGeom-9"].scale.z = tallDepth / 600
 

   // Apply tallWidth adjustments
  nodes["3DGeom-1"].scale.y = (tallWidth-30) / 900
  nodes["3DGeom-3"].scale.y = tallWidth / 930
  nodes["3DGeom-9"].scale.y = (tallWidth-30) / 900
  nodes["3DGeom-8"].position.y -= (tallWidth-930) / 25.4

  // Apply kicker adjustments
  const kickerOffset = (kicker - 140) / 25.4;
  nodes["3DGeom-9"].scale.x = kicker / 140
  nodes["3DGeom-15"].scale.z = kicker / 140
  nodes["3DGeom-16"].scale.z = kicker / 140
  nodes["3DGeom-1"].position.z -= kickerOffset;
  nodes["3DGeom-3"].position.x += kickerOffset;
  nodes["3DGeom-4"].position.y += kickerOffset;
  nodes["3DGeom-5"].position.y += kickerOffset;
  nodes["3DGeom-6"].position.y -= kickerOffset;
  nodes["3DGeom-7"].position.y -= kickerOffset;
  nodes["3DGeom-10"].position.z += kickerOffset;
  nodes["3DGeom-11"].position.z += kickerOffset;
  nodes["3DGeom-12"].position.y += kickerOffset;
  nodes["3DGeom-13"].position.y += kickerOffset;


  // Apply allwidth adjustments
  if (nodes["Assembly-22"]) {
    nodes["Assembly-22"].scale.y = allwidth / 2400000;
  }

 // Combined adjustments for nodes that were being modified in multiple places
 const combinedScaleZ = (tallHeight + kicker) / 2340;
 nodes["3DGeom-2"].scale.z = combinedScaleZ;
 nodes["3DGeom-8"].scale.z = combinedScaleZ;
 
 // Combined x-scale for 3DGeom-8 (tallDepth)
 nodes["3DGeom-2"].scale.x = tallDepth / 600;
 nodes["3DGeom-8"].scale.x = tallDepth / 600;

 // Combined scale for 3DGeom-14 (baseHeight and kicker)
 nodes["3DGeom-14"].scale.x = (baseHeight + kicker) / 870;

}, [
  bulkHead,
  baseHeight,
  baseDepth,
  topHeight,
  topDepth,
  tallHeight,
  tallDepth,
  kicker,
  nodes,
  allwidth,
  topTwo,
  tallWidth,
  baseTwo,
  topOne,
  baseOne,
]);




  return (
    <>
      <primitive object={scene} {...props} />

      {/* Display selected node info */}
      {selectedNode && (
        <Text
          position={[0, 3, 0]}
          fontSize={0.2}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {`Selected: ${selectedNode}`}
        </Text>
      )}
    </>
  );
}