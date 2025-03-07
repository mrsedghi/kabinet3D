import * as THREE from "three";
import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useControls, folder } from "leva";

export default function Model(props) {
  const { scene, nodes } = useGLTF("/kabinet.glb");

  // Define target total scale and initial percentages
  const targetTotalScale = 5; // Total scale for all objects
  const initialPercentages = [0.35, 0.35, 0.1, 0.1, 0.1]; // 35% for Kabinet_1 and Kabinet_2, 10% for others

  // Calculate initial scales based on percentages
  const initialScales = initialPercentages.map(
    (percent) => percent * targetTotalScale
  );

  // Define initial positions for each object
  const initialPositions = [4, 6, 8, 10, 12]; // Initial X positions for each object

  // Define color and scale controls for each object in a folder
  const controls = useControls("Kabinets", {
    Kabinet_1: folder({
      color4: { r: 248, g: 214, b: 40 },
      scaleX4: { value: initialScales[0], min: 0.1, max: 2, step: 0.1 }, // Initial scale for object 4
    }),
    Kabinet_2: folder({
      color5: { r: 255, g: 0, b: 0 },
      scaleX5: { value: initialScales[1], min: 0.1, max: 2, step: 0.1 }, // Initial scale for object 5
    }),
    Kabinet_3: folder({
      color6: { r: 0, g: 255, b: 0 },
      scaleX6: { value: initialScales[2], min: 0.1, max: 2, step: 0.1 }, // Initial scale for object 6
    }),
    Kabinet_4: folder({
      color7: { r: 0, g: 0, b: 255 },
      scaleX7: { value: initialScales[3], min: 0.1, max: 2, step: 0.1 }, // Initial scale for object 7
    }),
    Kabinet_5: folder({
      color8: { r: 128, g: 128, b: 128 },
      scaleX8: { value: initialScales[4], min: 0.1, max: 2, step: 0.1 }, // Initial scale for object 8
    }),
  });

  // Convert RGB colors to THREE.Color and update materials, scales, and positions

  useMemo(() => {
    const objectIndices = [4, 5, 6, 7, 8]; // Indices of the objects to update

    // Calculate the total scale factor
    const totalScale = objectIndices.reduce((sum, index) => {
      const scaleKey = `scaleX${index}`;
      return sum + controls[scaleKey];
    }, 0);

    // Normalize scales to ensure they sum up to the target total scale
    let lastItemEnd = initialPositions[0];
    objectIndices.forEach((index, i) => {
      const colorKey = `color${index}`; // e.g., "color4", "color5", etc.
      const scaleKey = `scaleX${index}`; // e.g., "scaleX4", "scaleX5", etc.

      // Update material color
      const color = new THREE.Color(
        controls[colorKey].r / 255,
        controls[colorKey].g / 255,
        controls[colorKey].b / 255
      );
      const material = nodes.Scene.children[index].material.clone();
      material.color = color;
      nodes.Scene.children[index].material = material;

      // Update object scale
      const normalizedScale =
        (controls[scaleKey] / totalScale) * targetTotalScale;

      // Update object position
      const objectWidth = 3.119999885559082 * normalizedScale; // Assume object width is proportional to scale
      nodes.Scene.children[index].position.x = lastItemEnd;
      nodes.Scene.children[index].scale.x = normalizedScale; // initialPositions[i] + (normalizedScale - initialScales[i]) / 2;
      lastItemEnd += objectWidth;
    });
  }, [controls, nodes]);

  return <primitive object={scene} {...props} />;
}
