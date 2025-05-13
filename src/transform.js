function transformData(inputData) {
  // Transform nodes to nodesData
  const nodesData = inputData.nodes.map((node) => {
    const controls = {};

    // Handle dimensions
    if (node.dimensions) {
      for (const [dimName, dimValues] of Object.entries(node.dimensions)) {
        const controlName = `${node.name}${
          dimName.charAt(0).toUpperCase() + dimName.slice(1)
        }`;
        controls[controlName] = {
          value: dimValues.value,
          min: dimValues.min,
          max: dimValues.max,
          step: 10,
          label: dimName.charAt(0).toUpperCase() + dimName.slice(1),
        };
      }
    }

    // Handle texture
    if (node.texture) {
      const textureControlName = `${node.name}Texture`;
      controls[textureControlName] = {
        value: node.texture.value,
        options: node.texture.options,
        label: "Texture",
      };
    }

    return {
      name: node.name,
      nodes: node.node,
      label: node.label,
      material: node.material,
      controls: controls,
    };
  });

  const variables = {};
  nodesData.forEach((node) => {
    if (node.controls) {
      Object.entries(node.controls).forEach(([controlName, control]) => {
        // Only include the value (not the entire control object)
        variables[controlName] = control.value;
      });
    }
  });

  // Transform scales
  const scales = inputData.scales.map((scale) => {
    // Get the param name (handle array case)
    let param = Array.isArray(scale.param) ? scale.param[0] : scale.param;

    return {
      node: scale.node,
      axis: scale.axis,
      param: param,
      baseValue: getBaseValueForParam(param, nodesData),
    };
  });

  // Transform positions
  const positions =
    inputData.position?.map((pos) => {
      return {
        node: pos.node,
        axis: pos.axis,
        offsets: pos.offsets.map((offset) => ({
          param: offset,
          baseValue: getBaseValueForParam(offset, nodesData),
        })),
      };
    }) || [];

  return {
    glbUrl: inputData.glbUrl,
    variables: variables,
    nodesData,
    scales,
    positions,
    textures: inputData.textures,
  };
}

// Helper function to get base values for parameters
function getBaseValueForParam(param, nodesData) {
  // First try exact match
  for (const node of nodesData) {
    if (node.controls && node.controls[param]) {
      return node.controls[param].value;
    }
  }

  // Try more flexible matching if exact match fails
  for (const node of nodesData) {
    if (node.controls) {
      for (const [controlName, control] of Object.entries(node.controls)) {
        // Case 1: Check if param matches the end of controlName (e.g., "Width" matches "baseOneWidth")
        if (controlName.endsWith(param)) {
          return control.value;
        }

        // Case 2: Check if controlName without prefix matches param (e.g., "baseOneWidth" → "width")
        const controlNameWithoutPrefix = controlName
          .replace(/^[a-zA-Z]+/, "")
          .toLowerCase();
        if (controlNameWithoutPrefix === param.toLowerCase()) {
          return control.value;
        }

        // Case 3: Check if param matches the dimension name (e.g., "width" in dimensions)
        if (
          control.label &&
          control.label.toLowerCase() === param.toLowerCase()
        ) {
          return control.value;
        }
      }
    }
  }

  console.warn(`Could not find baseValue for parameter: ${param}`);
  return 0; // Default if not found
}

export default transformData;
