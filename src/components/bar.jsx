import React, { useRef, useState, useEffect } from 'react';
import { select, line, axisBottom, axisLeft, curveCardinal, scaleLinear, scaleBand } from 'd3';
import './line.css';


function Bar(){

  const [data, setData] = useState([21, 5, 14, 33, 4, 50, 22, 14, 43, 32]);
  const svgRef = useRef();

  const graphWidth = 500;
  const graphHeight = 200;

  useEffect(() => {
    const svg = select(svgRef.current);

    const xScale = scaleBand().domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).range([0, graphWidth]);
    const yScale = scaleLinear().domain([0, 75]).range([graphHeight, 0])
    const xAxis = axisBottom(xScale).ticks(data.length);
    const yAxis = axisLeft(yScale);

    svg.select(".x-axis").style("transform", `translateY(${graphHeight}px)`).call(xAxis);
    svg.select(".y-axis").call(yAxis);



  }, [data]);

  return(
    <React.Fragment>
      <svg ref={svgRef}>
        <g className="x-axis"/>
        <g className="y-axis"/>
      </svg>
      <br/>
      <button onClick={() => setData(data.map(value => value+2))}>
        Update data
      </button>
    </React.Fragment>
  );
}

export default Bar;
