import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// Map container styling
const containerStyle = {
  width: '100%',
  height: '1000px',
};

// Default map center (NYC)
const center = {
  lat: 40.657980,
  lng: -74.005439,
};

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const markers = [
    {id: 1, position: {lat: 40.657980, lng: -74.005439}}, //center location
    {id: 2, position: {lat: 40.7128000, lng: -74.0060000}},
    {id: 3, position: {lat: 40.6782000, lng: -73.9442000}},
    {id: 4, position: {lat: 40.5795000, lng: -74.1502000}},
    {id: 5, position: {lat: 40.8448000, lng: -73.8648000}}
];

const Map = () => {
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
