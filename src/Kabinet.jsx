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

// Icons components
const ExpandIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
    />
  </svg>
);

const CollapseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
  </svg>
);

const WidthIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
    <path d="M4.646 7.646a.5.5 0 0 1 .708 0L8 10.293l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z" />
    <path d="M4.646 8.646a.5.5 0 0 1 .708 0L8 11.293l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z" />
  </svg>
);

const HeightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M8 16a.5.5 0 0 1-.5-.5v-1.293l-.646.647a.5.5 0 0 1-.707-.708L7.5 12.793v-1.086l-.646.647a.5.5 0 0 1-.707-.708L7.5 10.293V8.866l-.646.647a.5.5 0 0 1-.707-.708L7.5 7.453V6.126l-.646.647a.5.5 0 0 1-.707-.708L7.5 4.713V3.386l-.646.647a.5.5 0 0 1-.707-.708L7.5 2.05V.5a.5.5 0 0 1 1 0v1.55l1.354 1.354a.5.5 0 0 1-.708.708L8.5 3.386v1.327l1.354 1.353a.5.5 0 0 1-.708.708L8.5 6.126v1.327l1.354 1.353a.5.5 0 0 1-.708.708L8.5 8.866v1.427l1.354 1.353a.5.5 0 0 1-.708.708L8.5 10.793v1.427l1.354 1.353a.5.5 0 0 1-.708.708L8.5 12.793v1.207a.5.5 0 0 1-.5.5z" />
  </svg>
);

const DepthIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z" />
    <path d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z" />
  </svg>
);

const TextureIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
  </svg>
);

function CollapsibleControlGroup({ title, isOpen, onToggle, children, icon }) {
  return (
    <div className="mb-3 border rounded-lg shadow-sm">
      <button
        className="w-full flex items-center justify-between p-3 bg-base-100 hover:bg-base-200 rounded-lg"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-2">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        {isOpen ? <CollapseIcon /> : <ExpandIcon />}
      </button>
      {isOpen && <div className="p-3 pt-1 border-t">{children}</div>}
    </div>
  );
}

function ControlPanel({ selectedGroup, params, setParams, nodeGroups }) {
  const [isOpen, setIsOpen] = useState(true);
  const [openSections, setOpenSections] = useState({
    global: true,
    selected: true,
  });

  // Find the currently selected group
  const group = nodeGroups.find((g) => g.name === selectedGroup);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Group controls by type for better organization
  const getGroupedControls = (controls) => {
    const dimensions = {};
    const appearance = {};

    if (!controls) return { dimensions, appearance };

    Object.entries(controls).forEach(([key, config]) => {
      if (
        key.includes("Width") ||
        key.includes("Height") ||
        key.includes("Depth") ||
        key.includes("Size")
      ) {
        dimensions[key] = config;
      } else {
        appearance[key] = config;
      }
    });

    return { dimensions, appearance };
  };

  const getIconForControl = (key) => {
    if (key.toLowerCase().includes("width")) return <WidthIcon />;
    if (key.toLowerCase().includes("height")) return <HeightIcon />;
    if (key.toLowerCase().includes("depth")) return <DepthIcon />;
    if (
      key.toLowerCase().includes("texture") ||
      key.toLowerCase().includes("material")
    )
      return <TextureIcon />;
    return null;
  };

  // Render a single control
  const renderControl = (key, config) => {
    const icon = getIconForControl(key);

    return (
      <div key={key} className="form-control mb-3">
        <label className="label">
          <div className="flex items-center space-x-2">
            {icon}
            <span className="label-text">{config.label || key}</span>
          </div>
        </label>

        {/* Select for texture options */}
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
            <div className="flex justify-between text-xs px-2 mt-1">
              <span>{config.min}</span>
              <span>{config.max}</span>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed bottom-4 right-4 z-50 btn btn-primary btn-circle shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <SettingsIcon />
      </button>

      {/* Sidebar panel */}
      <div
        className={`
        fixed top-0 right-0 h-full z-40 bg-base-200 shadow-lg overflow-y-auto transition-all duration-300
        ${isOpen ? "w-64" : "w-0"} 
        lg:left-0 lg:w-72 lg:transform-none
      `}
      >
        {isOpen && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Cabinet Controls</h2>
              <button
                className="lg:hidden btn btn-sm btn-ghost"
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
            </div>

            {/* Global Controls */}
            <CollapsibleControlGroup
              title="Global Settings"
              isOpen={openSections.global}
              onToggle={() => toggleSection("global")}
              icon={<SettingsIcon />}
            >
              <div className="form-control">
                <label className="label">
                  <div className="flex items-center space-x-2">
                    <WidthIcon />
                    <span className="label-text">All Width</span>
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
                <div className="flex justify-between text-xs px-2 mt-1">
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
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                  </svg>
                }
              >
                {group.controls && Object.keys(group.controls).length > 0 && (
                  <>
                    {/* Dimensions Section */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-sm text-base-content/70">
                        DIMENSIONS
                      </h4>
                      {Object.entries(
                        getGroupedControls(group.controls).dimensions
                      ).map(([key, config]) => renderControl(key, config))}
                    </div>

                    {/* Appearance Section */}
                    {Object.keys(getGroupedControls(group.controls).appearance)
                      .length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 text-sm text-base-content/70">
                          APPEARANCE
                        </h4>
                        {Object.entries(
                          getGroupedControls(group.controls).appearance
                        ).map(([key, config]) => renderControl(key, config))}
                      </div>
                    )}
                  </>
                )}
              </CollapsibleControlGroup>
            )}

            {!selectedGroup && (
              <div className="alert alert-info mt-4">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-current flex-shrink-0 w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>Click on a part of the model to configure it.</span>
                </div>
              </div>
            )}
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

      <div className="lg:ml-72 h-full">
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
            backgroundBlurriness={100}
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
