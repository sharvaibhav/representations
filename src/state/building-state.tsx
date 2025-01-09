import { signal } from "@preact/signals-react";

export interface TransformVector3 {
  x: number;
  y: number;
  z: number;
}

export interface BuildingTransform {
  position: TransformVector3;
  rotation: TransformVector3;
  scale: TransformVector3;
}

export const buildingState = signal<BuildingTransform>({
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
});
