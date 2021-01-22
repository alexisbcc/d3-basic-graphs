import React, { useRef, useEffect } from 'react';
import './line.css';
function Line(){

  const svgRef = useRef();

  useEffect(() => {
    console.log(svgRef);
  }, []);

  return(
    <svg ref={svgRef}>
    </svg>
  );
}

export default Line;
