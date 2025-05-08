import Feed from "../components/Feed";
import Map from "../components/Map";

/**
 * HomePage should be shown on '/'
 * User can view Map and Feed and interact with them
 * Depending on the user is logged in or not, the buttons in the NavBar will determine that
 * @returns
 */

export default function HomePage() {
  return (
    <>
      <div className="map-feed">
        <Feed />
      </div>
      <Map />
    </>
  );
}
