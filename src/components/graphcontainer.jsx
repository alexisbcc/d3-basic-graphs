import React from "react";
import "./graphcontainer.css";
// Components
import Line from "./line.jsx";
import Bar from "./bar.jsx";

function GraphContainer() {
    const data = [
      { x: 0, y: 21 },
      { x: 1, y: 14 },
      { x: 2, y: 15 },
      { x: 3, y: 4 },
      { x: 4, y: 1 },
      { x: 5, y: 43 },
      { x: 6, y: 50 },
      { x: 7, y: 51 },
      { x: 8, y: 18 },
      { x: 9, y: 33 },
      { x: 10, y: 38 },
      { x: 11, y: 3 },
      { x: 12, y: 25 },
      { x: 13, y: 47 },
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
