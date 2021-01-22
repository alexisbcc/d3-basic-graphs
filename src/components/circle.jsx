import React, { useRef, useState, useEffect } from 'react';
import { select } from 'd3';
import './line.css';


function Line(){

  const [radius, setRadius] = useState([21, 5, 14, 33, 4]);
  const svgRef = useRef();

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll("circle")
       .data(radius)
       .join("circle")
       .attr("r", value => value)
       .attr("cx", value => value*2)
       .attr("cy", value => value*2)
       .attr("stroke", "blue");

  }, [radius]);

  return(
    <React.Fragment>
      <svg ref={svgRef}>
      </svg>
      <br/>
      <button onClick={() => setRadius(radius.map(value => value+2))}>
        Update data
      </button>
    </React.Fragment>
  );
}

export default Line;
