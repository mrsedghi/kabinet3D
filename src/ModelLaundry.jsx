import { useGLTF, Text, useTexture } from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { data } from "./data";

export default function ModelLaundry(props) {
  const { scene, nodes, materials } = useGLTF(data.glbUrl);
  const { gl, camera } = useThree();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const textureConfigs = data.textureConfig;
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

  const [params, setParams] = useState(data.varibles);

  // Define node groups with controls as an array
  const nodeGroups = useRef(data.nodesData);

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

  function useTextures(texturePaths) {
    return texturePaths.map((path) => useTexture(path));
  }
  const texturePaths = data.textures;
  const textures = useTextures(texturePaths);
  const textureMap = textures.reduce((acc, texture, index) => {
    acc[`Texture ${index + 1}`] = texture;
    return acc;
  }, {});

  // Update material textures with dynamic scaling
  useEffect(() => {
    const calculateDynamicRepeat = (
      nodeName,
      baseWidth,
      maxWidth,
      baseHeight,
      maxHeight
    ) => {
      if (!nodes[nodeName]) return { x: 0.5, y: 0.5 };

      return {
        x: (nodes[nodeName].scale["x"] * baseWidth) / maxWidth,
        y: (nodes[nodeName].scale["z"] * baseHeight) / maxHeight,
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

    nodeGroups.current.forEach((groupData) => {
      if (groupData.material && materials[groupData.material]) {
        // Find matching config or use default
        const matchedConfig = textureConfigs.find((config) =>
          groupData.name.includes(config.pattern)
        );

        // Calculate repeat values if not using default
        const repeat = matchedConfig.nodeName
          ? calculateDynamicRepeat(
              matchedConfig.nodeName,
              matchedConfig.baseWidth,
              matchedConfig.maxWidth,
              matchedConfig.baseHeight,
              matchedConfig.maxHeight
            )
          : { x: matchedConfig.repeatX, y: matchedConfig.repeatY };

        const selectedTexture = textureMap[params[matchedConfig.textureParam]];
        updateMaterialTexture(
          materials[groupData.material],
          selectedTexture,
          repeat.x,
          repeat.y
        );
      }
    });
  }, [materials, textureMap, nodes, textureConfigs, params]);

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
      const group = nodeGroups.current.find((g) => g.name === selectedGroup);
      if (!group) return {};

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

  // Transformation helpers
  const roundTo = (value, precision = 0) => {
    const multiplier = 10 ** precision;
    return Math.round(value * multiplier) / multiplier;
  };

  // Main transformation logic
  useFrame(() => {
    if (!nodes || !initialData.current) return;

    // Reset if needed after tab inactivity
    if (positionStabilizer.current.needsReset) {
      Object.keys(nodes).forEach((key) => {
        const node = nodes[key];
        const initial = initialData.current[key];
        if (node && initial?.position) node.position.copy(initial.position);
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

    // Apply scale transformations
    const applyScale = (nodeName, axis, value, baseValue) => {
      if (nodes[nodeName]) {
        nodes[nodeName].scale[axis] = roundTo(value / baseValue, 4);
      }
    };

    data.nodesData.forEach((node) => {
      if (node.scales) {
        node.scales.forEach(
          ({ node: nodeName, axis, param, value, baseValue }) => {
            const scaleValue = value
              ? typeof value === "function"
                ? value(params)
                : value
              : params[param];
            applyScale(nodeName, axis, scaleValue, baseValue);
          }
        );
      }
    });

    // Position transformations
    const applyPosition = (nodeName, axis, offset) => {
      if (nodes[nodeName] && initialData.current[nodeName]?.position) {
        nodes[nodeName].position[axis] = roundTo(
          initialData.current[nodeName].position[axis] + offset,
          2
        );
      }
    };

    // Apply position transformations
    data.nodesData.forEach((node) => {
      if (node.positions) {
        node.positions.forEach(({ node, axis, offsets }) => {
          const totalOffset = offsets.reduce((sum, { param, baseValue }) => {
            return sum + roundTo((params[param] - baseValue) / 25.4, 2);
          }, 0);

          applyPosition(node, axis, totalOffset);
        });
      }
    });
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

    if (!selectedGroup) return;

    outlineMaterial.color.set(params.borderColor);

    const group = nodeGroups.current.find((g) => g.name === selectedGroup);
    if (!group) return;

    group.nodes.forEach((nodeName) => {
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
  }, [
    selectedGroup,
    params.borderColor,
    nodes,
    params.borderThickness,
    outlineMaterial,
  ]);

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
        for (const group of nodeGroups.current) {
          if (group.nodes.includes(nodeName)) {
            setSelectedGroup(group.name);
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
          {`Selected: ${
            nodeGroups.current.find((g) => g.name === selectedGroup)?.label
          }`}
        </Text>
      )}
    </>
  );
}
