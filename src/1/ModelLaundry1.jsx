import { useGLTF, Text, useTexture, useHelper } from "@react-three/drei";
import { useControls, Leva } from "leva";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";

export default function ModelLaundry(props) {
  const { scene, nodes, materials } = useGLTF("/Laundry2.glb");
  const { gl, camera } = useThree();
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Create outline material for borders
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

  // Reference to store outline meshes
  const outlineMeshes = useRef([]);

  // Central state for all parameters
  const [params, setParams] = useState({
    allwidth: 2400,
    baseOneTexture: "Texture 1",
    baseTwoTexture: "Texture 1",
    topOneTexture: "Texture 1",
    topTwoTexture: "Texture 1",
    tallTexture: "Texture 1",
    baseHeight: 730,
    baseDepth: 580,
    topHeight: 730,
    topDepth: 320,
    tallHeight: 2200,
    tallDepth: 600,
    tallWidth: 930,
    bulkHead: 300,
    kicker: 140,
    baseOne: 800,
    baseTwo: 600,
    topOne: 875,
    topTwo: 437,
    borderColor: "#ff0000",
    borderThickness: 0.05,
  });

  // Define node groups with controls
  const nodeGroups = useRef({
    baseOne: {
      nodes: ["3DGeom-10"],
      label: "Base One",
      material: "baseOne",
      controls: {
        baseOne: {
          value: 800,
          min: 500,
          max: 1000,
          step: 10,
          label: "Width",
          order: -1000,
        },
        baseHeight: {
          value: 730,
          min: 500,
          max: 1000,
          step: 10,
          label: "Height",
          order: -999,
        },
        baseDepth: {
          value: 580,
          min: 400,
          max: 800,
          step: 10,
          label: "Depth",
          order: -998,
        },
        baseOneTexture: {
          value: "Texture 1",
          options: [
            "Texture 1",
            "Texture 2",
            "Texture 3",
            "Texture 4",
            "Texture 5",
          ],
          label: "Texture",
          order: -997,
        },
      },
    },
    baseTwo: {
      nodes: ["3DGeom-11"],
      label: "Base Two",
      material: "baseTwo",
      controls: {
        baseTwo: {
          value: 600,
          min: 500,
          max: 1000,
          step: 10,
          label: "Width",
          order: -1000,
        },
        baseHeight: {
          value: 730,
          min: 500,
          max: 1000,
          step: 10,
          label: "Height",
          order: -999,
        },
        baseDepth: {
          value: 580,
          min: 400,
          max: 800,
          step: 10,
          label: "Depth",
          order: -998,
        },
        baseTwoTexture: {
          value: "Texture 1",
          options: [
            "Texture 1",
            "Texture 2",
            "Texture 3",
            "Texture 4",
            "Texture 5",
          ],
          label: "Texture",
          order: -997,
        },
      },
    },
    topTwo: {
      nodes: ["3DGeom-18"],
      label: "Top Two",
      material: "topTwo",
      controls: {
        topTwo: {
          value: 437,
          min: 400,
          max: 900,
          step: 10,
          label: "Width",
          order: -1000,
        },
        topHeight: {
          value: 730,
          min: 500,
          max: 900,
          step: 10,
          label: "Height",
          order: -999,
        },
        topDepth: {
          value: 320,
          min: 200,
          max: 500,
          step: 10,
          label: "Depth",
          order: -998,
        },
        topTwoTexture: {
          value: "Texture 1",
          options: [
            "Texture 1",
            "Texture 2",
            "Texture 3",
            "Texture 4",
            "Texture 5",
          ],
          label: "Texture",
          order: -997,
        },
      },
    },
    topOne: {
      nodes: ["3DGeom-21"],
      label: "Top One",
      material: "topOne",
      controls: {
        topOne: {
          value: 875,
          min: 500,
          max: 900,
          step: 10,
          label: "Width",
          order: -1000,
        },
        topHeight: {
          value: 730,
          min: 500,
          max: 900,
          step: 10,
          label: "Height",
          order: -999,
        },
        topDepth: {
          value: 320,
          min: 200,
          max: 500,
          step: 10,
          label: "Depth",
          order: -998,
        },
        topOneTexture: {
          value: "Texture 1",
          options: [
            "Texture 1",
            "Texture 2",
            "Texture 3",
            "Texture 4",
            "Texture 5",
          ],
          label: "Texture",
          order: -997,
        },
      },
    },
    tallGroup: {
      nodes: ["3DGeom-1", "3DGeom-2", "3DGeom-8"],
      label: "Tall Group",
      material: "tall",
      controls: {
        tallWidth: {
          value: 930,
          min: 500,
          max: 2000,
          step: 10,
          label: "Width",
          order: -1000,
        },
        tallHeight: {
          value: 2200,
          min: 1700,
          max: 2500,
          step: 10,
          label: "Height",
          order: -999,
        },
        tallDepth: {
          value: 600,
          min: 300,
          max: 700,
          step: 10,
          label: "Depth",
          order: -998,
        },
        tallTexture: {
          value: "Texture 1",
          options: [
            "Texture 1",
            "Texture 2",
            "Texture 3",
            "Texture 4",
            "Texture 5",
          ],
          label: "Texture",
          order: -997,
        },
      },
    },
    bulkheadGroup: {
      nodes: ["3DGeom-16", "3DGeom-6"],
      label: "Bulkhead Group",
      controls: {
        bulkHead: {
          value: 300,
          min: 100,
          max: 500,
          step: 10,
          label: "Height",
          order: -1000,
        },
      },
    },
    kickerGroup: {
      nodes: ["3DGeom-9", "3DGeom-15", "3DGeom-16"],
      label: "Kicker Group",
      controls: {
        kicker: {
          value: 140,
          min: 100,
          max: 300,
          step: 10,
          label: "Height",
          order: -1000,
        },
      },
    },
  });

  // Store initial positions and materials
  const initialData = useRef({});
  const positionStabilizer = useRef({
    lastActiveTime: Date.now(),
    needsReset: false,
  });

  // Track tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const inactiveDuration =
          Date.now() - positionStabilizer.current.lastActiveTime;
        if (inactiveDuration > 60000) {
          positionStabilizer.current.needsReset = true;
        }
      } else {
        positionStabilizer.current.lastActiveTime = Date.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Initialize node data
  useEffect(() => {
    if (nodes) {
      initialData.current = {};
      Object.keys(nodes).forEach((key) => {
        if (nodes[key].position) {
          initialData.current[key] = {
            position: nodes[key].position.clone(),
            scale: nodes[key].scale?.clone(),
            material: nodes[key].material,
          };
        }
      });
    }
  }, [nodes]);

  // Load textures
  const texture1 = useTexture("/textures/material1.jpg");
  const texture2 = useTexture("/textures/material2.jpg");
  const texture3 = useTexture("/textures/material3.jpg");
  const texture4 = useTexture("/textures/material4.jpg");
  const texture5 = useTexture("/textures/material5.jpeg");

  // Texture mapping
  const textureMap = {
    "Texture 1": texture1,
    "Texture 2": texture2,
    "Texture 3": texture3,
    "Texture 4": texture4,
    "Texture 5": texture5,
  };

  // Update material textures with dynamic scaling
  useEffect(() => {
    const calculateDynamicRepeat = (
      nodeName,
      baseWidth,
      maxWidth,
      baseHeight,
      maxHeight,
      widthAxis,
      heightAxis
    ) => {
      if (!nodes[nodeName]) return { x: 0.5, y: 0.5 };

      return {
        x: (nodes[nodeName].scale[widthAxis] * baseWidth) / maxWidth,
        y: (nodes[nodeName].scale[heightAxis] * baseHeight) / maxHeight,
      };
    };

    const updateMaterialTexture = (material, texture, repeatX, repeatY) => {
      if (material instanceof THREE.MeshStandardMaterial) {
        const newTexture = texture.clone();
        newTexture.wrapS = THREE.MirroredRepeatWrapping;
        newTexture.wrapT = THREE.MirroredRepeatWrapping;
        newTexture.repeat.set(repeatX, repeatY);
        material.map = newTexture;
        material.needsUpdate = true;
        material.metalness = 0.2;
        material.roughness = 0.2;
        material.envMapIntensity = 0.8;
        material.clearcoat = 0.8;
        material.clearcoatRoughness = 0.2;
      }
    };

    Object.entries(nodeGroups.current).forEach(([groupName, groupData]) => {
      if (groupData.material && materials[groupData.material]) {
        const textureParam = groupName.includes("baseOne")
          ? params.baseOneTexture
          : groupName.includes("baseTwo")
          ? params.baseTwoTexture
          : groupName.includes("topOne")
          ? params.topOneTexture
          : groupName.includes("topTwo")
          ? params.topTwoTexture
          : groupName.includes("tall")
          ? params.tallTexture
          : params.baseOneTexture;

        let repeatX, repeatY;

        if (groupName.includes("baseOne")) {
          const repeat = calculateDynamicRepeat(
            "3DGeom-10",
            800,
            1000,
            730,
            1000,
            "y",
            "z"
          );
          repeatX = repeat.x;
          repeatY = repeat.y;
        } else if (groupName.includes("baseTwo")) {
          const repeat = calculateDynamicRepeat(
            "3DGeom-11",
            600,
            1000,
            730,
            1000,
            "y",
            "z"
          );
          repeatX = repeat.x;
          repeatY = repeat.y;
        } else if (groupName.includes("topOne")) {
          const repeat = calculateDynamicRepeat(
            "3DGeom-7",
            700,
            900,
            730,
            900,
            "x",
            "y"
          );
          repeatX = repeat.x;
          repeatY = repeat.y;
        } else if (groupName.includes("topTwo")) {
          const repeat = calculateDynamicRepeat(
            "3DGeom-6",
            700,
            900,
            730,
            900,
            "x",
            "y"
          );
          repeatX = repeat.x;
          repeatY = repeat.y;
        } else if (groupName.includes("tall")) {
          const repeat = calculateDynamicRepeat(
            "3DGeom-1",
            930,
            2000,
            2200,
            2500,
            "y",
            "z"
          );
          repeatX = repeat.x;
          repeatY = repeat.y;
        } else {
          repeatX = 0.5;
          repeatY = 0.5;
        }

        const selectedTexture = textureMap[textureParam];
        updateMaterialTexture(
          materials[groupData.material],
          selectedTexture,
          repeatX,
          repeatY
        );
      }
    });
  }, [
    params.baseOneTexture,
    params.baseTwoTexture,
    params.topOneTexture,
    params.topTwoTexture,
    params.tallTexture,
    materials,
    textureMap,
    nodes,
  ]);

  // Add border settings to global controls
  useControls("Global Settings", {
    allwidth: {
      value: params.allwidth,
      min: 1500,
      max: 4000,
      step: 100,
      label: "All Width",
      onChange: (v) => setParams((p) => ({ ...p, allwidth: v })),
    },
  });

  // Group-specific controls
  useControls(
    "Group Controls",
    () => {
      if (!selectedGroup) return {};
      const group = nodeGroups.current[selectedGroup];
      const controls = {};

      Object.entries(group.controls).forEach(([key, config]) => {
        controls[key] = {
          ...config,
          value: params[key],
          onChange: (v) => setParams((p) => ({ ...p, [key]: v })),
        };
      });

      return controls;
    },
    [selectedGroup, params]
  );

  // Main transformation logic
  useFrame(() => {
    if (!nodes || !initialData.current) return;

    if (positionStabilizer.current.needsReset) {
      Object.keys(nodes).forEach((key) => {
        const node = nodes[key];
        const initial = initialData.current[key];
        if (node && initial?.position) {
          node.position.copy(initial.position);
        }
      });
      positionStabilizer.current.needsReset = false;
      return;
    }

    // Reset all nodes first
    Object.keys(nodes).forEach((key) => {
      const node = nodes[key];
      const initial = initialData.current[key];
      if (node && initial) {
        if (initial.position) node.position.copy(initial.position);
        if (initial.scale) node.scale.copy(initial.scale);
      }
    });

    const roundTo = (value, precision = 0) => {
      const multiplier = Math.pow(10, precision);
      return Math.round(value * multiplier) / multiplier;
    };

    // Calculate all offsets with rounding
    const baseHeightOffset = roundTo((params.baseHeight - 730) / 25.4, 2);
    const baseOneOffset = roundTo((params.baseOne - 800) / 25.4, 2);
    const baseTwoOffset = roundTo((params.baseTwo - 600) / 25.4, 2);
    const topOneOffset = roundTo((params.topOne - 875) / 25.4, 2);
    const topDepthOffset = roundTo((params.topDepth - 320) / 25.4, 2);
    const tallHeightOffset = roundTo((params.tallHeight - 2200) / 25.4, 2);
    const tallWidthOffset = roundTo((params.tallWidth - 930) / 25.4, 2);
    const kickerOffset = roundTo((params.kicker - 140) / 25.4, 2);

    // Apply scale transformations with rounding
    nodes["3DGeom-16"].scale.z = roundTo(params.bulkHead / 300, 4);
    nodes["3DGeom-6"].scale.z = roundTo(params.bulkHead / 300, 4);

    nodes["3DGeom-21"].scale.y = roundTo(params.topDepth / 320, 4);
    nodes["3DGeom-18"].scale.y = roundTo(params.topDepth / 320, 4);
    nodes["3DGeom-10"].scale.z = roundTo(params.baseHeight / 730, 4);
    nodes["3DGeom-11"].scale.z = roundTo(params.baseHeight / 730, 4);
    nodes["3DGeom-10"].scale.y = roundTo(params.baseOne / 800, 4);
    nodes["3DGeom-13"].scale.x = roundTo(params.baseOne / 800, 4);
    nodes["3DGeom-16"].scale.y = roundTo(params.baseOne / 800, 4);
    nodes["3DGeom-11"].scale.y = roundTo(params.baseTwo / 600, 4);
    nodes["3DGeom-12"].scale.x = roundTo(params.baseTwo / 600, 4);
    nodes["3DGeom-15"].scale.y = roundTo(params.baseTwo / 600, 4);
    nodes["3DGeom-18"].scale.z = roundTo(params.topHeight / 730, 4);
    nodes["3DGeom-21"].scale.z = roundTo(params.topHeight / 730, 4);
    nodes["3DGeom-21"].scale.x = roundTo(params.topOne / 875, 4);
    nodes["3DGeom-16"].scale.x = roundTo(params.topOne / 875, 4);
    nodes["3DGeom-18"].scale.x = roundTo(params.topTwo / 437, 4);
    nodes["3DGeom-6"].scale.x = roundTo(params.topTwo / 437, 4);
    nodes["3DGeom-1"].scale.z = roundTo(params.tallHeight / 2200, 4);
    nodes["3DGeom-1"].scale.x = roundTo(params.tallDepth / 600, 4);
    nodes["3DGeom-2"].scale.x = roundTo(params.tallDepth / 600, 4);
    nodes["3DGeom-3"].scale.z = roundTo(params.tallDepth / 600, 4);
    nodes["3DGeom-8"].scale.x = roundTo(params.tallDepth / 600, 4);
    nodes["3DGeom-9"].scale.z = roundTo(params.tallDepth / 600, 4);
    nodes["3DGeom-1"].scale.y = roundTo((params.tallWidth - 30) / 900, 4);
    nodes["3DGeom-3"].scale.y = roundTo(params.tallWidth / 930, 4);
    nodes["3DGeom-9"].scale.y = roundTo((params.tallWidth - 30) / 900, 4);
    nodes["3DGeom-9"].scale.x = roundTo(params.kicker / 140, 4);
    nodes["3DGeom-15"].scale.z = roundTo(params.kicker / 140, 4);
    //nodes["3DGeom-16"].scale.z = roundTo(params.kicker / 140, 4);

    // Apply position transformations with rounding
    nodes["3DGeom-11"].position.y = roundTo(
      initialData.current["3DGeom-11"].position.y + baseOneOffset,
      2
    );
    nodes["3DGeom-12"].position.x = roundTo(
      initialData.current["3DGeom-12"].position.x + baseOneOffset,
      2
    );
    nodes["3DGeom-14"].position.y = roundTo(
      initialData.current["3DGeom-14"].position.y +
        baseOneOffset +
        baseTwoOffset,
      2
    );
    nodes["3DGeom-15"].position.y = roundTo(
      initialData.current["3DGeom-15"].position.y + baseOneOffset,
      2
    );

    nodes["3DGeom-6"].position.y = roundTo(
      initialData.current["3DGeom-6"].position.y - topDepthOffset,
      2
    );
    nodes["3DGeom-16"].position.y = roundTo(
      initialData.current["3DGeom-16"].position.y - topDepthOffset,
      2
    );
    nodes["3DGeom-6"].position.x = roundTo(
      initialData.current["3DGeom-6"].position.x + topOneOffset,
      2
    );
    nodes["3DGeom-18"].position.x = roundTo(
      initialData.current["3DGeom-18"].position.x + topOneOffset,
      2
    );
    nodes["3DGeom-3"].position.x = roundTo(
      initialData.current["3DGeom-3"].position.x +
        tallHeightOffset +
        kickerOffset,
      2
    );
    nodes["3DGeom-4"].position.y = roundTo(
      initialData.current["3DGeom-4"].position.y +
        tallHeightOffset +
        kickerOffset,
      2
    );
    nodes["3DGeom-5"].position.y = roundTo(
      initialData.current["3DGeom-5"].position.y +
        tallHeightOffset +
        kickerOffset,
      2
    );
    // nodes["3DGeom-6"].position.y = roundTo(
    //   initialData.current["3DGeom-6"].position.y -
    //     tallHeightOffset -
    //     kickerOffset,
    //   2
    // );
    nodes["3DGeom-7"].position.y = roundTo(
      initialData.current["3DGeom-7"].position.y -
        tallHeightOffset -
        kickerOffset,
      2
    );
    nodes["3DGeom-8"].position.y = roundTo(
      initialData.current["3DGeom-8"].position.y - tallWidthOffset,
      2
    );
    nodes["3DGeom-1"].position.z = roundTo(
      initialData.current["3DGeom-1"].position.z - kickerOffset,
      2
    );
    nodes["3DGeom-10"].position.z = roundTo(
      initialData.current["3DGeom-10"].position.z + kickerOffset,
      2
    );
    nodes["3DGeom-11"].position.z = roundTo(
      initialData.current["3DGeom-11"].position.z + kickerOffset,
      2
    );
    nodes["3DGeom-12"].position.y = roundTo(
      initialData.current["3DGeom-12"].position.y +
        baseHeightOffset +
        kickerOffset,
      2
    );
    nodes["3DGeom-13"].position.y = roundTo(
      initialData.current["3DGeom-13"].position.y +
        baseHeightOffset +
        kickerOffset,
      2
    );

    // Assembly adjustments
    if (nodes["Assembly-22"]) {
      nodes["Assembly-22"].scale.y = roundTo(params.allwidth / 2400000, 6);
      nodes["Assembly-22"].children[7].scale.x = roundTo(
        params.baseDepth / 22.85,
        4
      );
      nodes["Assembly-22"].children[4].scale.x = roundTo(
        params.topDepth / 12.59,
        4
      );
    }

    // Combined adjustments
    const combinedScaleZ = roundTo(
      (params.tallHeight + params.kicker) / 2340,
      4
    );
    nodes["3DGeom-2"].scale.z = combinedScaleZ;
    nodes["3DGeom-8"].scale.z = combinedScaleZ;
    nodes["3DGeom-14"].scale.x = roundTo(
      (params.baseHeight + params.kicker) / 870,
      4
    );
  });

  // Secondary useFrame for updating outline meshes
  useFrame(() => {
    if (selectedGroup && outlineMeshes.current.length > 0) {
      outlineMeshes.current.forEach((item) => {
        if (item.outline && item.original) {
          item.outline.position.copy(item.original.position);
          item.outline.rotation.copy(item.original.rotation);
          item.outline.scale.set(
            item.original.scale.x * (1 + params.borderThickness),
            item.original.scale.y * (1 + params.borderThickness),
            item.original.scale.z * (1 + params.borderThickness)
          );
        }
      });
    }
  });

  // Outline mesh creation and cleanup
  useEffect(() => {
    outlineMeshes.current.forEach((item) => {
      if (item.outline && item.outline.parent) {
        item.outline.parent.remove(item.outline);
      }
    });
    outlineMeshes.current = [];

    if (!selectedGroup || !nodeGroups.current[selectedGroup]) return;

    outlineMaterial.color.set(params.borderColor);

    const selectedNodes = nodeGroups.current[selectedGroup].nodes;

    selectedNodes.forEach((nodeName) => {
      if (!nodes[nodeName] || !nodes[nodeName].geometry) return;

      const originalMesh = nodes[nodeName];
      const outlineGeometry = originalMesh.geometry.clone();

      const outlineMesh = new THREE.Mesh(outlineGeometry, outlineMaterial);
      outlineMesh.name = `outline-${nodeName}`;

      outlineMesh.position.copy(originalMesh.position);
      outlineMesh.rotation.copy(originalMesh.rotation);
      outlineMesh.scale.set(
        originalMesh.scale.x * (1 + params.borderThickness),
        originalMesh.scale.y * (1 + params.borderThickness),
        originalMesh.scale.z * (1 + params.borderThickness)
      );

      originalMesh.parent.add(outlineMesh);

      outlineMeshes.current.push({
        outline: outlineMesh,
        original: originalMesh,
        nodeName: nodeName,
      });
    });

    return () => {
      outlineMeshes.current.forEach((item) => {
        if (item.outline && item.outline.parent) {
          item.outline.parent.remove(item.outline);
        }
      });
      outlineMeshes.current = [];
    };
  }, [selectedGroup, params.borderColor, nodes]);

  // Click handler for group selection
  useEffect(() => {
    const handleClick = (event) => {
      if (event.target !== gl.domElement) return;
      event.stopPropagation();

      const canvas = gl.domElement;
      const rect = canvas.getBoundingClientRect();

      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const nodeMeshes = Object.values(nodes).filter((node) => node.isMesh);
      const intersects = raycaster.intersectObjects(nodeMeshes, true);

      if (intersects.length === 0) {
        setSelectedGroup(null);
        return;
      }

      const clickedNode = intersects[0].object;
      const nodeName = Object.keys(nodes).find((key) => {
        const node = nodes[key];
        return (
          node === clickedNode ||
          node.uuid === clickedNode.uuid ||
          (node.isObject3D && node.children.includes(clickedNode))
        );
      });

      if (nodeName) {
        for (const [groupName, groupData] of Object.entries(
          nodeGroups.current
        )) {
          if (groupData.nodes.includes(nodeName)) {
            setSelectedGroup(groupName);
            console.log(nodeName);
            return;
          }
        }
      }

      setSelectedGroup(null);
    };

    const canvas = gl.domElement;
    canvas.addEventListener("click", handleClick);
    return () => canvas.removeEventListener("click", handleClick);
  }, [gl, camera, scene, nodes]);

  return (
    <>
      <primitive object={scene} {...props} />
      {selectedGroup && (
        <Text
          position={[0, 3, 0]}
          fontSize={0.2}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {`Selected: ${nodeGroups.current[selectedGroup]?.label}`}
        </Text>
      )}
    </>
  );
}
