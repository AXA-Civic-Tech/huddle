import { useEffect } from "react";
import Feed from "../components/Feed";
import Map from "../components/Map";
import { useState } from "react";
import { neighborhoodCenters, boroughCenters } from "../utils/neighborhoodCenters";

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
export default function HomePage({ authOverlayOpen, closeAuthOverlay }) {
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: 40.65798, lng: -74.005439 });
  const [mapZoom, setMapZoom] = useState(12);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    if (value.includes(":")) {
      const [type, val] = value.split(":");
      setFilterType(type);
      setFilterValue(val);
      if (type === "borough" && boroughCenters[val]) {
        setMapCenter(boroughCenters[val]);
        setMapZoom(12);
      } else if (type === "neighborhood" && neighborhoodCenters[val]) {
        setMapCenter(neighborhoodCenters[val]);
        setMapZoom(15);
      }
    } else {
      setFilterType("all");
      setFilterValue("");
    }
  };

  const handleMapMove = (location, zoom = 17) => {
    setMapCenter(location);
    setMapZoom(zoom);
  };

  return (
    <div className="homepage">
      <div className={`main-content ${authOverlayOpen ? "disabled-blur" : ""}`}>
        <Feed openAuthOverlay={openAuthOverlay} />
        <Map />
      </div>
    <div className={`homepage ${authOverlayOpen ? 'disabled-blur' : ''}`}>
      <Feed 
        filterType={filterType} 
        filterValue={filterValue} 
        onFilterChange={handleFilterChange} 
        onMapMove={handleMapMove} 
      />
      <Map 
        mapCenter={mapCenter} 
        mapZoom={mapZoom} 
        onMapMove={handleMapMove} 
      />
    </div>
  );
}
