import { useRef, useEffect, useState } from "react";
import { GraphBuildingRenderer } from "../visualisation/three/graph-building-renderer";
import { SceneManager } from "../visualisation/three/scene-manager";
import { GraphBuilding } from "@/types/graph-building";
import { SimplifiedToolbar } from "./toolbar/toolbar";
import { BuildingTransformManager } from "./building-transform/Building-transform-manager";

type View3DProps = {
  buildingData: GraphBuilding;
};

export const StructureRenderer: React.FC<View3DProps> = ({ buildingData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);
  const buildingRendererRef = useRef<GraphBuildingRenderer | null>(null);
  const transformManagerRef = useRef<BuildingTransformManager | null>(null);

  // Using states to track UI state
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentTransformMode, setCurrentTransformMode] = useState<
    "translate" | "rotate" | "scale" | null
  >(null);

  // Key handlers for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const transformControls =
        transformManagerRef.current?.getTransformControls();
      if (!transformControls) return;

      switch (e.key.toLowerCase()) {
        case "g":
          transformControls.setMode("translate");
          setCurrentTransformMode("translate");
          break;
        case "r":
          transformControls.setMode("rotate");
          setCurrentTransformMode("rotate");
          break;
        case "s":
          transformControls.setMode("scale");
          setCurrentTransformMode("scale");
          break;
        case "escape":
          transformControls.detach();
          setCurrentTransformMode(null);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isInitialized]);

  // Single useEffect for initialization to ensure proper order
  useEffect(() => {
    if (!containerRef.current) return;
    console.log("Initializing 3D scene");

    // Step 1: Initialize scene
    const sceneManager = new SceneManager(
      containerRef.current,
      {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
        backgroundColor: 0xf5f5f5,
      },
      buildingData
    );
    sceneManagerRef.current = sceneManager;

    // Step 2: Initialize building renderer
    const buildingRenderer = new GraphBuildingRenderer(
      sceneManager.getScene(),
      {
        baseColor: 0xffd8a8,
        selectedColor: 0xa5d8ff,
        opacity: 0.9,
        roughness: 0.7,
        metalness: 0.1,
      }
    );
    buildingRendererRef.current = buildingRenderer;

    // Step 3: Render the building
    buildingRenderer.renderBuilding(buildingData);

    // Step 4: Start animation
    sceneManager.animate();

    // Step 5: Initialize transform controls with delay to ensure building is rendered
    setTimeout(() => {
      if (sceneManager && buildingRenderer) {
        console.log("Setting up transform controls");
        const transformManager = new BuildingTransformManager(
          sceneManager,
          buildingRenderer
        );
        transformManager.setup();
        transformManagerRef.current = transformManager;
        setIsInitialized(true);
      }
    }, 100); // Short delay to ensure everything is ready

    // Handle window resize
    const handleResize = () => {
      if (containerRef.current && sceneManager) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        sceneManager.resize(width, height);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      console.log("Cleaning up 3D scene");
      window.removeEventListener("resize", handleResize);
      if (transformManagerRef.current) {
        transformManagerRef.current.dispose();
      }
      if (sceneManagerRef.current) {
        sceneManagerRef.current.dispose();
      }
    };
  }, []); // Empty dependency array - only run once on mount

  // Update building when data changes
  useEffect(() => {
    if (!buildingRendererRef.current) return;
    console.log("Updating building with new data");
    buildingRendererRef.current.renderBuilding(buildingData);
  }, [buildingData]);

  // Handler for transform mode changes
  const handleModeChange = (mode: "translate" | "rotate" | "scale" | null) => {
    setCurrentTransformMode(mode);
  };

  // Handler for resetting view
  const handleResetView = () => {
    if (transformManagerRef.current) {
      transformManagerRef.current.resetView();
    }
  };

  // Handler for toggling grid
  const handleToggleGrid = () => {
    if (transformManagerRef.current) {
      transformManagerRef.current.toggleGrid();
    }
  };

  // Handler for toggling wireframe
  const handleToggleWireframe = () => {
    if (transformManagerRef.current) {
      transformManagerRef.current.toggleWireframe();
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />

      {isInitialized && (
        <SimplifiedToolbar
          transformControls={
            transformManagerRef.current?.getTransformControls() || null
          }
          onModeChange={handleModeChange}
          onResetView={handleResetView}
          onToggleGrid={handleToggleGrid}
          onToggleWireframe={handleToggleWireframe}
          currentMode={currentTransformMode}
        />
      )}
    </div>
  );
};
