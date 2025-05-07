import React from 'react';
import './ComplexLoader.css';

const ComplexLoader = () => {
  return (
    <div className="complex-loader">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" />
        <circle cx="50" cy="50" r="35" />
        <circle cx="50" cy="50" r="25" />
        <circle cx="50" cy="50" r="15" />
      </svg>
    </div>
  );
};

export default ComplexLoader;