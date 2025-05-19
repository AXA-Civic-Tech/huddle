const axios = require("axios");
const knex = require("../db/knex"); // adjust path to your knex instance

const geocodeEvent = async (req, res, next) => {
  const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing Google Geocoding API key. Please set GOOGLE_GEOCODING_API_KEY in your environment." });
  }

  try {
    const { address, borough, zipcode } = req.body;
    const fullAddress = `${address}, ${borough}, NY ${zipcode}`;

    const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address: fullAddress,
        key: apiKey,
      },
    });

    const location = response.data.results[0]?.geometry?.location;
    if (!location) {
      return res.status(400).json({ error: "Invalid address or unable to geocode." });
    }

    let { lat, lng } = location;

    // Check for events at this same address
    const existingEvents = await knex("event")
      .where({ address, borough, zipcode });

    if (existingEvents.length > 0) {
      const offsetStep = 0.0001; // Roughly ~11 meters
      const offset = offsetStep * (existingEvents.length + 1);

      // Offset diagonally to keep things slightly spaced apart
      lat += offset;
      lng += offset;
    }

    req.body.lat_location = lat;
    req.body.long_location = lng;

    next();
  } catch (error) {
    console.error("Geocoding error:", error);
    res.status(500).json({ error: "Failed to geocode address" });
  }
};

module.exports = geocodeEvent;