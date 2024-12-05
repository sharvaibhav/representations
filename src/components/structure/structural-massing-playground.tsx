import React, { useState } from "react";
import type { GraphBuilding } from "@/types/graph-building";

const StructuralMassingPlayground: React.FC = () => {
  const [buildingData, setBuildingData] = useState<GraphBuilding | null>(null);

  const handleCreateNewMassing = () => {
    // Here you can define some default massing data or a way to generate new mass shapes
    const newMassing: GraphBuilding = {
      levels: [
        {
          height: 3,
          points: {
            a: [0, 0],
            b: [10, 0],
            c: [10, 10],
            d: [0, 10],
          },
          spaces: [
            {
              id: "space1",
              outerLoop: [
                {
                  id: "ab1",
                  partnerId: "ab2",
                  surfaceId: "ab",
                  directionAToB: true,
                },
                {
                  id: "bc1",
                  partnerId: "bc2",
                  surfaceId: "bc",
                  directionAToB: true,
                },
                {
                  id: "cd1",
                  partnerId: "cd2",
                  surfaceId: "cd",
                  directionAToB: true,
                },
                {
                  id: "da1",
                  partnerId: "da2",
                  surfaceId: "da",
                  directionAToB: true,
                },
              ],
            },
          ],
          surfaces: [
            { id: "ab", pointA: "a", pointB: "b" },
            { id: "bc", pointA: "b", pointB: "c" },
            { id: "cd", pointA: "c", pointB: "d" },
            { id: "da", pointA: "d", pointB: "a" },
          ],
        },
      ],
      units: [],
    };

    setBuildingData(newMassing);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-2xl font-semibold">Structural Massing Playground</h2>
      <button
        onClick={handleCreateNewMassing}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Create New Massing
      </button>
      <div className="w-full h-[600px] mt-4 border">
        {buildingData ? (
          <div className="w-full h-full">
            {/* Use View3D or other visualization tools to render the massing */}
            {/* <GraphBuildingRenderer
              buildingData={buildingData}
              selectedLevel={0}
            /> */}
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
