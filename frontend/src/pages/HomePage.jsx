import Feed from "../components/Feed";
import Map from "../components/Map";
import SearchBar from "../components/SearchBar";

/**
 * HomePage should be shown on '/'
 * User can view Map and Feed and interact with them
 * Depending on the user is logged in or not, the buttons in the NavBar will determine that
 * @returns
 */

export default function HomePage() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <>
      <div className="map-feed">
        <Feed />
      </div>
      <SearchBar apiKey={apiKey} />
      <Map />
    </>
  );
}
