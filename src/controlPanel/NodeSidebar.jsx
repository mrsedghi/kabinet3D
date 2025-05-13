/* eslint-disable react/prop-types */
import { useState } from "react";

export default function NodeSidebar({ isOpen, onClose, selectedNode }) {
  // Store configurations as an array of objects
  const [nodeConfigs, setNodeConfigs] = useState([]);
  console.log(nodeConfigs);
  // Get current node's config or return defaults
  const getCurrentConfig = () => {
    if (!selectedNode?.name)
      return {
        name: "",
        product: "baseOne",
        dimensions: {
          width: { value: 0, max: 0, min: 0 },
          height: { value: 0, max: 0, min: 0 },
          depth: { value: 0, max: 0, min: 0 },
        },
      };

    const existingConfig = nodeConfigs.find(
      (config) => config.name === selectedNode.name
    );
    return (
      existingConfig || {
        name: selectedNode.name,
        product: "baseOne",
        dimensions: {
          width: { value: 0, max: 0, min: 0 },
          height: { value: 0, max: 0, min: 0 },
          depth: { value: 0, max: 0, min: 0 },
        },
      }
    );
  };

  // Update configuration in the array
  const updateConfig = (updatedConfig) => {
    setNodeConfigs((prev) => {
      const existingIndex = prev.findIndex(
        (config) => config.name === updatedConfig.name
      );

      if (existingIndex >= 0) {
        // Update existing config
        const newConfigs = [...prev];
        newConfigs[existingIndex] = updatedConfig;
        return newConfigs;
      } else {
        // Add new config
        return [...prev, updatedConfig];
      }
    });
  };

  // Handle product selection change
  const handleProductChange = (e) => {
    if (!selectedNode?.name) return;

    updateConfig({
      ...getCurrentConfig(),
      product: e.target.value,
    });
  };

  // Handle dimension value changes
  const handleDimensionChange = (dimension, field, value) => {
    if (!selectedNode?.name) return;

    updateConfig({
      ...getCurrentConfig(),
      dimensions: {
        ...getCurrentConfig().dimensions,
        [dimension]: {
          ...getCurrentConfig().dimensions[dimension],
          [field]: parseFloat(value) || 0,
        },
      },
    });
  };

  const productOptions = [
    { value: "baseOne", label: "Base One" },
    { value: "baseTwo", label: "Base Two" },
    { value: "topOne", label: "Top One" },
    { value: "topTwo", label: "Top Two" },
    { value: "tall", label: "Tall" },
    { value: "kicker", label: "Kicker" },
    { value: "bulhead", label: "Bulhead" },
  ];

  return (
    <div
      className={`fixed inset-y-0 right-0 w-80 bg-base-200 shadow-xl transition-transform duration-300 ease-in-out z-50
      ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="h-full flex flex-col">
        {/* Sidebar Header */}
        <div className="flex justify-between items-center p-4 border-b border-base-300">
          <h3 className="text-lg font-bold">Node Configuration</h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {selectedNode ? (
            <>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Node Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={selectedNode.name}
                  readOnly
                />
              </div>

              {/* Product Selection */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Product</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={getCurrentConfig().product}
                  onChange={handleProductChange}
                >
                  {productOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dimensions */}
              <div className="space-y-4">
                <h4 className="font-bold">Dimensions</h4>
                {["width", "height", "depth"].map((dimension) => (
                  <div key={dimension} className="space-y-2">
                    <label className="label">
                      <span className="label-text capitalize">{dimension}</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Value</span>
                        </label>
                        <input
                          type="number"
                          className="input input-bordered w-full"
                          value={getCurrentConfig().dimensions[dimension].value}
                          onChange={(e) =>
                            handleDimensionChange(
                              dimension,
                              "value",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Max</span>
                        </label>
                        <input
                          type="number"
                          className="input input-bordered w-full"
                          value={getCurrentConfig().dimensions[dimension].max}
                          onChange={(e) =>
                            handleDimensionChange(
                              dimension,
                              "max",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Min</span>
                        </label>
                        <input
                          type="number"
                          className="input input-bordered w-full"
                          value={getCurrentConfig().dimensions[dimension].min}
                          onChange={(e) =>
                            handleDimensionChange(
                              dimension,
                              "min",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p>No node selected</p>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-base-300 flex justify-end gap-5">
          <button className="btn btn-primary btn-soft">Apply</button>
          <button className="btn btn-soft btn-error" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
