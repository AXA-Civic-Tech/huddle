import { SquarePlus } from "lucide-react";
import FilterSelect from "./FilterSelect";
import SortSelect from "./SortSelect";

/**
 * Feed controls component that provides filtering, sorting, and post creation functionality
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.filterType - The current filter type (e.g., 'tag', 'user')
 * @param {string} props.filterValue - The current filter value
 * @param {string} props.sort - The current sort method
 * @param {Function} props.onFilterChange - Callback function when filter is changed
 * @param {Function} props.onSortChange - Callback function when sort method is changed
 * @param {Function} props.onNewPost - Callback function when new post button is clicked
 * @param {Object|null} props.currentUser - Current user object, null if not logged in
 * @param {boolean} props.isViewing - Whether user is viewing another user's profile
 * @param {string} props.pathname - Current path name from router
 * @returns {JSX.Element} The rendered FeedControls component
 */

export default function FeedControls({
  filterType,
  filterValue,
  sort,
  onFilterChange,
  onSortChange,
  onNewPost,
  currentUser,
  isViewing,
  pathname,
}) {
  return (
    <div className="feed-controls">
      {/* Filter Dropdown */}
      <FilterSelect
        value={`${filterType}:${filterValue}`}
        onChange={onFilterChange}
        currentUser={currentUser}
        pathname={pathname}
      />

      {/* Sort Dropdown */}
      <SortSelect value={sort} onChange={onSortChange} />

      {currentUser && !isViewing && (
        // Only show this button when not vewing another user's profile
        <SquarePlus
          alt="Create New Post"
          className="add-icon"
          onClick={onNewPost}
        />
      )}
    </div>
  );
}
