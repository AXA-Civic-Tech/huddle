import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { getAllPosts } from "../adapters/post-adapter";
import Modal from "./Modal";
import SearchBar from "./SearchBar";
import MapLegend from "./MapLegend";

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

    // Group events by lat/lng string
    const coordMap = {};
    events.forEach(event => {
      if (event.lat_location && event.long_location) {
        const key = `${event.lat_location},${event.long_location}`;
        if (!coordMap[key]) coordMap[key] = [];
        coordMap[key].push(event);
      }
    });

    const markers = [];
    const OFFSET_RADIUS = 0.00008; // ~8 meters, tweak as needed
    Object.entries(coordMap).forEach(([key, group]) => {
      if (group.length === 1) {
        // Only one event at this location
        const event = group[0];
        let iconUrl = "/event-marker2.png";
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
            scaledSize: new window.google.maps.Size(36, 36),
          },
        });
        marker.addListener("click", () => {
          setSelectedEvent(event);
          setIsModalOpen(true);
        });
        markers.push(marker);
      } else {
        // Multiple events at the same location, offset in a circle
        group.forEach((event, i) => {
          const angle = (2 * Math.PI * i) / group.length;
          const latOffset = Math.cos(angle) * OFFSET_RADIUS;
          const lngOffset = Math.sin(angle) * OFFSET_RADIUS;
          let iconUrl = "/event-marker2.png";
          if (event.status === false) {
            iconUrl = "/closed-marker.png";
          } else if (event.is_issue === true) {
            iconUrl = "/issue-marker.png";
          }
          const marker = new window.google.maps.Marker({
            position: {
              lat: parseFloat(event.lat_location) + latOffset,
              lng: parseFloat(event.long_location) + lngOffset,
            },
            icon: {
              url: iconUrl,
              scaledSize: new window.google.maps.Size(36, 36),
            },
          });
          marker.addListener("click", () => {
            setSelectedEvent(event);
            setIsModalOpen(true);
          });
          markers.push(marker);
        });
      }
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
      <MapLegend />
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