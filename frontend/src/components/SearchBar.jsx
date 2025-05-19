import { useRef, useEffect, useState } from "react";

const SearchBar = ({
  onPlaceSelected,
  placeholder = "Search for a place...",
}) => {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        fields: ["geometry", "name", "formatted_address", "address_components"],
        componentRestrictions: { country: "us" },
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        let addressDetails = {
          formatted_address: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          name: place.name,
          borough: "",
          zipcode: "",
        };

        // Extract borough and zipcode
        if (place.address_components) {
          place.address_components.forEach((component) => {
            const type = component.types[0];
            if (type === "sublocality_level_1") {
              addressDetails.borough = component.long_name;
            }
            if (type === "postal_code") {
              addressDetails.zipcode = component.long_name;
            }
          });
        }

        onPlaceSelected(addressDetails);
        setInputValue(place.formatted_address);
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
        placeholder={placeholder}
        className="searchbar-input"
        autoComplete="on"
      />
    </div>
  );
};

export default SearchBar;
