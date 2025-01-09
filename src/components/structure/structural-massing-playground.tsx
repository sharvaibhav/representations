import React, { useState } from "react";
import type { GraphBuilding } from "@/types/graph-building";
import data from "@/assets/sample-data-2.json";
import { StructureRenderer } from "./structure-renderer";

const StructuralMassingPlayground: React.FC = () => {
  const [buildingData, setBuildingData] = useState<GraphBuilding | null>(null);

  const handleCreateNewMassing = () => {
    // Here you can define some default massing data or a way to generate new mass shapes
    const newMassing: GraphBuilding = data;

    setBuildingData(newMassing);
  };

  return (
    <div className="flex flex-col items-center gap-4 ">
      <h2 className="text-2xl font-semibold">Structural Massing Playground</h2>
      <button
        onClick={handleCreateNewMassing}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Create New Massing
      </button>
      <div className="w-full h-[900px] mt-4 border">
        {buildingData ? (
          <div className="w-full h-full">
            <StructureRenderer buildingData={buildingData} />
          </div>
        ) : (
          <p className="text-center mt-4 text-gray-500">
            No massing created yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default StructuralMassingPlayground;
