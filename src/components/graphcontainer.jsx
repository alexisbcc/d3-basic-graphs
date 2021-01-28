import React from "react";
import "./graphcontainer.css";
// Components
import Line from "./line.jsx";
import Bar from "./bar.jsx";

function GraphContainer() {
  return (
    <div className="container">
      <div className="item">
        <Bar />
      </div>
      <div className="item">
        <Line />
      </div>
    </div>
  );
}

export default GraphContainer;
