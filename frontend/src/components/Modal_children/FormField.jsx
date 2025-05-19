import { useRef } from "react";
import SearchBar from "../SearchBar";

/**
 * Reusable form input component that supports various input types.
 * Handles text inputs, textareas, select dropdowns, and other HTML input types.
 *
 * @param {string} name - Field name/id attribute
 * @param {string} label - Display label for the field
 * @param {string} type - Input type (text, textarea, select, email, etc.)
 * @param {any} value - Current field value
 * @param {Function} onChange - Handler for value changes
 * @param {Array} options - Options for select fields [{value, label}]
 * @param {Object} props - Additional HTML input attributes
 * @returns {JSX.Element} Formatted form field with label
 */

export default function FormField({
  name,
  label,
  type = "text",
  value,
  onChange,
  options,
  ...props
}) {
  // const inputRef = useRef(null);
  // const isAddress = name === "address" || label === "Address";

  // const handlePlaceSelected = (addressDetails) => {
  //   // Extract all needed address components from SearchBar
  //   const formattedAddress = {
  //     address: addressDetails.formatted_address,
  //     borough: addressDetails.borough,
  //     zipcode: addressDetails.zipcode,
  //     lat_location: addressDetails.lat,
  //     long_location: addressDetails.lng,
  //   };

  //   // Pass back all address details through onChange
  //   onChange({
  //     target: {
  //       name,
  //       value: formattedAddress,
  //     },
  //   });
  // };

  /**
   * Render the appropriate input element based on field type
   * Supports textarea, select, and standard input types
   */
  const renderField = () => {
    if (type === "textarea") {
      return (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          {...props}
        />
      );
    } else if (type === "select") {
      return (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          {...props}
        >
          {options &&
            options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
      );
      // } else if (isAddress) {
      //   return (
      //     <SearchBar
      //       onPlaceSelected={handlePlaceSelected}
      //       placeholder="Search for an address..."
      //       {...props}
      //     />
      //   );
    } else {
      return (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          {...props}
        />
      );
    }
  };
  return (
    <div className="field display-field">
      <span className="field-value">
        {/* <label htmlFor={name}>
          <strong>{label}:</strong>
        </label>{" "} */}
        {renderField()}
      </span>
    </div>
  );
}
