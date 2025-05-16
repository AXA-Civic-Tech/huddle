// implement a search bar that will hover over the map
// try and implement functionality that will allow a user to search for our custom markers

import React, { useRef, useEffect, useState } from "react";

const SearchBar = ({ onPlaceSelected, events = [], onEventSelected }) => {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields: ["geometry", "name"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          name: place.name,
        };
        onPlaceSelected(location);
        setShowDropdown(false);
      }
    });
  }, [onPlaceSelected]);

  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredEvents([]);
      setShowDropdown(false);
      return;
    }
    const filtered = events.filter(event =>
      event.title && event.title.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredEvents(filtered);
    setShowDropdown(filtered.length > 0);
  }, [inputValue, events]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowDropdown(true);
  };

  const handleEventClick = (event) => {
    setInputValue(event.title);
    setShowDropdown(false);
    if (onEventSelected) {
      onEventSelected(event);
    }
  };

  return (
    <div style={{ position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)", zIndex: 1000 }}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search places or events..."
        style={{
          width: "300px",
          height: "40px",
          fontSize: "16px",
          padding: "0 12px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
        onFocus={() => { if (filteredEvents.length > 0) setShowDropdown(true); }}
        autoComplete="off"
      />
      {showDropdown && filteredEvents.length > 0 && (
        <div style={{
          position: "absolute",
          top: "42px",
          left: 0,
          width: "100%",
          background: "#fff",
          border: "1px solid #ccc",
          borderTop: "none",
          maxHeight: "200px",
          overflowY: "auto",
          zIndex: 1001,
        }}>
          {filteredEvents.map(event => (
            <div
              key={event.id}
              onClick={() => handleEventClick(event)}
              style={{ padding: "8px 12px", cursor: "pointer" }}
              onMouseDown={e => e.preventDefault()}
            >
              {event.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
