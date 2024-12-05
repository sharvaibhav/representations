// src/components/building-visualization/rep/view-3d.tsx
import React, { useEffect, useRef } from "react";
import type { GraphBuilding } from "@/types/graph-building";
import { SceneManager } from "../visualisation/three/scene-manager";
import { GraphBuildingRenderer } from "../visualisation/three/graph-building-renderer";

interface View3DProps {
  buildingData: GraphBuilding;
  selectedLevel: number;
}

const View3D: React.FC<View3DProps> = ({ buildingData, selectedLevel }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);
  const buildingRendererRef = useRef<GraphBuildingRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene
    const sceneManager = new SceneManager(
      containerRef.current,
      {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
        backgroundColor: 0xf5f5f5,
      },
      buildingData
    );

    // Initialize building renderer
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

    sceneManagerRef.current = sceneManager;
    buildingRendererRef.current = buildingRenderer;

    // Start animation
    sceneManager.animate();

    // Cleanup
    return () => {
      sceneManager.dispose();
    };
  }, []);

  // Update building when data or selected level changes
  useEffect(() => {
    if (!buildingRendererRef.current) return;
    buildingRendererRef.current.renderBuilding(buildingData, selectedLevel);
  }, [buildingData, selectedLevel]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default View3D;
