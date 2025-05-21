import { useEffect, useState } from "react";
import Feed from "../components/Feed";
import Map from "../components/Map";
import {
  neighborhoodCenters,
  boroughCenters,
} from "../utils/neighborhoodCenters";

/**
 * HomePage component rendering the application's main landing page.
 * Displays a feed of events/issues alongside an interactive map.
 * Conditionally renders authentication overlays when needed.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.authOverlayOpen - Controls visibility of authentication overlay
 * @param {Function} props.closeAuthOverlay - Handler to close the authentication overlay
 * @param {Function} props.openAuthOverlay - Handler to open the authentication overlay
 *
 * @returns {JSX.Element} HomePage component with Feed, Map, and conditional auth overlay
 */

export default function HomePage({
  authOverlayOpen,
  closeAuthOverlay,
  openAuthOverlay,
}) {
  const [mapCenter, setMapCenter] = useState(boroughCenters["Brooklyn"]);
  const [mapZoom, setMapZoom] = useState(12);
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  /**
   * Effect to add a global keydown listener for Escape key.
   * Closes the authentication overlay if open when Escape is pressed.
   * Cleans up event listener on unmount or dependency change.
   */
  useEffect(() => {
    const onEscKey = (event) => {
      if (event.key === "Escape" && authOverlayOpen) {
        closeAuthOverlay();
      }
    };
    window.addEventListener("keydown", onEscKey);
    return () => window.removeEventListener("keydown", onEscKey);
  }, [authOverlayOpen, closeAuthOverlay]);

  /**
   * Handler for when the map moves.
   * Updates map center and optionally the zoom level.
   *
   * @param {Object} center - The new center coordinates { lat, lng }
   * @param {number} [zoom] - Optional new zoom level
   */
  const handleMapMove = (center, zoom) => {
    setMapCenter(center);
    if (zoom) setMapZoom(zoom);
  };

  /**
   * Handler for changes in the filter selection.
   * Parses filter type and value from selection, updates state,
   * and adjusts map center and zoom based on borough or neighborhood selection.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event from filter dropdown
   */
  const handleFilterChange = (e) => {
    const value = e.target.value;
    if (value.includes(":")) {
      const [type, val] = value.split(":");
      setFilterType(type);
      setFilterValue(val);

      // If borough is selected, center map on that borough
      if (type === "borough" && val && boroughCenters[val]) {
        setMapCenter(boroughCenters[val]);
        setMapZoom(12);
      }
      // If neighborhood is selected, center map on that neighborhood
      else if (type === "neighborhood" && val && neighborhoodCenters[val]) {
        setMapCenter(neighborhoodCenters[val]);
        setMapZoom(14);
      }
    } else {
      setFilterType("all");
      setFilterValue("");
    }
  };

  /**
   * Handler to trigger a refresh of posts/feed.
   * Increments the refreshTrigger state to cause refresh.
   */
  const handlePostUpdate = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="homepage">
      <div className={`homepage ${authOverlayOpen ? "disabled-blur" : ""}`}>
        <Feed
          filterType={filterType}
          filterValue={filterValue}
          onFilterChange={handleFilterChange}
          onMapMove={handleMapMove}
          openAuthOverlay={openAuthOverlay}
          authOverlayOpen={authOverlayOpen}
          onPostUpdate={handlePostUpdate}
        />
        <Map
          mapCenter={mapCenter}
          mapZoom={mapZoom}
          onMapMove={handleMapMove}
          refreshTrigger={refreshTrigger}
        />
      </div>
    </div>
  );
}
