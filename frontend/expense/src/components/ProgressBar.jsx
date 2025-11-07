import React from "react";

function ProgressBar({ category, amount }) {
  const max = 1500; 
  const percent = Math.min((amount / max) * 100, 100);

  return (
    <div className="progress-bar">
      <div className="label">
        <span>{category}</span>
        <span>{amount}</span>
      </div>
      <div className="bar">
        <div className="fill" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}

export default ProgressBar;
