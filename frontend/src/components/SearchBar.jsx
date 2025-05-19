import { useRef, useEffect, useState } from "react";

// Google Places-only search bar for the map
const SearchBar = ({ onPlaceSelected }) => {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        fields: ["geometry", "name"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          name: place.name,
        };
        onPlaceSelected(location);
        setInputValue(place.name);
      }
    });
  }, [onPlaceSelected]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="searchbar-container">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search for a place..."
        className="searchbar-input"
        autoComplete="off"
      />
    </div>
  );
};

export default SearchBar;
