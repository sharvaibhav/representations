import * as THREE from "three";
import type { GraphBuilding } from "@/types/graph-building";
import { Group } from "three";

export interface BuildingMaterialOptions {
  baseColor: number;
  selectedColor: number;
  opacity: number;
  roughness: number;
  metalness: number;
}

export class GraphBuildingRenderer {
  private currentHeight: number = 0;
  private buildingGroup: Group;

  constructor(
    private scene: THREE.Scene,
    private materialOptions: BuildingMaterialOptions
  ) {
    this.buildingGroup = new Group();
    this.scene.add(this.buildingGroup);
  }

  public renderBuilding(
    buildingData: GraphBuilding,
    selectedLevel: number = 0
  ): void {
    this.clearBuildingMeshes();
    this.currentHeight = 0;
    buildingData.levels.forEach((level, levelIndex) => {
      this.renderLevel(level, levelIndex, selectedLevel);
    });
  }

  private renderLevel(
    level: GraphBuilding["levels"][number],
    levelIndex: number,
    selectedLevel: number
  ): void {
    const levelHeight = level.height;
    const baseHeight = this.currentHeight;

    level.spaces.forEach((space) => {
      const points = this.collectSpacePoints(space, level);
      if (points.length < 3) return;

      const shape = new THREE.Shape(points);
      const geometry = this.createExtrudedGeometry(shape, levelHeight);
      const materials = this.createMaterials(levelIndex === selectedLevel);

      this.createAndAddMesh(geometry, materials, baseHeight);
      this.addEdges(geometry, baseHeight);
    });
    this.currentHeight += levelHeight;
  }

  private collectSpacePoints(
    space: GraphBuilding["levels"][number]["spaces"][number],
    level: GraphBuilding["levels"][number]
  ): THREE.Vector2[] {
    const points: THREE.Vector2[] = [];

    space.outerLoop.forEach((coSurface) => {
      const surface = level.surfaces.find((s) => s.id === coSurface.surfaceId);
      if (!surface) return;

      const pointId = coSurface.directionAToB ? surface.pointA : surface.pointB;
      const point = level.points[pointId];
      if (!point) return;

      points.push(new THREE.Vector2(point[0], point[1]));
    });

    return points;
  }

  private createExtrudedGeometry(
    shape: THREE.Shape,
    height: number
  ): THREE.ExtrudeGeometry {
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: false,
    });
    console.log(geometry);
    geometry.rotateX(-Math.PI / 2);
    return geometry;
  }

  private createMaterials(isSelected: boolean): THREE.Material[] {
    const color = isSelected
      ? this.materialOptions.selectedColor
      : this.materialOptions.baseColor;

    return [
      // Side material
      new THREE.MeshStandardMaterial({
        color: color,
        transparent: true,
        opacity: this.materialOptions.opacity,
        side: THREE.FrontSide,
        roughness: this.materialOptions.roughness,
        metalness: this.materialOptions.metalness,
      }),
      // Top/bottom material
      new THREE.MeshStandardMaterial({
        color: color,
        transparent: true,
        opacity: this.materialOptions.opacity + 0.05,
        side: THREE.DoubleSide,
        roughness: this.materialOptions.roughness - 0.2,
        metalness: this.materialOptions.metalness,
      }),
    ];
  }

  private createAndAddMesh(
    geometry: THREE.ExtrudeGeometry,
    materials: THREE.Material[],
    baseHeight: number
  ): void {
    const mesh = new THREE.Mesh(geometry, materials);
    mesh.position.y = baseHeight;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.type = "building";
    this.buildingGroup.add(mesh);
    // this.scene.add(mesh);
  }

  private addEdges(geometry: THREE.ExtrudeGeometry, baseHeight: number): void {
    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({
      color: 0x333333,
      transparent: true,
      opacity: 0.5,
    });
    const edgesMesh = new THREE.LineSegments(edges, material);
    edgesMesh.position.y = baseHeight;
    edgesMesh.userData.type = "building";
    this.scene.add(edgesMesh);
  }

  private clearBuildingMeshes(): void {
    this.scene.children = this.scene.children.filter(
      (child) => !child.userData.type || child.userData.type !== "building"
    );
  }

  getBuildingGroup(): Group {
    return this.buildingGroup;
  }
}
