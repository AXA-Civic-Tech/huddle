import { useState, useEffect, useRef } from "react";

export default function AddressForm({ apiKey, onAddressSelect }) {
  const [formData, setFormData] = useState({
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });

  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load the Google Maps script
  useEffect(() => {
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    googleMapScript.async = true;
    googleMapScript.defer = true;

    googleMapScript.addEventListener("load", () => {
      setScriptLoaded(true);
    });

    document.body.appendChild(googleMapScript);

    return () => {
      document.body.removeChild(googleMapScript);
    };
  }, [apiKey]);

  // Initialize Autocomplete
  useEffect(() => {
    if (scriptLoaded && inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { types: ["address"] }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();

        if (!place.geometry) {
          console.log("No details available for this place");
          return;
        }

        // Extract address components
        const addressComponents = place.address_components || [];
        const newFormData = { ...formData };

        // Process each address component and map to form fields
        addressComponents.forEach((component) => {
          const types = component.types;

          if (types.includes("street_number")) {
            newFormData.street_address =
              component.long_name + " " + newFormData.street_address;
          }

          //   if (types.includes("route")) {
          //     newFormData.street_address += component.long_name;
          //   }

          if (types.includes("locality")) {
            newFormData.city = component.long_name;
          }

          if (types.includes("administrative_area_level_1")) {
            newFormData.state = component.short_name;
          }

          if (types.includes("postal_code")) {
            newFormData.postal_code = component.long_name;
          }

          if (types.includes("country")) {
            newFormData.country = component.long_name;
          }
        });

        setFormData(newFormData);

        if (onAddressSelect) {
          onAddressSelect(newFormData);
        }
      });
    }
  }, [scriptLoaded, onAddressSelect, formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="field">
        <label htmlFor="street-address">
          <strong>Street Address</strong>
        </label>
        <input
          ref={inputRef}
          type="text"
          placeholder="Start typing your address"
          name="street_address"
          value={formData.street_address}
          onChange={handleChange}
          //   className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          // disabled={!scriptLoaded}
        />
      </div>

      <div className="field">
        <label htmlFor="city">
          <strong>City</strong>
        </label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          //   className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="field">
        <label htmlFor="state">
          <strong>State</strong>
        </label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          //   className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="field">
        <label htmlFor="postal-code">
          <strong>Postal Code</strong>
        </label>
        <input
          type="text"
          name="postal_code"
          value={formData.postal_code}
          onChange={handleChange}
          //   className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="field">
        <label htmlFor="country">
          <strong>Country</strong>
        </label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          //   className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
    </>
  );
}
