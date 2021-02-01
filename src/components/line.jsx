import React, { useRef, useState, useEffect } from "react";
import {
  select,
  line,
  axisBottom,
  axisLeft,
  curveCardinal,
  scaleLinear,
  pointer,
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
  const [data, setData] = useState([21, 5, 14, 33, 4, 50, 22, 14, 43, 32]);
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
    const yScale = scaleLinear().domain([0, 75]).range([graphHeight, 0]);
    const xAxis = axisBottom(xScale)
      .ticks(data.length)
      .tickFormat((index) => index + 1);
    const yAxis = axisLeft(yScale);

    // Scales join
    svg
      .select(".x-axis")
      .style("transform", `translateY(${graphHeight}px)`)
      .call(xAxis);
    svg.select(".y-axis").call(yAxis);

    // Generates d attr of path element
    const myLine = line()
      .x((value, index) => xScale(index))
      .y(yScale)
      .curve(curveCardinal);

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

    svg.selectAll("path").on("touchmove mousemove", (event, d) => {
      const coords = pointer(event);

      tooltip
        .attr("transform", `translate(${coords[0]},${coords[1]})`)
        .style("display", null)
        .selectAll("text")
        .data([`${coords[1]},${coords[0]}`])
        .join("text")
        .text(d)
        .attr("class", "tooltip")
        .selectAll("path")
        .data([null])
        .join("path")
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr(
          "d",
          `M${-50 / 2 - 10},5H-5l5,-5l5,5H${50 / 2 + 10}v${40 + 20}h-${
            50 + 20
          }z`
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
