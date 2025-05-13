export const dataTest = {
  glbUrl: "/Laundry.glb",
  nodes: [
    {
      name: "baseOne",
      node: ["3DGeom-10"],
      label: "Base One",
      material: "baseOne",
      dimensions: {
        width: { value: 800, max: 1000, min: 500 },
        height: { value: 730, max: 1000, min: 500 },
        depth: { value: 580, max: 800, min: 400 },
      },
      texture: {
        value: "Texture 1",
        options: [
          "Texture 1",
          "Texture 2",
          "Texture 3",
          "Texture 4",
          "Texture 5",
        ],
      },
    },
  ],
  scales: [
    { node: "3DGeom-10", axis: "y", param: ["baseOneDepth"] },
    { node: "3DGeom-11", axis: "y", param: ["baseOneDepth"] },
    { node: "3DGeom-12", axis: "y", param: ["baseOneDepth"] },
    { node: "3DGeom-13", axis: "y", param: ["baseOneDepth"] },
    { node: "3DGeom-14", axis: "y", param: ["baseOneDepth"] },
    { node: "3DGeom-15", axis: "y", param: ["baseOneDepth"] },
    { node: "3DGeom-16", axis: "y", param: ["baseOneDepth"] },
    { node: "3DGeom-10", axis: "z", param: ["baseOneHeight"] },
    { node: "3DGeom-11", axis: "z", param: ["baseOneHeight"] },
    { node: "3DGeom-10", axis: "x", param: ["baseOneWidth"] },
    { node: "3DGeom-13", axis: "x", param: ["baseOneWidth"] },
    { node: "3DGeom-16", axis: "x", param: ["baseOneWidth"] },
  ],
  position: [
    {
      node: "3DGeom-11",
      axis: "x",
      offsets: ["baseOneWidth", "tallWidth"],
    },
  ],
  textures: [
    "/textures/material1.jpg",
    "/textures/material2.jpg",
    "/textures/material3.jpg",
    "/textures/material4.jpg",
    "/textures/material5.jpeg",
  ],
};
