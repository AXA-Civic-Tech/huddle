// middleware/geocodeEvent.js
const axios = require("axios");

const geocodeEvent = async (req, res, next) => {
  try {
    const { address, borough, zipcode } = req.body;
    const fullAddress = `${address}, ${borough}, NY ${zipcode}`;

    const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address: fullAddress,
        key: process.env.GOOGLE_GEOCODING_API_KEY,
      },
    });

    const location = response.data.results[0]?.geometry?.location;
    if (location) {
      req.body.lat_location = location.lat;
      req.body.long_location = location.lng;
    }

    next();
  } catch (error) {
    console.error("Geocoding error:", error);
    res.status(500).json({ error: "Failed to geocode address" });
  }
};

module.exports = geocodeEvent;