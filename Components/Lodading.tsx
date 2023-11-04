import React from "react";

export default function Loading({ textSize = "text-base", textColor = "text-white", height="", margin=""}) {
  return (
    <div className={`flex ${height} ${margin}`}>
      <div className="m-auto">
        <i
          className={`fas fa-circle-notch fa-spin text ${textColor} ${textSize}`}
        ></i>
      </div>
    </div>
  );
}
