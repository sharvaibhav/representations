// src/components/building-visualization/visualization/level-selector.tsx
import React from "react";
import { Square } from "lucide-react";
import { GraphBuilding } from "@/types/graph-building";

interface LevelSelectorProps {
  buildingData: GraphBuilding;
  selectedLevel: number;
  setSelectedLevel: (level: number) => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  buildingData,
  selectedLevel,
  setSelectedLevel,
}) => {
  return (
    <div className="flex gap-4">
      {buildingData.levels.map((_, index) => (
        <button
          key={index}
          onClick={() => setSelectedLevel(index)}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            selectedLevel === index
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <Square className="h-4 w-4" />
          Level {index + 1}
        </button>
      ))}
    </div>
  );
};
