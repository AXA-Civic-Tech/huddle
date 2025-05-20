import React from "react";

export default function MapLegend() {
  return (
    <div>
      <div className="legend-row">
        <img src="/event-marker2.png" alt="Event" />
        <span>Event</span>
      </div>
      <div className="legend-row">
        <img src="/issue-marker.png" alt="Issue" />
        <span>Issue</span>
      </div>
      <div className="legend-row">
        <img src="/closed-marker.png" alt="Closed" />
        <span>Closed</span>
      </div>
    </div>
  );
} 