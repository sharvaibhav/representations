import React from "react";
import type { GraphBuilding } from "@/types/graph-building";

interface View2DProps {
  level: GraphBuilding["levels"][number];
  scale: number;
  onScaleChange: (scale: number) => void;
}

const View2D: React.FC<View2DProps> = ({ level, scale, onScaleChange }) => {
  // Calculate bounding box
  const bbox = Object.values(level.points).reduce(
    (acc, [x, y]) => ({
      minX: Math.min(acc.minX, x),
      minY: Math.min(acc.minY, y),
      maxX: Math.max(acc.maxX, x),
      maxY: Math.max(acc.maxY, y),
    }),
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  );

  const padding = Math.max(bbox.maxX - bbox.minX, bbox.maxY - bbox.minY) * 0.1;
  const viewBox = `${(bbox.minX - padding) * scale} ${
    (bbox.minY - padding) * scale
  } ${(bbox.maxX - bbox.minX + 2 * padding) * scale} ${
    (bbox.maxY - bbox.minY + 2 * padding) * scale
  }`;

  const renderSpace = (
    space: GraphBuilding["levels"][number]["spaces"][number],
    index: number
  ) => {
    const pathPoints = space.outerLoop
      .map((coSurface) => {
        const surface = level.surfaces.find(
          (s) => s.id === coSurface.surfaceId
        );
        if (!surface) return null;
        const pointId = coSurface.directionAToB
          ? surface.pointA
          : surface.pointB;
        const point = level.points[pointId];
        return point ? `${point[0] * scale},${point[1] * scale}` : null;
      })
      .filter(Boolean);

    if (pathPoints.length === 0) return null;

    return (
      <path
        key={space.id}
        d={`M ${pathPoints.join(" L ")} Z`}
        fill={index === 0 ? "#a5d8ff" : "#ffd8a8"}
        stroke="#666"
        strokeWidth={1 / scale}
        className="transition-colors duration-200 hover:brightness-90"
      />
    );
  };

  const renderSurface = (
    surface: GraphBuilding["levels"][number]["surfaces"][number]
  ) => {
    const pointA = level.points[surface.pointA];
    const pointB = level.points[surface.pointB];
    if (!pointA || !pointB) return null;

    return (
      <line
        key={surface.id}
        x1={pointA[0] * scale}
        y1={pointA[1] * scale}
        x2={pointB[0] * scale}
        y2={pointB[1] * scale}
        stroke="#333"
        strokeWidth={0.5 / scale}
      />
    );
  };

  return (
    <div className="relative w-full h-full">
      <svg viewBox={viewBox} className="w-full h-full">
        {/* Draw spaces */}
        {level.spaces.map((space, index) => renderSpace(space, index))}

        {/* Draw surfaces */}
        {level.surfaces.map((surface) => renderSurface(surface))}
      </svg>

      {/* Scale controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-4 bg-white p-2 rounded shadow">
        <button
          onClick={() => onScaleChange(Math.max(0.1, scale * 0.8))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          -
        </button>
        <span className="text-sm min-w-[4rem] text-center">
          {(scale * 100).toFixed(0)}%
        </span>
        <button
          onClick={() => onScaleChange(Math.min(5, scale * 1.2))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default View2D;
