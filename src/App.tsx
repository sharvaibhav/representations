import BuildingVisualization from "./components/visualisation";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* <BuildingVisualization /> */}
      <BuildingVisualization />
    </div>
  );
}

export default App;

// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import BuildingVisualization from "./BuildingVisualization";
// import StructuralMassingPlayground from "./components/structure/structural-massing-playground";

// const App: React.FC = () => {
//   return (
//     <Router>
//       <Routes>
//         {/* Default route for graph building visualization */}
//         <Route path="/" element={<BuildingVisualization />} />
//         {/* New route for structural massing playground */}
//         <Route
//           path="/massing-playground"
//           element={<StructuralMassingPlayground />}
//         />
//       </Routes>
//     </Router>
//   );
// };

// export default App;
