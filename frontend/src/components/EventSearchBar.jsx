import React from "react";

const EventSearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className="event-searchbar-container">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Search community posts..."}
        className="searchbar-input"
        autoComplete="off"
      />
    </div>
  );
};

export default EventSearchBar; 