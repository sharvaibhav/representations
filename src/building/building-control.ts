// buildingControls.ts

import { buildingState } from "@/state/building-state";

export function moveBuilding(dx: number, dy: number, dz: number) {
  buildingState.value = {
    ...buildingState.value,
    position: {
      x: buildingState.value.position.x + dx,
      y: buildingState.value.position.y + dy,
      z: buildingState.value.position.z + dz,
    },
  };
}

export function rotateBuilding(dx: number, dy: number, dz: number) {
  buildingState.value = {
    ...buildingState.value,
    rotation: {
      x: buildingState.value.rotation.x + dx,
      y: buildingState.value.rotation.y + dy,
      z: buildingState.value.rotation.z + dz,
    },
  };
}

export function scaleBuilding(sx: number, sy: number, sz: number) {
  buildingState.value = {
    ...buildingState.value,
    scale: {
      x: buildingState.value.scale.x * sx,
      y: buildingState.value.scale.y * sy,
      z: buildingState.value.scale.z * sz,
    },
  };
}
