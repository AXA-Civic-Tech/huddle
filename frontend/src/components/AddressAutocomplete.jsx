import React, { useRef, useEffect } from "react";

const AddressAutocomplete = ({ value, onAddressSelect }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      componentRestrictions: { country: "us" },
      fields: ["formatted_address", "address_components"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        // Extract borough and zipcode if possible
        let borough = "";
        let zipcode = "";
        place.address_components.forEach(comp => {
          if (comp.types.includes("postal_code")) zipcode = comp.long_name;
          if (
            comp.types.includes("sublocality_level_1") ||
            comp.types.includes("locality")
          ) borough = comp.long_name;
        });
        onAddressSelect({
          address: place.formatted_address,
          borough,
          zipcode,
        });
      }
    });
  }, [onAddressSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={e => onAddressSelect({ address: e.target.value })}
      placeholder="Start typing address..."
      autoComplete="off"
      className="form-input"
    />
  );
};

export default AddressAutocomplete; 