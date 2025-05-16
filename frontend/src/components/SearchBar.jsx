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
    <div className="searchbar-container">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search places or events..."
        className="searchbar-input"
        onFocus={() => { if (filteredEvents.length > 0) setShowDropdown(true); }}
        autoComplete="off"
      />
      {showDropdown && filteredEvents.length > 0 && (
        <div className="searchbar-dropdown">
          {filteredEvents.map(event => (
            <div
              key={event.id}
              onClick={() => handleEventClick(event)}
              className="searchbar-dropdown-item"
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
