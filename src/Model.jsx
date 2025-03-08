import * as THREE from "three";
import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useControls, folder } from "leva";

export default function Model(props) {
  const { scene, nodes } = useGLTF("/kabinet.glb");

  // Define target total scale and initial percentages
  const initialPercentages = [0.35, 0.35, 0.1, 0.1, 0.1]; // 35% for Kabinet_1 and Kabinet_2, 10% for others

  // Define initial positions for each object
  const initialPositions = [4, 6, 8, 10, 12]; // Initial X positions for each object

  // Define controls for allKabinetScale and individual object properties
  const { allKabinetScale, ...controls } = useControls({
    allKabinetScale: { value: 5, min: 1, max: 5, step: 0.1 }, // Control for total scale
    Kabinets: folder({
      Kabinet_1: folder({
        color4: { r: 248, g: 214, b: 40 },
        scaleX4: {
          value: initialPercentages[0] * 5,
          min: 0.1,
          max: 2,
          step: 0.1,
        }, // Initial scale for object 4
        "position fixed 4": false,
        "scale fixed 4": false,
      }),
      Kabinet_2: folder({
        color5: { r: 255, g: 0, b: 0 },
        scaleX5: {
          value: initialPercentages[1] * 5,
          min: 0.1,
          max: 3,
          step: 0.1,
        }, // Initial scale for object 5
        "position fixed 5": false,
        "scale fixed 5": false,
      }),
      Kabinet_3: folder({
        color6: { r: 0, g: 255, b: 0 },
        scaleX6: {
          value: initialPercentages[2] * 5,
          min: 0.1,
          max: 1,
          step: 0.1,
        }, // Initial scale for object 6
        "position fixed 6": false,
        "scale fixed 6": false,
      }),
      Kabinet_4: folder({
        color7: { r: 0, g: 0, b: 255 },
        scaleX7: {
          value: initialPercentages[3] * 5,
          min: 0.1,
          max: 4,
          step: 0.1,
        }, // Initial scale for object 7
        "position fixed 7": false,
        "scale fixed 7": false,
      }),
      Kabinet_5: folder({
        color8: { r: 128, g: 128, b: 128 },
        scaleX8: {
          value: initialPercentages[4] * 5,
          min: 0.1,
          max: 2,
          step: 0.1,
        }, // Initial scale for object 8
        "position fixed 8": false,
        "scale fixed 8": false,
      }),
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
    let lastItemEnd = initialPositions[0]; // Track the end position of the last object

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
      // const normalizedScale =
      //   (controls[scaleKey] / totalScale) * allKabinetScale;

      // // Update object position
      // const objectWidth = 3.15 * normalizedScale; // Assume object width is proportional to scale
      // nodes.Scene.children[index].position.x = lastItemEnd;
      // nodes.Scene.children[index].scale.x = normalizedScale;
      // lastItemEnd += objectWidth; // Update the end position for the next object

      //
    });

    // scales

    const calculateScaleSums = (start, end) => {
      let scaleSum = 0;
      let fixScaleSum = 0;

      for (let j = start; j < end; j++) {
        if (controls[`scale fixed ${j}`]) {
          fixScaleSum += nodes.Scene.children[j].scale.x;
        } else {
          scaleSum += controls[`scaleX${j}`];
        }
      }

      return { scaleSum, fixScaleSum };
    };

    const processObjects = (start, end, scaleSum, fixScaleSum, maxScale) => {
      for (let j = start; j < end; j++) {
        if (controls[`scale fixed ${j}`]) {
          const objectWidth = nodes.Scene.children[j].scale.x * 3.15;
          nodes.Scene.children[j].position.x = lastItemEnd;
          lastItemEnd += objectWidth;
        } else {
          const normalizedScale =
            (controls[`scaleX${j}`] / scaleSum) * (maxScale - fixScaleSum);
          const objectWidth = 3.15 * normalizedScale;

          nodes.Scene.children[j].position.x = lastItemEnd;
          nodes.Scene.children[j].scale.x = normalizedScale;
          lastItemEnd += objectWidth;
        }
      }
    };

    let startIndex = objectIndices[0];
    lastItemEnd = initialPositions[0];

    for (
      let i = startIndex;
      i <= objectIndices[objectIndices.length - 1];
      i++
    ) {
      if (controls[`position fixed ${i}`]) {
        const maxScale =
          (nodes.Scene.children[i].position.x - lastItemEnd) / 3.15;
        const { scaleSum, fixScaleSum } = calculateScaleSums(startIndex, i);

        processObjects(startIndex, i, scaleSum, fixScaleSum, maxScale);
        startIndex = i;
      }
    }
    const endPoint = initialPositions[0] + allKabinetScale * 3.15;
    const maxScale = (endPoint - lastItemEnd) / 3.15;
    const { scaleSum, fixScaleSum } = calculateScaleSums(
      startIndex,
      objectIndices[objectIndices.length - 1] + 1
    );

    processObjects(
      startIndex,
      objectIndices[objectIndices.length - 1] + 1,
      scaleSum,
      fixScaleSum,
      maxScale
    );
  }, [controls, nodes, allKabinetScale]);

  return <primitive object={scene} {...props} />;
}
