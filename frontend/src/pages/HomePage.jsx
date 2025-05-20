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

  // Close modal on Escape key press
  useEffect(() => {
    const onEscKey = (event) => {
      if (event.key === "Escape" && authOverlayOpen) {
        closeAuthOverlay();
      }
    };
    window.addEventListener("keydown", onEscKey);
    return () => window.removeEventListener("keydown", onEscKey);
  }, [authOverlayOpen, closeAuthOverlay]);

  const handleMapMove = (center, zoom) => {
    setMapCenter(center);
    if (zoom) setMapZoom(zoom);
  };

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
