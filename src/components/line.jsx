import React, { useRef, useState, useEffect } from "react";
import {
  select,
  line,
  axisBottom,
  axisLeft,
  curveCardinal,
  scaleLinear,
  pointer,
  bisector
} from "d3";
import { transition } from "d3-transition";
import "./line.css";

const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState(null);
  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });
    resizeObserver.observe(observeTarget);
    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);
  return dimensions;
};

function Line() {
  const [data, setData] = useState([
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
  ]);
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  const graphHeight = 150;

  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;

    // Scales
    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([0, dimensions.width]);
    const yScale = scaleLinear().domain([0, 60]).range([graphHeight, 0]);
    const xAxis = axisBottom(xScale)
      .ticks(data.length)
      .tickFormat((index) => index);
    const yAxis = axisLeft(yScale)
    .ticks(5);

    // Axis
    svg
      .select(".x-axis")
      .style("transform", `translateY(${graphHeight}px)`)
      .call(xAxis);
    svg.select(".y-axis").call(yAxis);

    // Generates d attr of path element
    const myLine = line()
      .x((value) => xScale(value.x))
      .y((value) => yScale(value.y));

    svg
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr("class", "line")
      .attr("d", (value) => myLine(value))
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2);

    // Tooltip
    const tooltip = svg.select(".line-tooltip").style("display", "none");

    svg.on("touchmove mousemove", (event) => {
      // Find the value of the closest point
      // Extract the data from the path element
      const lineData = svg.select(".line").data()[0];
      // Convert the corrdinate from pointer (range - svg dimensions) to domain
      const domainXCoordinate = xScale.invert(pointer(event)[0]);
      // find the index to the closest value
      const coords = bisector(d => d.x).center(lineData, domainXCoordinate);

      tooltip
        .attr(
          "transform",
          `translate(${xScale(lineData[coords].x)},${yScale(lineData[coords].y)})`
        )
        .style("display", null)
        .style("pointer-events", "none")
        .style("font", "10px sans-serif");

      const path = tooltip
        .selectAll("path")
        .data([null])
        .join("path")
        .attr("fill", "white")
        .attr("stroke", "black");

      const text = tooltip
        .selectAll("text")
        .data([lineData[coords].y])
        .join("text")
        .text((d) => d);

      const { x, y, width: w, height: h } = text.node().getBBox();

      text.attr("transform", `translate(${-w / 2},${15 - y})`);
      path.attr(
        "d",
        `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`
      );
    });

    svg.on("touchend mouseleave", () => tooltip.style("display", "none"));
  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} className="line-container">
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
        <g className="line-tooltip" />
      </svg>
      {/* <br/>
      <button onClick={() => setData(data.map(value => value+2))}>
        Update data
      </button> */}
    </div>
  );
}

export default Line;
