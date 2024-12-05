import React from "react";
import { Layers, Upload, Edit3 } from "lucide-react";

interface DataInputProps {
  inputMode: "sample" | "file" | "paste";
  setInputMode: (mode: "sample" | "file" | "paste") => void;
  jsonInput: string;
  setJsonInput: (value: string) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleJsonInput: () => void;
}

export const DataInput: React.FC<DataInputProps> = ({
  inputMode,
  setInputMode,
  jsonInput,
  setJsonInput,
  handleFileUpload,
  handleJsonInput,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <button
          onClick={() => setInputMode("sample")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            inputMode === "sample"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <Layers className="h-4 w-4" />
          Sample Data
        </button>
        <button
          onClick={() => setInputMode("file")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            inputMode === "file"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <Upload className="h-4 w-4" />
          Upload JSON
        </button>
        <button
          onClick={() => setInputMode("paste")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            inputMode === "paste"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <Edit3 className="h-4 w-4" />
          Paste JSON
        </button>
      </div>

      {inputMode === "file" && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="w-full"
          />
        </div>
      )}

      {inputMode === "paste" && (
        <div className="space-y-2">
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full h-40 p-2 border rounded-lg font-mono text-sm"
            placeholder="Paste your Graph Building JSON here..."
          />
          <button
            onClick={handleJsonInput}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Parse JSON
          </button>
        </div>
      )}
    </div>
  );
};

// src/components/building-visualization/context/building-info.tsx
import type { GraphBuilding } from "@/types/graph-building";

interface BuildingInfoProps {
  selectedLevel: number;
  buildingData: GraphBuilding;
}

export const BuildingInfo: React.FC<BuildingInfoProps> = ({
  selectedLevel,
  buildingData,
}) => {
  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h3 className="font-semibold">Level Information</h3>
        <p>Height: {buildingData.levels[selectedLevel].height}m</p>
        <p>Spaces: {buildingData.levels[selectedLevel].spaces.length}</p>
        <p>Surfaces: {buildingData.levels[selectedLevel].surfaces.length}</p>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold">Units</h3>
        {buildingData.units?.map((unit) => (
          <div key={unit.id} className="p-2 bg-gray-50 rounded">
            <p>ID: {unit.id}</p>
            <p>Function: {unit.properties.function || "N/A"}</p>
            <p>Program: {unit.properties.program || "N/A"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
