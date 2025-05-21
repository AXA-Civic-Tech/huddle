import { useRef, useEffect, useState } from "react";

/**
 * SearchBar component using Google Maps Places Autocomplete API.
 * Allows users to search for a location and returns selected place data,
 * including coordinates, formatted address, borough, and zipcode.
 *
 * @component
 * @param {Object} props - Component props
 * @param {function} props.onPlaceSelected - Callback function triggered when a place is selected.
 *        Receives an object containing `formatted_address`, `lat`, `lng`, `name`, `borough`, and `zipcode`.
 * @param {string} [props.placeholder="Search for a place..."] - Placeholder text for the input field.
 *
 * @returns {JSX.Element} A search input field enhanced with location autocomplete.
 */

const SearchBar = ({
  onPlaceSelected,
  placeholder = "Search for a place...",
}) => {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  /**
   * Initializes Google Places Autocomplete on the input element when the component mounts.
   *
   * Sets up the autocomplete to restrict suggestions to places in the US and limits
   * the fields returned for performance (geometry, name, formatted_address, and address_components).
   *
   * Adds a listener for the "place_changed" event, which triggers when a user selects a place.
   * When a place is selected, extracts relevant details including:
   * - formatted address
   * - latitude and longitude
   * - place name
   * - borough (if available)
   * - postal code (zipcode, if available)
   *
   * Calls the `onPlaceSelected` callback with the extracted address details.
   * Also updates the local input value state to reflect the selected place.
   *
   * Runs once on mount or when `onPlaceSelected` changes.
   */
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
