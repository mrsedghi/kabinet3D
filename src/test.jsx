import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";

const RotatableBox = () => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [planeWidth, setPlaneWidth] = useState(1200);
  const [planeHeight, setPlaneHeight] = useState(2400);
  const [isDragging, setIsDragging] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState("rotate"); // 'rotate' or 'orbit'

  const MAX_WIDTH = 1200;
  const MAX_HEIGHT = 2400;
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const planeRef = useRef(null);
  const textureRef = useRef(null);
  const inputRef = useRef(null);
  const animationRef = useRef(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Scale down for Three.js - large pixel values don't work well in Three.js
    const scaleDown = 100;
    const scaledWidth = planeWidth / scaleDown;
    const scaledHeight = planeHeight / scaleDown;
    const scaledMaxWidth = MAX_WIDTH / scaleDown;
    const scaledMaxHeight = MAX_HEIGHT / scaleDown;
    const scaledDepth = 500 / scaleDown; // Fixed 500px depth

    // Camera setup - Position camera to properly see the box
    const camera = new THREE.PerspectiveCamera(
      40,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    // Position camera further back to zoom out (showing box in half the size)
    camera.position.z = scaledMaxHeight * 2.4; // Double the distance
    camera.position.x = scaledMaxWidth * 0.6; // Keep same proportional angle
    camera.position.y = -scaledMaxHeight * 0.4;
    camera.lookAt(0, 0, 0); // Look at the center of the box
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Add directional lights from multiple angles for better box visibility
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight1.position.set(1, 1, 1);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight2.position.set(-1, 0.5, 0.5);
    scene.add(directionalLight2);

    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight3.position.set(0, -1, 0.5);
    scene.add(directionalLight3);

    // Add a larger grid for better spatial reference when zoomed out
    const gridHelper = new THREE.GridHelper(
      scaledMaxWidth * 4,
      40,
      0x888888,
      0x888888
    );
    gridHelper.position.y = -scaledHeight / 2 - 0.5; // Position just below the box
    scene.add(gridHelper);

    // Create a default texture
    const defaultTexture = new THREE.TextureLoader().load(
      "/api/placeholder/1200/2400"
    );
    defaultTexture.wrapS = THREE.ClampToEdgeWrapping;
    defaultTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Set the texture repeat and offset for cropping effect
    defaultTexture.repeat.set(planeWidth / MAX_WIDTH, planeHeight / MAX_HEIGHT);
    defaultTexture.offset.set(0, 1 - planeHeight / MAX_HEIGHT);

    // Create a box geometry with the image on the front face
    const geometry = new THREE.BoxGeometry(
      scaledWidth,
      scaledHeight,
      scaledDepth
    );

    // Create materials for each face of the box - front face has the image
    const materials = [
      new THREE.MeshStandardMaterial({ color: 0xcccccc }), // right
      new THREE.MeshStandardMaterial({ color: 0xcccccc }), // left
      new THREE.MeshStandardMaterial({ color: 0xcccccc }), // top
      new THREE.MeshStandardMaterial({ color: 0xcccccc }), // bottom
      new THREE.MeshStandardMaterial({ map: defaultTexture }), // front (with image)
      new THREE.MeshStandardMaterial({ color: 0xcccccc }), // back
    ];

    const box = new THREE.Mesh(geometry, materials);

    // Center the box in the canvas, while keeping top-left as image reference
    box.position.x = 0;
    box.position.y = 0;
    box.position.z = 0;

    scene.add(box);
    planeRef.current = box;

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      // Auto-rotation when rotationSpeed is set
      if (planeRef.current && rotationSpeed > 0) {
        planeRef.current.rotation.y += rotationSpeed;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Mouse event handlers for rotation
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !planeRef.current) return;

    const deltaX = e.clientX - mousePosition.x;
    const deltaY = e.clientY - mousePosition.y;
    setMousePosition({ x: e.clientX, y: e.clientY });

    if (viewMode === "rotate") {
      // Rotate the box based on mouse movement
      planeRef.current.rotation.y += deltaX * 0.01;
      planeRef.current.rotation.x += deltaY * 0.01;
    } else if (viewMode === "orbit" && cameraRef.current) {
      // Orbit camera around the box
      const camera = cameraRef.current;

      // Calculate camera orbit
      const theta = deltaX * 0.01;
      const phi = deltaY * 0.01;

      // Get current camera position
      const distance = camera.position.length();

      // Calculate new camera position in spherical coordinates
      camera.position.x = distance * Math.sin(phi) * Math.cos(theta);
      camera.position.z = distance * Math.cos(phi);
      camera.position.y = distance * Math.sin(phi) * Math.sin(theta);

      // Ensure camera always looks at the center of the box
      camera.lookAt(0, 0, 0);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Handle rotation speed change
  const handleRotationSpeedChange = (e) => {
    setRotationSpeed(parseFloat(e.target.value));
  };

  // Handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setIsLoading(true);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);

        // Create a new texture from the loaded image
        const loader = new THREE.TextureLoader();
        loader.load(
          e.target.result,
          (texture) => {
            // Configure texture to properly handle cropping
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;

            // Scale down for Three.js
            const scaleDown = 100;
            const scaledWidth = planeWidth / scaleDown;
            const scaledHeight = planeHeight / scaleDown;
            const scaledMaxWidth = MAX_WIDTH / scaleDown;
            const scaledMaxHeight = MAX_HEIGHT / scaleDown;
            const scaledDepth = 500 / scaleDown; // Fixed 500px depth

            // Set up texture for top-left reference cropping
            texture.repeat.set(
              planeWidth / MAX_WIDTH,
              planeHeight / MAX_HEIGHT
            );
            texture.offset.set(0, 1 - planeHeight / MAX_HEIGHT);
            textureRef.current = texture;

            // Update the 3D object with the new texture
            if (planeRef.current) {
              // Remove the old box
              if (sceneRef.current) {
                sceneRef.current.remove(planeRef.current);
              }

              // Create a new box with proper texture mapping
              const geometry = new THREE.BoxGeometry(
                scaledWidth,
                scaledHeight,
                scaledDepth
              );

              // Create materials for each face of the box
              const materials = [
                new THREE.MeshStandardMaterial({ color: 0xcccccc }), // right
                new THREE.MeshStandardMaterial({ color: 0xcccccc }), // left
                new THREE.MeshStandardMaterial({ color: 0xcccccc }), // top
                new THREE.MeshStandardMaterial({ color: 0xcccccc }), // bottom
                new THREE.MeshStandardMaterial({ map: texture }), // front (with image)
                new THREE.MeshStandardMaterial({ color: 0xcccccc }), // back
              ];

              const box = new THREE.Mesh(geometry, materials);

              // Preserve any existing rotation
              if (planeRef.current.rotation) {
                box.rotation.copy(planeRef.current.rotation);
              }

              // Center the box in the canvas
              box.position.x = 0;
              box.position.y = 0;
              box.position.z = 0;

              if (sceneRef.current) {
                sceneRef.current.add(box);
              }

              planeRef.current = box;
            }

            setIsLoading(false);
          },
          undefined,
          (error) => {
            console.error("Error loading texture:", error);
            setIsLoading(false);
          }
        );
      };
      reader.readAsDataURL(file);
    }
  };

  // Update plane dimensions when width/height change
  useEffect(() => {
    if (planeRef.current && textureRef.current) {
      // Remove the old box
      if (sceneRef.current) {
        sceneRef.current.remove(planeRef.current);
      }

      // Scale down for Three.js (which works better with smaller units)
      const scaleDown = 100;
      const scaledWidth = planeWidth / scaleDown;
      const scaledHeight = planeHeight / scaleDown;
      const scaledMaxWidth = MAX_WIDTH / scaleDown;
      const scaledMaxHeight = MAX_HEIGHT / scaleDown;
      const scaledDepth = 500 / scaleDown; // Fixed 500px depth

      // Create a box geometry instead of a plane
      const geometry = new THREE.BoxGeometry(
        scaledWidth,
        scaledHeight,
        scaledDepth
      );

      // Modify texture mapping to keep top-left corner as reference
      textureRef.current.wrapS = THREE.ClampToEdgeWrapping;
      textureRef.current.wrapT = THREE.ClampToEdgeWrapping;

      // Apply texture coordinate mapping to create the cropping effect
      textureRef.current.repeat.set(
        planeWidth / MAX_WIDTH,
        planeHeight / MAX_HEIGHT
      );
      textureRef.current.offset.set(0, 1 - planeHeight / MAX_HEIGHT);
      textureRef.current.needsUpdate = true;

      // Create materials for each face of the box
      // Front face (index 4) will have the image texture
      const materials = [
        new THREE.MeshStandardMaterial({ color: 0xcccccc }), // right
        new THREE.MeshStandardMaterial({ color: 0xcccccc }), // left
        new THREE.MeshStandardMaterial({ color: 0xcccccc }), // top
        new THREE.MeshStandardMaterial({ color: 0xcccccc }), // bottom
        new THREE.MeshStandardMaterial({ map: textureRef.current }), // front
        new THREE.MeshStandardMaterial({ color: 0xcccccc }), // back
      ];

      const box = new THREE.Mesh(geometry, materials);

      // Preserve any existing rotation
      if (planeRef.current.rotation) {
        box.rotation.copy(planeRef.current.rotation);
      }

      // Center the box in the scene
      box.position.x = 0;
      box.position.y = 0;
      box.position.z = 0;

      // Add the new box to the scene
      if (sceneRef.current) {
        sceneRef.current.add(box);
      }

      // Update the reference
      planeRef.current = box;
    } else if (planeRef.current) {
      // If we don't have a texture yet, just update the geometry and position
      if (sceneRef.current) {
        sceneRef.current.remove(planeRef.current);
      }

      // Scale down for Three.js
      const scaleDown = 100;
      const scaledWidth = planeWidth / scaleDown;
      const scaledHeight = planeHeight / scaleDown;
      const scaledMaxWidth = MAX_WIDTH / scaleDown;
      const scaledMaxHeight = MAX_HEIGHT / scaleDown;
      const scaledDepth = 500 / scaleDown; // Fixed 500px depth

      // Create a box geometry
      const geometry = new THREE.BoxGeometry(
        scaledWidth,
        scaledHeight,
        scaledDepth
      );

      // Create materials for each face of the box
      const defaultTexture = new THREE.TextureLoader().load(
        "/api/placeholder/1200/2400"
      );
      defaultTexture.wrapS = THREE.ClampToEdgeWrapping;
      defaultTexture.wrapT = THREE.ClampToEdgeWrapping;
      defaultTexture.repeat.set(
        planeWidth / MAX_WIDTH,
        planeHeight / MAX_HEIGHT
      );
      defaultTexture.offset.set(0, 1 - planeHeight / MAX_HEIGHT);

      const materials = [
        new THREE.MeshStandardMaterial({ color: 0xcccccc }), // right
        new THREE.MeshStandardMaterial({ color: 0xcccccc }), // left
        new THREE.MeshStandardMaterial({ color: 0xcccccc }), // top
        new THREE.MeshStandardMaterial({ color: 0xcccccc }), // bottom
        new THREE.MeshStandardMaterial({ map: defaultTexture }), // front
        new THREE.MeshStandardMaterial({ color: 0xcccccc }), // back
      ];

      const box = new THREE.Mesh(geometry, materials);

      // Preserve any existing rotation
      if (planeRef.current.rotation) {
        box.rotation.copy(planeRef.current.rotation);
      }

      // Center the box in the scene
      box.position.x = 0;
      box.position.y = 0;
      box.position.z = 0;

      if (sceneRef.current) {
        sceneRef.current.add(box);
      }

      planeRef.current = box;
    }
  }, [planeWidth, planeHeight]);

  const triggerFileUpload = () => {
    inputRef.current.click();
  };

  const handleWidthChange = (e) => {
    setPlaneWidth(parseInt(e.target.value, 10));
  };

  const handleHeightChange = (e) => {
    setPlaneHeight(parseInt(e.target.value, 10));
  };

  const resetRotation = () => {
    if (planeRef.current) {
      // Reset box rotation
      planeRef.current.rotation.set(0, 0, 0);

      // Reset auto-rotation
      setRotationSpeed(0);

      // Reset camera if in orbit mode
      if (viewMode === "orbit" && cameraRef.current) {
        const camera = cameraRef.current;
        const scaleDown = 100;
        const scaledMaxWidth = MAX_WIDTH / scaleDown;
        const scaledMaxHeight = MAX_HEIGHT / scaleDown;

        camera.position.set(
          scaledMaxWidth * 0.6,
          -scaledMaxHeight * 0.4,
          scaledMaxHeight * 2.4
        );
        camera.lookAt(0, 0, 0);
      }
    }
  };

  // Toggle between rotation modes
  const toggleViewMode = () => {
    setViewMode(viewMode === "rotate" ? "orbit" : "rotate");
    // Reset to prevent jumps when switching modes
    if (planeRef.current && cameraRef.current) {
      if (viewMode === "orbit") {
        // Reset camera when switching back to box rotation
        const camera = cameraRef.current;
        const scaleDown = 100;
        const scaledMaxWidth = MAX_WIDTH / scaleDown;
        const scaledMaxHeight = MAX_HEIGHT / scaleDown;
        const scaledDepth = 500 / scaleDown;

        camera.position.set(
          scaledMaxWidth * 0.3,
          -scaledMaxHeight * 0.2,
          scaledMaxHeight * 1.2
        );
        camera.lookAt(0, 0, 0);
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-4">3D Box with 500px Depth</h2>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={triggerFileUpload}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Upload Image
        </button>

        <button
          onClick={resetRotation}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded"
        >
          Reset Rotation
        </button>

        <button
          onClick={toggleViewMode}
          className={`${
            viewMode === "rotate"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-purple-600 hover:bg-purple-700"
          } text-white font-medium py-2 px-4 rounded`}
        >
          Mode: {viewMode === "rotate" ? "Box Rotation" : "Camera Orbit"}
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          <span className="ml-2">Loading image...</span>
        </div>
      )}

      <div className="w-full max-w-md mb-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Width: {planeWidth}px (Max: {MAX_WIDTH}px)
          </label>
          <input
            type="range"
            min="100"
            max={MAX_WIDTH}
            step="10"
            value={planeWidth}
            onChange={handleWidthChange}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Height: {planeHeight}px (Max: {MAX_HEIGHT}px)
          </label>
          <input
            type="range"
            min="100"
            max={MAX_HEIGHT}
            step="10"
            value={planeHeight}
            onChange={handleHeightChange}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Auto-Rotation Speed: {rotationSpeed.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="0.05"
            step="0.005"
            value={rotationSpeed}
            onChange={handleRotationSpeedChange}
            className="w-full"
          />
        </div>
      </div>

      <div
        ref={mountRef}
        className="w-full h-96 border border-gray-300 rounded-lg overflow-hidden cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      ></div>

      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>
          Box dimensions: {planeWidth}px × {planeHeight}px with fixed 500px
          depth
        </p>
        <p className="mt-2">
          {viewMode === "rotate"
            ? "Drag to rotate the box | Use slider for auto-rotation"
            : "Drag to orbit camera around the box"}
        </p>
      </div>
    </div>
  );
};

export default RotatableBox;
