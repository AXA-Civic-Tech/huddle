import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
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

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const Map = ({ mapCenter, mapZoom, onMapMove }) => {
  const [markers, setMarkers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventData, setEventData] = useState([]);
  const [searchMarker, setSearchMarker] = useState(null);

  //fetches all post and filters out for locations to pin
  useEffect(() => {
    getAllPosts().then(([data, error]) => {
      if (data) {
        setEventData(data);
        const eventMarkers = data
          .filter((event) => event.lat_location && event.long_location)
          .map((event) => ({
            id: event.id,
            position: {
              lat: parseFloat(event.lat_location),
              lng: parseFloat(event.long_location),
            },
            eventId: event.id,
          }));
        setMarkers(eventMarkers);
      }
    });
  }, []);

  const handleMarkerClick = (markerId) => {
    // Find the full event data for this marker
    const event = eventData.find((event) => event.id === markerId);
    if (event) {
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="map">
      <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
        <SearchBar 
          onPlaceSelected={(location) => {
            setSearchMarker(location);
            if (onMapMove) onMapMove(location, 15);
          }}
          events={eventData}
          onEventSelected={(event) => {
            const loc = { lat: parseFloat(event.lat_location), lng: parseFloat(event.long_location) };
            console.log("Event selected:", event, "Location:", loc);
            setSearchMarker(loc);
            setSelectedEvent(event);
            setIsModalOpen(true);
            if (!isNaN(loc.lat) && !isNaN(loc.lng) && onMapMove) onMapMove(loc, 15);
          }}
        />
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={mapZoom}
          options={
            window.google && window.google.maps
              ? {
                  disableDefaultUI: true,
                  mapTypeControl: true,
                  mapTypeControlOptions: {
                    position: window.google.maps.ControlPosition.TOP_RIGHT,
                  },
                }
              : {}
          }
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              onClick={() => handleMarkerClick(marker.id)}
            />
          ))}
          {searchMarker && (
            <Marker
              position={{ lat: searchMarker.lat, lng: searchMarker.lng }}
              icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
            />
          )}
        </GoogleMap>
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
