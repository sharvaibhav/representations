// src/components/building-visualization/layout/split-layout.tsx
import React from "react";

interface SplitLayoutProps {
  contextPanel: React.ReactNode;
  visualizationPanel: React.ReactNode;
}

const SplitLayout: React.FC<SplitLayoutProps> = ({
  contextPanel,
  visualizationPanel,
}) => {
  return (
    <div className="flex w-full gap-4 h-full">
      <div className="w-1/3 overflow-auto">{contextPanel}</div>
      <div className="w-2/3">{visualizationPanel}</div>
    </div>
  );
};

export default SplitLayout;
