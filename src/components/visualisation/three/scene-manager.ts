// src/components/building-visualization/three/scene-manager.ts
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { GraphBuilding } from "@/types/graph-building";

export interface SceneConfig {
  width: number;
  height: number;
  backgroundColor?: number;
}

export class SceneManager {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private buildingBounds: any;

  constructor(
    private container: HTMLElement,
    private config: SceneConfig,
    buildingData: GraphBuilding
  ) {
    this.scene = new THREE.Scene();
    this.buildingBounds = this.calculateBuildingBounds(buildingData);
    this.camera = this.setupCamera();
    this.renderer = this.setupRenderer();
    this.controls = this.setupControls();

    this.setupBasicScene();
    this.setupEventListeners();
  }

  getCamera() {
    return this.camera;
  }

  getRenderer() {
    return this.renderer;
  }

  private setupCamera(): THREE.PerspectiveCamera {
    const maxDimension = this.getMaxDimension();
    const camera = new THREE.PerspectiveCamera(
      45,
      this.config.width / this.config.height,
      0.1,
      1000
    );

    const distance = maxDimension * 2;
    camera.position.set(distance, distance * 0.8, distance);
    camera.lookAt(
      this.buildingBounds.center.x,
      this.buildingBounds.center.y,
      this.buildingBounds.center.z
    );

    return camera;
  }

  private setupRenderer(): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(this.config.width, this.config.height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(renderer.domElement);
    return renderer;
  }

  private setupControls(): OrbitControls {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    const maxDimension = this.getMaxDimension();

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = maxDimension * 0.5;
    controls.maxDistance = maxDimension * 4;
    controls.maxPolarAngle = Math.PI / 2;

    return controls;
  }

  private setupBasicScene(): void {
    // Set background
    this.scene.background = new THREE.Color(
      this.config.backgroundColor || 0xf5f5f5
    );

    // Add lights
    this.addLights();

    // Add ground and grid
    this.addGround();
    this.addGrid();
  }

  private addLights(): void {
    const maxDimension = this.getMaxDimension();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(maxDimension, maxDimension, maxDimension);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -maxDimension;
    directionalLight.shadow.camera.right = maxDimension;
    directionalLight.shadow.camera.top = maxDimension;
    directionalLight.shadow.camera.bottom = -maxDimension;
    this.scene.add(directionalLight);
  }

  private addGround(): void {
    const maxDimension = this.getMaxDimension();
    const groundGeometry = new THREE.PlaneGeometry(
      maxDimension * 3,
      maxDimension * 3
    );
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0xe0e0e0,
      roughness: 1,
      metalness: 0,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  private addGrid(): void {
    const maxDimension = this.getMaxDimension();
    const gridHelper = new THREE.GridHelper(
      maxDimension * 2,
      20,
      0x888888,
      0xcccccc
    );
    gridHelper.position.y = 0;
    this.scene.add(gridHelper);
  }

  private setupEventListeners(): void {
    window.addEventListener("resize", this.handleResize);
  }

  private handleResize = (): void => {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }

  public dispose(): void {
    window.removeEventListener("resize", this.handleResize);
    this.renderer.dispose();
  }

  private getMaxDimension(): number {
    return Math.max(
      this.buildingBounds.size.x,
      this.buildingBounds.size.y,
      this.buildingBounds.size.z
    );
  }

  private calculateBuildingBounds(buildingData: GraphBuilding) {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    let maxZ = 0;

    buildingData.levels.forEach((level) => {
      Object.values(level.points).forEach(([x, y]) => {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      });
      maxZ += level.height || 3;
    });

    return {
      min: { x: minX, y: minY, z: 0 },
      max: { x: maxX, y: maxY, z: maxZ },
      center: {
        x: (minX + maxX) / 2,
        y: (minY + maxY) / 2,
        z: maxZ / 2,
      },
      size: {
        x: maxX - minX,
        y: maxY - minY,
        z: maxZ,
      },
    };
  }
}
