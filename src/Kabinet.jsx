/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  OrbitControls,
  RandomizedLight,
} from "@react-three/drei";
import ModelLaundry from "./ModelLaundry";
import { useState, useEffect } from "react";
import * as THREE from "three";
import { data } from "./data";
import {
  FiChevronDown,
  FiChevronUp,
  FiSettings,
  FiBox,
  FiLayers,
  FiDroplet,
  FiInfo,
} from "react-icons/fi";
import { MdOutlineWidthFull, MdOutlineHeight, MdTexture } from "react-icons/md";
import { LuRuler } from "react-icons/lu";
import { GoPackageDependencies } from "react-icons/go";

// Texture carousel component
const TextureCarousel = ({ textures, selected, onSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-2 mt-2">
      {textures.map((texture, index) => (
        <div
          key={index}
          className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
            selected === texture ? "border-primary" : "border-transparent"
          }`}
          onClick={() => onSelect(texture)}
        >
          <img
            src={data.textures[index]}
            alt={texture}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/texture-fallback.jpg"; // Add a fallback image
            }}
          />
          {selected === texture && (
            <div className="absolute inset-0 bg-primary/20 pointer-events-none" />
          )}
        </div>
      ))}
    </div>
  );
};

function CollapsibleControlGroup({ title, isOpen, onToggle, children, icon }) {
  return (
    <div className="mb-3 border border-base-300 rounded-lg shadow-sm bg-base-100">
      <button
        className="w-full flex items-center justify-between p-3 hover:bg-base-200 rounded-lg transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">{icon}</span>
          <span className="font-medium">{title}</span>
        </div>
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      {isOpen && (
        <div className="p-3 pt-1 border-t border-base-300">{children}</div>
      )}
    </div>
  );
}

function ControlPanel({ selectedGroup, params, setParams, nodeGroups }) {
  const [isOpen, setIsOpen] = useState(true);
  const [openSections, setOpenSections] = useState({
    global: true,
    selected: true,
  });
  const [activeTab, setActiveTab] = useState("dimensions");

  // Find the currently selected group
  const group = nodeGroups.find((g) => g.name === selectedGroup);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Improved grouping logic
  const getGroupedControls = (controls) => {
    const dimensions = {};
    const materials = {};

    if (!controls) return { dimensions, materials };

    Object.entries(controls).forEach(([key, config]) => {
      // Group dimension-related controls
      if (
        key.toLowerCase().includes("width") ||
        key.toLowerCase().includes("height") ||
        key.toLowerCase().includes("depth") ||
        key.toLowerCase().includes("size") ||
        key === "baseOne" ||
        key === "baseTwo" ||
        key === "topOne" ||
        key === "topTwo" ||
        key === "tallWidth" ||
        key === "tallHeight" ||
        key === "tallDepth" ||
        key === "bulkHead" ||
        key === "kicker"
      ) {
        dimensions[key] = config;
      }
      // Group material-related controls
      else if (
        key.toLowerCase().includes("texture") ||
        key.toLowerCase().includes("material") ||
        key === "baseOneTexture" ||
        key === "baseTwoTexture" ||
        key === "topOneTexture" ||
        key === "topTwoTexture" ||
        key === "tallTexture"
      ) {
        materials[key] = config;
      }
    });

    return { dimensions, materials };
  };

  const getIconForControl = (key) => {
    if (
      key.toLowerCase().includes("width") ||
      key === "baseOne" ||
      key === "baseTwo" ||
      key === "topOne" ||
      key === "topTwo" ||
      key === "tallWidth"
    ) {
      return <MdOutlineWidthFull />;
    }
    if (
      key.toLowerCase().includes("height") ||
      key === "tallHeight" ||
      key === "bulkHead" ||
      key === "kicker"
    ) {
      return <MdOutlineHeight />;
    }
    if (
      key.toLowerCase().includes("depth") ||
      key === "baseDepth" ||
      key === "topDepth" ||
      key === "tallDepth"
    ) {
      return <GoPackageDependencies />;
    }
    if (
      key.toLowerCase().includes("texture") ||
      key.toLowerCase().includes("material")
    ) {
      return <MdTexture />;
    }
    return <FiSettings />;
  };

  // Render a single control
  const renderControl = (key, config) => {
    const icon = getIconForControl(key);

    // If this is a texture/material control with options, render the carousel
    if (
      config.options &&
      (key.toLowerCase().includes("texture") ||
        key.toLowerCase().includes("material"))
    ) {
      return (
        <div key={key} className="form-control mb-3">
          <label className="label">
            <div className="flex items-center space-x-2">
              {icon}
              <span className="label-text">{config.label || key}</span>
            </div>
          </label>
          <TextureCarousel
            textures={config.options}
            selected={params[key]}
            onSelect={(value) => setParams({ ...params, [key]: value })}
          />
        </div>
      );
    }

    // Regular range/select control
    return (
      <div key={key} className="form-control mb-3">
        <label className="label">
          <div className="flex items-center space-x-2">
            {icon}
            <span className="label-text">{config.label || key}</span>
          </div>
        </label>

        {/* Select for options */}
        {config.options ? (
          <select
            className="select select-bordered w-full"
            value={params[key]}
            onChange={(e) => setParams({ ...params, [key]: e.target.value })}
          >
            {config.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          /* Range input for numeric values */
          <>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min={config.min}
                max={config.max}
                step={config.step}
                className="range range-primary flex-grow"
                value={params[key]}
                onChange={(e) =>
                  setParams({ ...params, [key]: parseFloat(e.target.value) })
                }
              />
              <span className="w-14 text-right text-sm">
                {params[key]}
                {config.unit || "mm"}
              </span>
            </div>
            <div className="flex justify-between text-xs px-2 mt-1 text-base-content/60">
              <span>{config.min}</span>
              <span>{config.max}</span>
            </div>
          </>
        )}
      </div>
    );
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    if (!group?.controls) return null;

    const { dimensions, materials } = getGroupedControls(group.controls);

    switch (activeTab) {
      case "dimensions":
        return (
          <div className="space-y-4">
            {Object.keys(dimensions).length > 0 ? (
              Object.entries(dimensions).map(([key, config]) =>
                renderControl(key, config)
              )
            ) : (
              <div className="text-center py-4 text-base-content/60">
                No dimension controls available
              </div>
            )}
          </div>
        );

      case "materials":
        return (
          <div className="space-y-4">
            {Object.keys(materials).length > 0 ? (
              Object.entries(materials).map(([key, config]) =>
                renderControl(key, config)
              )
            ) : (
              <div className="text-center py-4 text-base-content/60">
                No material controls available
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed bottom-4 right-4 z-50 btn btn-primary btn-circle shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiSettings className="text-xl" />
      </button>

      {/* Sidebar panel */}
      <div
        className={`
        fixed top-0 right-0 h-full z-40 bg-base-100 shadow-xl overflow-y-auto transition-all duration-300
        ${isOpen ? "w-80" : "w-0"} 
        lg:left-0 lg:w-80 lg:transform-none
      `}
      >
        {isOpen && (
          <div className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FiBox /> Cabinet Configurator
              </h2>
              <button
                className="lg:hidden btn btn-sm btn-ghost"
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Global Controls */}
              <CollapsibleControlGroup
                title="Global Settings"
                isOpen={openSections.global}
                onToggle={() => toggleSection("global")}
                icon={<FiSettings />}
              >
                <div className="form-control">
                  <label className="label">
                    <div className="flex items-center space-x-2">
                      <LuRuler />

                      <span className="label-text">Overall Width</span>
                    </div>
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="1500"
                      max="4000"
                      step="100"
                      className="range range-primary flex-grow"
                      value={params.allwidth}
                      onChange={(e) =>
                        setParams({
                          ...params,
                          allwidth: parseInt(e.target.value),
                        })
                      }
                    />
                    <span className="w-14 text-right text-sm">
                      {params.allwidth}mm
                    </span>
                  </div>
                  <div className="flex justify-between text-xs px-2 mt-1 text-base-content/60">
                    <span>1500</span>
                    <span>4000</span>
                  </div>
                </div>
              </CollapsibleControlGroup>

              {/* Selected Group Controls */}
              {selectedGroup && group && (
                <CollapsibleControlGroup
                  title={group.label || selectedGroup}
                  isOpen={openSections.selected}
                  onToggle={() => toggleSection("selected")}
                  icon={<FiLayers />}
                >
                  {group.controls && Object.keys(group.controls).length > 0 && (
                    <>
                      {/* Tabs */}
                      <div className="tabs tabs-boxed bg-base-200 mb-4">
                        <button
                          className={`tab flex-1 ${
                            activeTab === "dimensions" ? "tab-active" : ""
                          }`}
                          onClick={() => setActiveTab("dimensions")}
                        >
                          <LuRuler className="mr-1" /> Dimensions
                        </button>
                        <button
                          className={`tab flex-1 ${
                            activeTab === "materials" ? "tab-active" : ""
                          }`}
                          onClick={() => setActiveTab("materials")}
                        >
                          <FiDroplet className="mr-1" /> Materials
                        </button>
                      </div>

                      {/* Tab content */}
                      {renderTabContent()}
                    </>
                  )}
                </CollapsibleControlGroup>
              )}

              {!selectedGroup && (
                <div className="alert alert-info mt-4">
                  <div className="flex items-start gap-2">
                    <FiInfo className="flex-shrink-0 mt-0.5" />
                    <span>Click on a part of the model to configure it.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Kabinet() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [params, setParams] = useState(
    data.varibles || {
      allwidth: 2000,
      borderColor: "#ff0000",
      borderThickness: 0.05,
    }
  );

  const [nodeGroups, setNodeGroups] = useState([]);

  // Load node groups from data
  useEffect(() => {
    if (data.nodesData) {
      setNodeGroups(data.nodesData);
      // Initialize params with default values from nodesData
      const initialParams = { ...data.varibles };
      data.nodesData.forEach((group) => {
        if (group.controls) {
          Object.entries(group.controls).forEach(([key, config]) => {
            if (
              config.value !== undefined &&
              initialParams[key] === undefined
            ) {
              initialParams[key] = config.value;
            }
          });
        }
      });
      setParams(initialParams);
    }
  }, []);

  return (
    <div className="relative h-screen w-screen bg-base-100">
      <ControlPanel
        selectedGroup={selectedGroup}
        params={params}
        setParams={setParams}
        nodeGroups={nodeGroups}
      />

      <div className="lg:ml-80 h-full">
        <Canvas
          gl={{
            logarithmicDepthBuffer: true,
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 0.8,
          }}
          dpr={[1, 2]}
          camera={{ position: [0, 0, 20], fov: 25 }}
          shadows
        >
          <color attach="background" args={["#f0f0f0"]} />

          <Environment
            preset="apartment"
            background
            backgroundBlurriness={0.5}
          />

          <ambientLight intensity={0.2} color="#ffffff" />
          <hemisphereLight
            intensity={0.5}
            color="#ffffff"
            groundColor="#b97a20"
            position={[0, 50, 0]}
          />
          <directionalLight
            position={[5, 10, 7]}
            intensity={1.5}
            color="#ffebc1"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={0.5}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
            shadow-bias={-0.0001}
          />
          <directionalLight
            position={[-5, 5, -5]}
            intensity={0.8}
            color="#a6c1ff"
          />
          <directionalLight
            position={[0, -5, 0]}
            intensity={0.3}
            color="#ffffff"
          />

          <ModelLaundry
            rotation={[0, -1.6, 0]}
            position={[0, -1.155, 0]}
            scale={1.5}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            params={params}
          />

          <ContactShadows
            resolution={1024}
            frames={1}
            position={[0, -1.16, 0]}
            scale={15}
            blur={2}
            opacity={0.6}
            far={10}
            color="#474747"
          />

          <RandomizedLight
            amount={8}
            radius={5}
            ambient={0.5}
            intensity={1}
            position={[5, 5, -5]}
            bias={0.001}
          />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            minPolarAngle={Math.PI / 2.6}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default Kabinet;
