import { GraphBuildingRenderer } from "@/components/visualisation/three/graph-building-renderer";
import { SceneManager } from "@/components/visualisation/three/scene-manager";
import { buildingState } from "@/state/building-state";
import { TransformControls } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

export class BuildingTransformManager {
  private transformControls: TransformControls | null = null;
  private mouseControlsEnabled: boolean = true;
  private sceneManager: SceneManager;
  private buildingRenderer: GraphBuildingRenderer;
  private grid: THREE.GridHelper | null = null;
  private isGridVisible: boolean = true;
  private wireframeMode: boolean = false;
  private originalMaterials: Map<string, THREE.Material | THREE.Material[]> =
    new Map();

  constructor(
    sceneManager: SceneManager,
    buildingRenderer: GraphBuildingRenderer
  ) {
    this.sceneManager = sceneManager;
    this.buildingRenderer = buildingRenderer;
  }

  setup() {
    const buildingGroup = this.buildingRenderer.getBuildingGroup();
    if (!buildingGroup) {
      console.warn("Building group not found, trying again later...");
      // Try again in the next frame
      requestAnimationFrame(() => this.setup());
      return;
    }

    console.log(
      "Setting up transform controls for building group",
      buildingGroup
    );

    // Create TransformControls
    this.transformControls = new TransformControls(
      this.sceneManager.getCamera(),
      this.sceneManager.getRenderer().domElement
    );

    // Attach building group to TransformControls
    this.transformControls.attach(buildingGroup);
    const gizmo = this.transformControls.getHelper();

    this.sceneManager.getScene().add(gizmo);

    // Add grid helper
    this.grid = new THREE.GridHelper(20, 20, 0x888888, 0x444444);
    this.sceneManager.getScene().add(this.grid);

    // Disable mouse controls while dragging with TransformControls
    this.transformControls.addEventListener("dragging-changed", (event) => {
      this.mouseControlsEnabled = !event.value;
      this.sceneManager.setMouseControlsEnabled(this.mouseControlsEnabled);
    });

    // Update buildingState whenever the group moves
    this.transformControls.addEventListener("change", () => {
      console.log("Building moved");
      buildingState.value = {
        ...buildingState.value,
        position: {
          x: buildingGroup.position.x,
          y: buildingGroup.position.y,
          z: buildingGroup.position.z,
        },
        rotation: {
          x: buildingGroup.rotation.x,
          y: buildingGroup.rotation.y,
          z: buildingGroup.rotation.z,
        },
        scale: {
          x: buildingGroup.scale.x,
          y: buildingGroup.scale.y,
          z: buildingGroup.scale.z,
        },
      };
    });
  }

  getTransformControls() {
    return this.transformControls;
  }

  resetView() {
    const camera = this.sceneManager.getCamera();
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
    // this.sceneManager.getControls().update();
  }

  toggleGrid() {
    if (this.grid) {
      this.isGridVisible = !this.isGridVisible;
      this.grid.visible = this.isGridVisible;
    }
  }

  toggleWireframe() {
    this.wireframeMode = !this.wireframeMode;
    const buildingGroup = this.buildingRenderer.getBuildingGroup();

    if (!buildingGroup) return;

    buildingGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (this.wireframeMode) {
          // Store original material if not already stored
          if (!this.originalMaterials.has(child.uuid)) {
            this.originalMaterials.set(child.uuid, child.material);
          }

          // Create wireframe material
          const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            wireframe: true,
            transparent: true,
            opacity: 0.3,
          });

          // Apply wireframe material
          child.material = wireframeMaterial;
        } else {
          // Restore original material
          const originalMaterial = this.originalMaterials.get(child.uuid);
          if (originalMaterial) {
            child.material = originalMaterial;
          }
        }
      }
    });
  }

  dispose() {
    if (this.transformControls) {
      this.transformControls.dispose();
      this.transformControls = null;
    }
    if (this.grid) {
      this.sceneManager.getScene().remove(this.grid);
      this.grid.dispose();
      this.grid = null;
    }

    // Restore original materials to prevent memory leaks
    if (this.wireframeMode) {
      const buildingGroup = this.buildingRenderer.getBuildingGroup();
      if (buildingGroup) {
        buildingGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const originalMaterial = this.originalMaterials.get(child.uuid);
            if (originalMaterial) {
              child.material = originalMaterial;
            }
          }
        });
      }
    }

    this.originalMaterials.clear();
  }
}
