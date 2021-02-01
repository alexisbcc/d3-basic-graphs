import React, { useRef, useState, useEffect } from "react";
import { select } from "d3";
import "./line.css";

function Line() {
  const [data, setData] = useState([21, 5, 14, 33, 12]);
  const svgRef = useRef();

  useEffect(() => {
    const svg = select(svgRef.current);
    svg
      .selectAll("circle")
      .data(data)
      .join(
        (enter) =>
          enter
            .append("circle")
            .attr("class", "new")
            .attr("r", (value) => value)
            .attr("cx", (value) => value * 2)
            .attr("cy", (value) => value * 2)
            .attr("stroke", "blue"),
        (update) =>
          update
            .attr("class", "updated")
            .attr("r", (value) => value)
            .attr("cx", (value) => value * 2)
            .attr("cy", (value) => value * 2),
        (exit) => exit.remove()
      );
  }, [data]);

  return (
    <React.Fragment>
      <svg ref={svgRef}></svg>
      <br />
      <button onClick={() => setData(data.map((value) => value + 2))}>
        Update data
      </button>
    </React.Fragment>
  );
}

export default Line;
