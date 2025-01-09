import { useRef, useEffect } from "react";
import { GraphBuildingRenderer } from "../visualisation/three/graph-building-renderer";
import { SceneManager } from "../visualisation/three/scene-manager";
import { GraphBuilding } from "@/types/graph-building";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { buildingState } from "@/state/building-state";

type View3DProps = {
  buildingData: GraphBuilding;
};

export const StructureRenderer: React.FC<View3DProps> = ({ buildingData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);
  const buildingRendererRef = useRef<GraphBuildingRenderer | null>(null);
  const transformControlsRef = useRef<TransformControls | null>(null);
  const mouseControlsEnabledRef = useRef<boolean>(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene
    const sceneManager = new SceneManager(
      containerRef.current,
      {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
        backgroundColor: 0xf5f5f5,
      },
      buildingData
    );

    // Initialize building renderer
    const buildingRenderer = new GraphBuildingRenderer(
      sceneManager.getScene(),
      {
        baseColor: 0xffd8a8,
        selectedColor: 0xa5d8ff,
        opacity: 0.9,
        roughness: 0.7,
        metalness: 0.1,
      }
    );

    sceneManagerRef.current = sceneManager;
    buildingRendererRef.current = buildingRenderer;

    // Start animation
    sceneManager.animate();

    requestAnimationFrame(() => {
      const buildingGroup = buildingRenderer.getBuildingGroup();
      if (!buildingGroup) return;

      // Create TransformControls
      const transformControls = new TransformControls(
        sceneManager.getCamera(),
        sceneManager.getRenderer().domElement
      );

      // Attach building group to TransformControls
      if (buildingGroup) {
        transformControls.attach(buildingGroup);
      }
      const gizmo = transformControls.getHelper();

      sceneManager.getScene().add(gizmo);

      // Store reference for later use (if needed)
      transformControlsRef.current = transformControls;
      // Disable mouse controls while dragging with TransformControls
      transformControls.addEventListener("dragging-changed", (event) => {
        mouseControlsEnabledRef.current = !event.value; // Disable mouse controls when dragging
        //@ts-ignore
        sceneManager.setMouseControlsEnabled(mouseControlsEnabledRef.current);
      });

      // Setup event listener to update buildingState whenever the group moves
      transformControls.addEventListener("change", () => {
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
    });

    // Cleanup
    return () => {
      sceneManager.dispose();
    };
  }, []);

  useEffect(() => {
    if (!buildingRendererRef.current) return;
    buildingRendererRef.current.renderBuilding(buildingData);
  }, [buildingData]);

  return <div ref={containerRef} className="w-full h-full" />;
};
