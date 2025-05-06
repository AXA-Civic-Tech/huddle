import Feed from "../components/Feed";
import Map from "../components/Map";

/**
 * HomePage should be shown on '/' and '/main'
 * User can view Map and Feed and interact with them
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
