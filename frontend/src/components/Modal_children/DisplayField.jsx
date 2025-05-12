/**
 * Simple component for displaying a labeled field value in read-only format.
 * Used to consistently format field display across the application.
 *
 * @param {string} label - Display label for the field
 * @param {any} value - Field value to display
 * @returns {JSX.Element} Formatted label-value pair
 */

export default function DisplayField({ label, value }) {
  return (
    <div className="field">
      <strong>{label}:</strong>
      <p>{value}</p>
    </div>
  );
}
