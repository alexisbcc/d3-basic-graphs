import React, { useRef, useState, useEffect } from "react";
import {
  select,
  line,
  axisBottom,
  axisLeft,
  scaleLinear,
  pointer,
  bisector,
  max,
  min
} from "d3";
import "./line.css";

// Container observer to resize graph
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

function Line(props) {
  const { data, height } = props;

  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;

    // Scales
    const xScale = scaleLinear()
      .domain([min(data, (d) => d.x), max(data, (d) => d.x)])
      .range([0, dimensions.width]);
    const yScale = scaleLinear()
      .domain([min(data, (d) => d.y), max(data, (d) => d.y)])
      .range([height, 0]);
    const xAxis = axisBottom(xScale)
      .ticks(data.length)
      .tickFormat((index) => index);
    const yAxis = axisLeft(yScale)
      .ticks()
      .tickFormat((index) => index);

    // Axis
    svg
      .select(".x-axis")
      .style("transform", `translateY(${height}px)`)
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
      .attr("fill", "none")
      .attr("stroke", "rgb(89, 153, 255)")
      .attr("stroke-width", 2)
      .attr("d", (value) => myLine(value));

    // Tooltip
    const tooltip = svg
      .selectAll(".line-tooltip")
      .data([null])
      .join("g")
      .attr("class", "line-tooltip")
      .style("display", "none");

    svg.on("touchmove mousemove", (event) => {
      // Find the value of the closest point
      // Extract the data from the path element
      const lineData = svg.select(".line").data()[0];
      // Convert the corrdinate from pointer (range - screen space) to domain (data space)
      const domainXCoordinate = xScale.invert(pointer(event)[0]);
      // find the index to the closest value
      const index = bisector((d) => d.x).center(lineData, domainXCoordinate);

      tooltip
        .style("display", null)
        .transition()
        .duration(500)
        .attr(
          "transform",
          `translate(${xScale(lineData[index].x)},${yScale(lineData[index].y)})`
        )
        .style("pointer-events", "none")
        .style("font", "15px");

      const path = tooltip
        .selectAll("path")
        .data([null])
        .join("path")
        .attr("fill", "white")
        .attr("stroke", "black");

      const text = tooltip
        .selectAll("text")
        .data([lineData[index].y])
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
  }, [dimensions, data, height]);

  return (
    <div ref={wrapperRef} className="line-container">
      <svg ref={svgRef} height={height}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default Line;
