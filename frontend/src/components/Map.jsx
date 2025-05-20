import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { getAllPosts } from "../adapters/post-adapter";
import Modal from "./Modal";
import SearchBar from "./SearchBar";

//doing height with a % bugs map
const containerStyle = {
  width: "100%",
  height: "1000px",
};

//center where map loads
const center = {
  lat: 40.65798,
  lng: -74.005439,
};

const Map = ({ mapCenter, mapZoom, onMapMove, refreshTrigger }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventData, setEventData] = useState([]);
  const [searchMarker, setSearchMarker] = useState(null);
  const [isMapApiLoaded, setIsMapApiLoaded] = useState(false);
  const mapRef = useRef(null);
  const clustererRef = useRef(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <div className="api-key-error">Error: Missing Google Maps API key. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file.</div>;
  }

  //fetches all post and filters out for locations to pin with clusters and markers
  const loadMarkers = (map, events) => {
    if (!window.google || !map) return;

    // Clear previous clusters if any
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }

    const markers = events
      .filter((event) => event.lat_location && event.long_location)
      .map((event) => {
        let iconUrl = "/event-marker.png";
        if (event.status === false) {
          iconUrl = "/closed-marker.png";
        } else if (event.is_issue === true) {
          iconUrl = "/issue-marker.png";
        }
        const marker = new window.google.maps.Marker({
          position: {
            lat: parseFloat(event.lat_location),
            lng: parseFloat(event.long_location),
          },
          icon: {
            url: iconUrl,
            scaledSize: new window.google.maps.Size(48, 48),
          },
        });

        marker.addListener("click", () => {
          setSelectedEvent(event);
          setIsModalOpen(true);
        });

        return marker;
      });

    clustererRef.current = new MarkerClusterer({ markers, map });
  };

  useEffect(() => {
    getAllPosts().then(([data]) => {
      if (data) {
        setEventData(data);
        if (mapRef.current) {
          loadMarkers(mapRef.current, data);
        }
      }
    });
  }, [refreshTrigger]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="map" style={{ position: "relative" }}>
      <LoadScript
        googleMapsApiKey={apiKey}
        libraries={["places"]}
        onLoad={() => setIsMapApiLoaded(true)}
      >
        {isMapApiLoaded && (
          <>
            <SearchBar
              onPlaceSelected={(location) => {
                setSearchMarker(location);
                if (onMapMove) onMapMove(location, 15);
              }}
            />
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter || center}
              zoom={mapZoom || 12}
              onLoad={(map) => {
                mapRef.current = map;
                if (eventData.length) {
                  loadMarkers(map, eventData);
                }
              }}
              options={{
                disableDefaultUI: true,
                mapTypeControl: true,
                mapTypeControlOptions: {
                  position: window.google.maps.ControlPosition.TOP_RIGHT,
                },
              }}
            >
              {searchMarker && (
                new window.google.maps.Marker({
                  position: {
                    lat: searchMarker.lat,
                    lng: searchMarker.lng,
                  },
                  map: mapRef.current,
                  icon: {
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  },
                })
              )}
            </GoogleMap>
          </>
        )}
      </LoadScript>

      {selectedEvent && (
        <Modal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          viewing={true}
        />
      )}
    </div>
  );
};

export default Map;