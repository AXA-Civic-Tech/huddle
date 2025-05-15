// implement a search bar that will hover over the map
// try and implement functionality that will allow a user to search for our custom markers

import React, { useRef, useEffect } from "react";

const SearchBox = ({ onPlaceSelected }) => {
  const inputRef = useRef(null);

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
      }
    });
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Search places..."
      style={{
        width: "300px",
        height: "40px",
        fontSize: "16px",
        padding: "0 12px",
        position: "absolute",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        borderRadius: "4px",
        border: "1px solid #ccc",
      }}
    />
  );
};

export default SearchBox;
