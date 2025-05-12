import { neighborhoodsByBorough } from "../../utils/neighborhoods";

/**
 * Component for handling filter selection
 * @param {Object} props - Component props
 * @param {string} props.value - Current filter value
 * @param {Function} props.onChange - Handler for filter changes
 * @param {Object} props.currentUser - Current user data
 * @param {string} props.pathname - Current path
 */

export default function FilterSelect({
  value,
  onChange,
  currentUser,
  pathname,
}) {
  const renderNeighborhoodOptions = () => {
    return Object.entries(neighborhoodsByBorough).map(
      ([borough, neighborhoods]) => (
        <optgroup key={borough} label={`Neighborhoods - ${borough}`}>
          {neighborhoods.map((neighborhood) => (
            <option key={neighborhood} value={`neighborhood:${neighborhood}`}>
              {neighborhood}
            </option>
          ))}
        </optgroup>
      )
    );
  };

  return (
    <div className="filter-section">
      <label htmlFor="filter-select">Filter: </label>
      <select id="filter-select" value={value} onChange={onChange}>
        <option value="all:">All Posts</option>

        {currentUser && pathname === `/users/${currentUser.id}` && (
          <option value="upvote:true">My Upvoted Posts</option>
        )}

        <optgroup label="Status">
          <option value="status:Active">Active</option>
          <option value="status:Closed">Closed</option>
        </optgroup>

        <optgroup label="Type">
          <option value="type:issue">Issues</option>
          <option value="type:event">Events</option>
        </optgroup>

        <optgroup label="Borough">
          <option value="borough:Manhattan">Manhattan</option>
          <option value="borough:Brooklyn">Brooklyn</option>
          <option value="borough:Queens">Queens</option>
          <option value="borough:Bronx">Bronx</option>
          <option value="borough:Staten Island">Staten Island</option>
        </optgroup>

        {renderNeighborhoodOptions()}
      </select>
    </div>
  );
}
