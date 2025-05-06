import { useContext } from "react";
import Feed from "../components/Feed";
import Map from "../components/Map";

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
