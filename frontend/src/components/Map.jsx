import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { getAllPosts } from '../adapters/post-adapter';

//doing height with a % bugs map
const containerStyle = {
  width: '100%',
  height: '1000px',
};

//center where map loads
const center = {
  lat: 40.657980,
  lng: -74.005439,
};

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const Map = () => {
  const [markers, setMarkers] = useState([]);

  //fetches all post and filters out for locations to pin
  useEffect(() => {
    getAllPosts().then(([data, error]) => {
      if (data) {
        const eventMarkers = data
          .filter(event => event.lat_location && event.long_location)
          .map(event => ({
            id: event.id,
            position: {
              lat: parseFloat(event.lat_location),
              lng: parseFloat(event.long_location),
            },
          }));
        setMarkers(eventMarkers);
      }
    });
  }, []);

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
      >
        {markers.map(marker => (
          <Marker key={marker.id} position={marker.position} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
