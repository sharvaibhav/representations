import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StructuralMassingPlayground from "./components/structure/structural-massing-playground";
import BuildingVisualization from "./components/visualisation";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen w-full bg-gray-100 p-4">
        <Routes>
          <Route path="/" element={<BuildingVisualization />} />
          <Route
            path="/massing-playground"
            element={<StructuralMassingPlayground />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
