import { SquarePlus } from "lucide-react";
import FilterSelect from "./FilterSelect";
import SortSelect from "./SortSelect";
import Button from "../Button";

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
