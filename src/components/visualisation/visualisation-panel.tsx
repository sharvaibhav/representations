// src/components/building-visualization/visualization/visualization-panel.tsx
import React, { useState } from "react";
import { Square, Box } from "lucide-react";
import type { GraphBuilding } from "@/types/graph-building";
import View2D from "../rep/view-2d";
import View3D from "../rep/view-3d";
import { LevelSelector } from "./level-selector";

interface VisualizationPanelProps {
  buildingData: GraphBuilding;
  selectedLevel: number;
  setSelectedLevel: (level: number) => void;
  scale: number;
  onScaleChange: (scale: number) => void;
}

export const VisualizationPanel: React.FC<VisualizationPanelProps> = ({
  buildingData,
  selectedLevel,
  setSelectedLevel,
  scale,
  onScaleChange,
}) => {
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <LevelSelector
          buildingData={buildingData}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
        />

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("2d")}
            className={`px-3 py-1 rounded-lg flex items-center gap-1 ${
              viewMode === "2d" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            <Square className="h-4 w-4" /> 2D
          </button>
          <button
            onClick={() => setViewMode("3d")}
            className={`px-3 py-1 rounded-lg flex items-center gap-1 ${
              viewMode === "3d" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            <Box className="h-4 w-4" /> 3D
          </button>
        </div>
      </div>

      <div className="border rounded-lg bg-white" style={{ height: "600px" }}>
        {viewMode === "2d" ? (
          <View2D
            level={buildingData.levels[selectedLevel]}
            scale={scale}
            onScaleChange={onScaleChange}
          />
        ) : (
          <View3D buildingData={buildingData} selectedLevel={selectedLevel} />
        )}
      </div>
    </div>
  );
};
