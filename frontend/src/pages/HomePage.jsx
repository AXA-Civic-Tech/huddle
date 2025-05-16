import Feed from "../components/Feed";
import Map from "../components/Map";
import { useState } from "react";
import { neighborhoodCenters, boroughCenters } from "../utils/neighborhoodCenters";

/**
 * HomePage should be shown on '/'
 * User can view Map and Feed and interact with them
 * Depending on the user is logged in or not, the buttons in the NavBar will determine that
 * @returns
 */

export default function HomePage() {
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
      // Optionally reset map center/zoom here
    }
  };

  const handleMapMove = (location, zoom = 17) => {
    setMapCenter(location);
    setMapZoom(zoom);
  };

  return (
    <div className="homepage">
      <Feed filterType={filterType} filterValue={filterValue} onFilterChange={handleFilterChange} onMapMove={handleMapMove} />
      <Map mapCenter={mapCenter} mapZoom={mapZoom} onMapMove={handleMapMove} />
    </div>
  );
}
