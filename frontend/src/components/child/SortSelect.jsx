/**
 * Component for handling sort selection
 * @param {Object} props - Component props
 * @param {string} props.value - Current sort value
 * @param {Function} props.onChange - Handler for sort changes
 */

export default function SortSelect({ value, onChange }) {
  return (
    <div className="sort-section">
      <label htmlFor="sort-select">Sort By: </label>
      <select id="sort-select" value={value} onChange={onChange}>
        <option value="recent">Most Recent</option>
        <option value="urgent">Most Upvotes</option>
      </select>
    </div>
  );
}
