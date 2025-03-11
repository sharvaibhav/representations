import React, { useState } from "react";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";

// Import icons from lucide-react, which you mentioned is available
import { Move, RotateCcw, Maximize, Grid, Home, X, Eye } from "lucide-react";

type ToolbarProps = {
  transformControls: TransformControls | null;
  onModeChange: (mode: "translate" | "rotate" | "scale" | null) => void;
  onResetView: () => void;
  onToggleGrid: () => void;
  onToggleWireframe?: () => void;
  currentMode: "translate" | "rotate" | "scale" | null;
};

export const SimplifiedToolbar: React.FC<ToolbarProps> = ({
  transformControls,
  onModeChange,
  onResetView,
  onToggleGrid,
  onToggleWireframe,
  currentMode,
}) => {
  const [activeTab, setActiveTab] = useState<string>("transform");

  const handleModeChange = (mode: "translate" | "rotate" | "scale" | null) => {
    if (transformControls) {
      if (mode === null) {
        // Detach the transform controls
        transformControls.detach();
      } else {
        transformControls.setMode(mode);
      }
      onModeChange(mode);
    }
  };

  return (
    <div className="absolute top-4 left-4 w-64 z-10 bg-white/90 backdrop-blur-sm rounded-md shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2 border-b">
        <div className="text-sm font-medium flex items-center justify-between">
          <span>Structure Editor</span>
          <span className="text-xs text-gray-500">v1.0</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full">
        <div className="flex border-b">
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === "transform"
                ? "bg-gray-100 border-b-2 border-blue-500"
                : ""
            }`}
            onClick={() => setActiveTab("transform")}
          >
            Transform
          </button>
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === "view"
                ? "bg-gray-100 border-b-2 border-blue-500"
                : ""
            }`}
            onClick={() => setActiveTab("view")}
          >
            View
          </button>
        </div>

        {/* Transform Tab Content */}
        <div
          className={`p-3 ${activeTab === "transform" ? "block" : "hidden"}`}
        >
          <div className="grid grid-cols-3 gap-2">
            <button
              className={`flex flex-col items-center justify-center p-2 rounded ${
                currentMode === "translate"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => handleModeChange("translate")}
              title="Move object (press G)"
            >
              <Move className="h-5 w-5 mb-1" />
              <span className="text-xs">Move (G)</span>
            </button>

            <button
              className={`flex flex-col items-center justify-center p-2 rounded ${
                currentMode === "rotate"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => handleModeChange("rotate")}
              title="Rotate object (press R)"
            >
              <RotateCcw className="h-5 w-5 mb-1" />
              <span className="text-xs">Rotate (R)</span>
            </button>

            <button
              className={`flex flex-col items-center justify-center p-2 rounded ${
                currentMode === "scale"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => handleModeChange("scale")}
              title="Scale object (press S)"
            >
              <Maximize className="h-5 w-5 mb-1" />
              <span className="text-xs">Scale (S)</span>
            </button>
          </div>

          <div className="h-px bg-gray-200 my-3"></div>

          <button
            className="w-full flex items-center justify-center p-2 rounded bg-red-100 hover:bg-red-200 text-red-700"
            onClick={() => handleModeChange(null)}
            title="Deselect all (press Esc)"
          >
            <X className="h-4 w-4 mr-2" />
            <span className="text-sm">Deselect (Esc)</span>
          </button>
        </div>

        {/* View Tab Content */}
        <div className={`p-3 ${activeTab === "view" ? "block" : "hidden"}`}>
          <div className="space-y-2">
            <button
              className="w-full flex items-center justify-start p-2 rounded bg-gray-100 hover:bg-gray-200 text-sm"
              onClick={onResetView}
              title="Reset camera to default position"
            >
              <Home className="h-4 w-4 mr-2" />
              Reset Camera View
            </button>

            <button
              className="w-full flex items-center justify-start p-2 rounded bg-gray-100 hover:bg-gray-200 text-sm"
              onClick={onToggleGrid}
              title="Show or hide the reference grid"
            >
              <Grid className="h-4 w-4 mr-2" />
              Toggle Grid
            </button>

            <button
              className="w-full flex items-center justify-start p-2 rounded bg-gray-100 hover:bg-gray-200 text-sm"
              onClick={onToggleWireframe}
              title="Switch between solid and wireframe view"
            >
              <Eye className="h-4 w-4 mr-2" />
              Toggle Wireframe
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t">
        <div className="text-xs text-gray-500">
          Tip: Use keyboard shortcuts for faster editing
        </div>
      </div>
    </div>
  );
};
