// src/components/building-visualization/index.tsx
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Layers, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { GraphBuilding } from "@/types/graph-building";
import { convertToGraphBuilding } from "@/lib/graph-building-validation";
import data from "@/assets/sample-data.json";

import SplitLayout from "../layout/split-layout";
import { BuildingInfo, DataInput } from "../context/data-input";
import { VisualizationPanel } from "./visualisation-panel";

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
  //@ts-ignore
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
      const validatedData = convertToGraphBuilding(jsonData);
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
      const validatedData = convertToGraphBuilding(jsonData);
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

  const contextPanel = (
    <div className="space-y-6">
      <DataInput
        inputMode={inputMode}
        setInputMode={setInputMode}
        jsonInput={jsonInput}
        setJsonInput={setJsonInput}
        handleFileUpload={handleFileUpload}
        handleJsonInput={handleJsonInput}
      />
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {buildingData && (
        <BuildingInfo
          selectedLevel={selectedLevel}
          buildingData={buildingData}
        />
      )}
    </div>
  );

  const visualizationPanel = buildingData && (
    <VisualizationPanel
      buildingData={buildingData}
      selectedLevel={selectedLevel}
      scale={scale}
      onScaleChange={setScale}
      setSelectedLevel={setSelectedLevel}
    />
  );

  return (
    <Card className="w-full h-[calc(100vh-2rem)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-6 w-6" />
          Graph Building Visualization
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)]">
        <SplitLayout
          contextPanel={contextPanel}
          visualizationPanel={visualizationPanel}
        />
      </CardContent>
    </Card>
  );
};

export default BuildingVisualization;
