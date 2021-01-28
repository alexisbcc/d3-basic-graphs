import React, { useRef, useState, useEffect } from "react";
import { select, axisBottom, axisLeft, scaleLinear, scaleBand } from "d3";
import "./bar.css";

const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState(null);
  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach(entry => {
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

function Bar() {
  const [data, setData] = useState([21, 5, 14, 33, 4, 50, 22, 14, 43, 32]);
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;
    const xScale = scaleBand()
      .domain(data.map((value, index) => index))
      .range([0, dimensions.width])
      .padding(0.2);

    const yScale = scaleLinear().domain([0, 75]).range([150, 0]);

    const colorScale = scaleLinear()
      .domain([0, 40, 80])
      .range(["green", "orange", "red"])
      .clamp(true);

    const xAxis = axisBottom(xScale).ticks(data.length);
    const yAxis = axisLeft(yScale);

    svg
      .select(".x-axis")
      .style("transform", `translateY(${150}px)`)
      .call(xAxis);
    svg.select(".y-axis").call(yAxis);
    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .style("transform", "scale(1, -1)")
      .attr("x", (value, index) => xScale(index))
      .attr("y", -150)
      .attr("width", xScale.bandwidth())
      .transition()
      .attr("fill", colorScale)
      .attr("height", (value) => 150 - yScale(value));
  }, [data, dimensions]);
  return (
    <div ref={wrapperRef} className="bar-container">
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default Bar;
