/**
 * Simple component for displaying a labeled field value in read-only format.
 * Used to consistently format field display across the application.
 *
 * @param {string} label - Display label for the field
 * @param {any} value - Field value to display
 * @returns {JSX.Element} Formatted label-value pair
 */

export default function DisplayField({ label, value }) {
  // Don't render anything if there's no value
  if (!value || value.trim?.() === "") {
    return null;
  }

  return (
    <div className="field display-field">
      <span className="field-value">
        <strong>{label}:</strong>{" "}
        {label === "Address" ? [...value].join(", ") : value}
      </span>
    </div>
  );
}
