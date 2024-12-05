import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Layers, Square, Upload, Edit3, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { GraphBuilding } from "@/types/graph-building";
import { convertToGraphBuilding } from "./lib/graph-building-validation";
import View2D from "./components/rep/view-2d";
import data from "./assets/sample-data.json";

const BuildingVisualization = () => {
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [buildingData, setBuildingData] = useState<GraphBuilding | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<"sample" | "file" | "paste">(
    "sample"
  );
  const [jsonInput, setJsonInput] = useState("");
  const [scale, setScale] = useState(1);

  // Sample building data
  const sampleBuilding: GraphBuilding = data;

  useEffect(() => {
    if (inputMode === "sample") {
      setBuildingData(sampleBuilding);
      setError(null);
    }
  }, [inputMode]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      console.log("Parsed JSON:", jsonData); // Debug log

      const validatedData = convertToGraphBuilding(jsonData);
      console.log("Validated data:", validatedData); // Debug log

      setBuildingData(validatedData);
      setSelectedLevel(0);
      setError(null);
    } catch (err) {
      setError(
        `Error loading file: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      setBuildingData(null);
    }
  };

  const handleJsonInput = () => {
    try {
      const jsonData = JSON.parse(jsonInput);
      console.log("Parsed JSON:", jsonData); // Debug log

      const validatedData = convertToGraphBuilding(jsonData);
      console.log("Validated data:", validatedData); // Debug log

      setBuildingData(validatedData);
      setSelectedLevel(0);
      setError(null);
    } catch (err) {
      setError(
        `Error parsing JSON: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      setBuildingData(null);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-6 w-6" />
          Graph Building Visualization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Input mode selection */}
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

          {/* Input methods */}
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

          {/* Error display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Building visualization */}
          {buildingData && (
            <>
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

              <div
                className="border rounded-lg bg-white"
                style={{ height: "600px" }}
              >
                <View2D
                  level={buildingData.levels[selectedLevel]}
                  scale={scale}
                  onScaleChange={setScale}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Level Information</h3>
                  <p>Height: {buildingData.levels[selectedLevel].height}m</p>
                  <p>
                    Spaces: {buildingData.levels[selectedLevel].spaces.length}
                  </p>
                  <p>
                    Surfaces:{" "}
                    {buildingData.levels[selectedLevel].surfaces.length}
                  </p>
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
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BuildingVisualization;
