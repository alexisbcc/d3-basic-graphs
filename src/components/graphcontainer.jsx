import React from 'react';
import './graphcontainer.css';
// Components
import Line from './line.jsx';

function GraphContainer() {
  return (
    <div className="container">
        <div className="item">
          <Line/>
        </div>
        <div className="item">
          <Line/>
        </div>
    </div>
  );
}

export default GraphContainer;
