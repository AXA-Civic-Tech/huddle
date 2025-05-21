/**
 * A search input field component for filtering community posts.
 * Provides a clean, styled text input with customizable placeholder text.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.value - Current search input value
 * @param {Function} props.onChange - Event handler for input changes
 * @param {string} [props.placeholder="Search community posts..."] - Custom placeholder text for the input
 * @returns {JSX.Element} Search input component
 */

export default function EventSearchBar({ value, onChange, placeholder }) {
  return (
    <div className="event-searchbar-container">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Search community posts..."}
        className="searchbar-input"
        autoComplete="off"
      />
    </div>
  );
}
