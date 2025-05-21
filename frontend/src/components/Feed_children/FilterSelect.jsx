import { neighborhoodsByBorough } from "../../utils/neighborhoods";

/**
 * Component for handling filter selection in the feed interface
 * Renders a dropdown with options for filtering posts by various criteria including
 * status, type, borough, neighborhood, and upvoted posts (for users viewing their profiles)
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.value - Current filter value in format "filterType:filterValue"
 * @param {Function} props.onChange - Handler function called when filter selection changes
 * @param {Object|null} props.currentUser - Current user data, null if not logged in
 * @param {string} props.pathname - Current path from router
 * @returns {JSX.Element} The rendered FilterSelect component
 */

export default function FilterSelect({
  value,
  onChange,
  currentUser,
  pathname,
}) {
  /**
   * Generates neighborhood options grouped by borough
   * Converts the neighborhoodsByBorough object into JSX option elements
   * organized within optgroups for each borough
   *
   * @function
   * @returns {JSX.Element[]} Array of optgroup elements containing neighborhood options
   */
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
