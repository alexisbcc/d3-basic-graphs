import React from "react";
import "./graphcontainer.css";
// Components
import Line from "./line.jsx";
import Bar from "./bar.jsx";

function GraphContainer() {
    const data = [
      { x: 0, y: 1.128 },
      { x: 1, y: 1.12 },
      { x: 2, y: 1.125 },
      { x: 3, y: 1.126 },
      { x: 4, y: 1.122 },
      { x: 5, y: 1.123 },
      { x: 6, y: 1.12 },
      { x: 7, y: 1.12 },
      { x: 8, y: 1.128 },
      { x: 9, y: 1.123 },
      { x: 10, y: 1.128 },
      { x: 11, y: 1.12 },
      { x: 12, y: 1.125 },
      { x: 13, y: 1.127 },
    ];
  return (
    <div className="container">
      <div className="item">
        <Bar />
      </div>
      <div className="item">
        <Line height={220} data={data}/>
      </div>
    </div>
  );
}

export default GraphContainer;
