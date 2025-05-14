/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  FiBox,
  FiMaximize2,
  FiMinimize2,
  FiType,
  FiCheck,
  FiX,
  FiSliders,
} from "react-icons/fi";
import { FaArrowsAltH, FaArrowsAltV, FaCube } from "react-icons/fa";
import { CiRuler } from "react-icons/ci";
import { MultiSelect } from "react-multi-select-component";

export default function NodeSidebar({ isOpen, onClose, selectedNode }) {
  const [nodeConfigs, setNodeConfigs] = useState([]);
  const [activeDimensionTab, setActiveDimensionTab] = useState("width");

  const getCurrentConfig = () => {
    if (!selectedNode?.name)
      return {
        name: "",
        product: "baseOne",
        visible: true,
        dimensions: {
          width: {
            value: 0,
            max: 0,
            min: 0,
            label: "",
            dimensionOption: "fixed",
            offsetOptions: [],
            ratioOptions: [],
          },
          height: {
            value: 0,
            max: 0,
            min: 0,
            label: "",
            dimensionOption: "fixed",
            offsetOptions: [],
            ratioOptions: [],
          },
          depth: {
            value: 0,
            max: 0,
            min: 0,
            label: "",
            dimensionOption: "fixed",
            offsetOptions: [],
            ratioOptions: [],
          },
        },
      };

    const existingConfig = nodeConfigs.find(
      (config) => config.name === selectedNode.name
    );
    return (
      existingConfig || {
        name: selectedNode.name,
        product: "baseOne",
        visible: true,
        dimensions: {
          width: {
            value: 0,
            max: 0,
            min: 0,
            label: "",
            dimensionOption: "fixed",
            offsetOptions: [],
            ratioOptions: [],
          },
          height: {
            value: 0,
            max: 0,
            min: 0,
            label: "",
            dimensionOption: "fixed",
            offsetOptions: [],
            ratioOptions: [],
          },
          depth: {
            value: 0,
            max: 0,
            min: 0,
            label: "",
            dimensionOption: "fixed",
            offsetOptions: [],
            ratioOptions: [],
          },
        },
      }
    );
  };

  const updateConfig = (updatedConfig) => {
    setNodeConfigs((prev) => {
      const existingIndex = prev.findIndex(
        (config) => config.name === updatedConfig.name
      );

      if (existingIndex >= 0) {
        const newConfigs = [...prev];
        newConfigs[existingIndex] = updatedConfig;
        return newConfigs;
      } else {
        return [...prev, updatedConfig];
      }
    });
  };

  const handleProductChange = (e) => {
    if (!selectedNode?.name) return;
    updateConfig({
      ...getCurrentConfig(),
      product: e.target.value,
    });
  };

  const handleVisibilityChange = (e) => {
    if (!selectedNode?.name) return;
    updateConfig({
      ...getCurrentConfig(),
      visible: e.target.checked,
    });
  };

  const handleDimensionChange = (dimension, field, value) => {
    if (!selectedNode?.name) return;
    updateConfig({
      ...getCurrentConfig(),
      dimensions: {
        ...getCurrentConfig().dimensions,
        [dimension]: {
          ...getCurrentConfig().dimensions[dimension],
          [field]: typeof value === "number" ? value : value,
        },
      },
    });
  };

  const handleMultiSelectChange = (dimension, field, selected) => {
    if (!selectedNode?.name) return;
    updateConfig({
      ...getCurrentConfig(),
      dimensions: {
        ...getCurrentConfig().dimensions,
        [dimension]: {
          ...getCurrentConfig().dimensions[dimension],
          [field]: selected.map((item) => item.value),
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

  const dimensionOptions = [
    { value: "lenght", label: "lenght" },
    { value: "width", label: "width" },
    { value: "depth", label: "depth" },
  ];

  const offsetOptions = [
    { value: "baseOne", label: "Base One" },
    { value: "baseTwo", label: "Base Two" },
    { value: "topOne", label: "Top One" },
    { value: "topTwo", label: "Top Two" },
    { value: "tall", label: "Tall" },
    { value: "kicker", label: "Kicker" },
    { value: "bulhead", label: "Bulhead" },
  ];

  const ratioOptions = [
    { value: "baseOne", label: "Base One" },
    { value: "baseTwo", label: "Base Two" },
    { value: "topOne", label: "Top One" },
    { value: "topTwo", label: "Top Two" },
    { value: "tall", label: "Tall" },
    { value: "kicker", label: "Kicker" },
    { value: "bulhead", label: "Bulhead" },
  ];

  const dimensionIcons = {
    width: <FaArrowsAltH className="mr-2" />,
    height: <FaArrowsAltV className="mr-2" />,
    depth: <FaCube className="mr-2" />,
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-96 bg-base-100 shadow-xl transition-transform duration-300 ease-in-out z-50
      ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="h-full flex flex-col">
        {/* Sidebar Header */}
        <div className="flex justify-between items-center p-4 border-b border-base-300 bg-base-200">
          <h3 className="text-lg font-bold flex items-center">
            <FiSliders className="mr-2" />
            Node Configuration
          </h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {selectedNode ? (
            <>
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center">
                    <FiBox className="mr-2" />
                    Node Name
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={selectedNode.name}
                  readOnly
                />
              </div>

              {/* Visibility Toggle */}
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text flex items-center">
                    <FiCheck className="mr-2" />
                    Visible
                  </span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={getCurrentConfig().visible}
                    onChange={handleVisibilityChange}
                  />
                </label>
              </div>

              {/* Product Selection */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center">
                    <FiBox className="mr-2" />
                    Product
                  </span>
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

              {/* Dimensions Tabs */}
              <div className="tabs tabs-boxed bg-base-200 p-1 rounded-box">
                {["width", "height", "depth"].map((dimension) => (
                  <button
                    key={dimension}
                    className={`tab flex-1 capitalize flex items-center ${
                      activeDimensionTab === dimension
                        ? "tab-active bg-base-100 shadow"
                        : ""
                    }`}
                    onClick={() => setActiveDimensionTab(dimension)}
                  >
                    {dimensionIcons[dimension]}
                    {dimension}
                  </button>
                ))}
              </div>

              {/* Active Dimension Content */}
              <div className="space-y-4">
                {["width", "height", "depth"].map((dimension) => (
                  <div
                    key={dimension}
                    className={`space-y-4 ${
                      activeDimensionTab === dimension ? "block" : "hidden"
                    }`}
                  >
                    {/* Dimension Option Select */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text flex items-center">
                          <CiRuler className="mr-2" />
                          Dimension Type
                        </span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={
                          getCurrentConfig().dimensions[dimension]
                            .dimensionOption
                        }
                        onChange={(e) =>
                          handleDimensionChange(
                            dimension,
                            "dimensionOption",
                            e.target.value
                          )
                        }
                      >
                        {dimensionOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Label Input */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text flex items-center">
                          <FiType className="mr-2" />
                          Label
                        </span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        value={getCurrentConfig().dimensions[dimension].label}
                        onChange={(e) =>
                          handleDimensionChange(
                            dimension,
                            "label",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* Value, Max, Min Inputs */}
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
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text flex items-center">
                            <FiMaximize2 className="mr-1" /> Max
                          </span>
                        </label>
                        <input
                          type="number"
                          className="input input-bordered w-full"
                          value={getCurrentConfig().dimensions[dimension].max}
                          onChange={(e) =>
                            handleDimensionChange(
                              dimension,
                              "max",
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text flex items-center">
                            <FiMinimize2 className="mr-1" /> Min
                          </span>
                        </label>
                        <input
                          type="number"
                          className="input input-bordered w-full"
                          value={getCurrentConfig().dimensions[dimension].min}
                          onChange={(e) =>
                            handleDimensionChange(
                              dimension,
                              "min",
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                    </div>

                    {/* Offset Multi-Select */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text flex items-center">
                          <CiRuler className="mr-2" />
                          Offset Options
                        </span>
                      </label>
                      <MultiSelect
                        options={offsetOptions}
                        value={offsetOptions.filter((option) =>
                          getCurrentConfig().dimensions[
                            dimension
                          ].offsetOptions.includes(option.value)
                        )}
                        onChange={(selected) =>
                          handleMultiSelectChange(
                            dimension,
                            "offsetOptions",
                            selected
                          )
                        }
                        labelledBy="Select Offset Options"
                        className="!bg-base-100 !border !border-base-300 !rounded-btn"
                        overrideStrings={{
                          selectSomeItems: "Select offsets...",
                          allItemsAreSelected: "All offsets selected",
                          selectAll: "Select all",
                          search: "Search offsets",
                        }}
                      />
                    </div>

                    {/* Ratio Multi-Select */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text flex items-center">
                          <CiRuler className="mr-2" />
                          Ratio Options
                        </span>
                      </label>
                      <MultiSelect
                        options={ratioOptions}
                        value={ratioOptions.filter((option) =>
                          getCurrentConfig().dimensions[
                            dimension
                          ].ratioOptions.includes(option.value)
                        )}
                        onChange={(selected) =>
                          handleMultiSelectChange(
                            dimension,
                            "ratioOptions",
                            selected
                          )
                        }
                        labelledBy="Select Ratio Options"
                        className="bg-base-100 border border-base-300 rounded-btn"
                        overrideStrings={{
                          selectSomeItems: "Select ratios...",
                          allItemsAreSelected: "All ratios selected",
                          selectAll: "Select all",
                          search: "Search ratios",
                        }}
                      />
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
        <div className="p-4 border-t border-base-300 bg-base-200 flex justify-end gap-5">
          <button className="btn btn-primary">Apply</button>
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
