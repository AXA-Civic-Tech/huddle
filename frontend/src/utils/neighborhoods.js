/**
 * Maps zipcodes to neighborhoods in NYC
 * This is a comprehensive mapping that can be expanded
 */
export const zipToNeighborhood = {
  // Manhattan
  10001: "Chelsea",
  10011: "Chelsea",
  10018: "Chelsea",
  10019: "Chelsea",
  10036: "Chelsea",
  10010: "Gramercy Park",
  10016: "Murray Hill",
  10017: "Murray Hill",
  10022: "Midtown East",
  10065: "Upper East Side",
  10021: "Upper East Side",
  10075: "Upper East Side",
  10028: "Upper East Side",
  10128: "Upper East Side",
  10023: "Upper West Side",
  10024: "Upper West Side",
  10025: "Upper West Side",
  10031: "Hamilton Heights",
  10032: "Washington Heights",
  10033: "Washington Heights",
  10034: "Inwood",
  10040: "Washington Heights",
  10027: "Harlem",
  10026: "Harlem",
  10030: "Harlem",
  10037: "Harlem",
  10039: "Harlem",
  10035: "East Harlem",
  10029: "East Harlem",
  10002: "Lower East Side",
  10003: "East Village",
  10009: "East Village",
  10012: "SoHo",
  10013: "Tribeca",
  10007: "Tribeca",
  10014: "West Village",
  10004: "Financial District",
  10005: "Financial District",
  10006: "Financial District",
  10038: "Financial District",
  10280: "Battery Park City",
  10282: "Battery Park City",

  // Brooklyn
  11201: "Brooklyn Heights",
  11205: "Fort Greene",
  11217: "Park Slope",
  11215: "Park Slope",
  11238: "Prospect Heights",
  11216: "Bedford-Stuyvesant",
  11221: "Bedford-Stuyvesant",
  11233: "Bedford-Stuyvesant",
  11211: "Williamsburg",
  11206: "Williamsburg",
  11222: "Greenpoint",
  11220: "Sunset Park",
  11232: "Sunset Park",
  11209: "Bay Ridge",
  11214: "Bath Beach",
  11228: "Dyker Heights",
  11223: "Gravesend",
  11224: "Coney Island",
  11229: "Sheepshead Bay",
  11235: "Brighton Beach",
  11234: "Canarsie",
  11236: "Canarsie",
  11239: "East New York",
  11207: "East New York",
  11208: "East New York",
  11212: "Brownsville",
  11213: "Crown Heights",
  11225: "Crown Heights",
  11226: "Flatbush",
  11203: "East Flatbush",
  11210: "Midwood",
  11230: "Midwood",
  11218: "Kensington",
  11219: "Borough Park",
  11204: "Bensonhurst",
  11231: "Carroll Gardens",
  11237: "Bushwick",
  11221: "Bushwick",

  // Queens
  11101: "Long Island City",
  11106: "Astoria",
  11102: "Astoria",
  11103: "Astoria",
  11105: "Astoria",
  11372: "Jackson Heights",
  11373: "Elmhurst",
  11368: "Corona",
  11369: "East Elmhurst",
  11370: "East Elmhurst",
  11377: "Woodside",
  11104: "Sunnyside",
  11378: "Maspeth",
  11385: "Ridgewood",
  11379: "Middle Village",
  11375: "Forest Hills",
  11374: "Rego Park",
  11367: "Kew Gardens Hills",
  11365: "Fresh Meadows",
  11366: "Fresh Meadows",
  11432: "Jamaica",
  11433: "Jamaica",
  11434: "Jamaica",
  11435: "Jamaica",
  11436: "Jamaica",
  11423: "Hollis",
  11428: "Queens Village",
  11429: "Queens Village",
  11411: "Cambria Heights",
  11413: "Springfield Gardens",
  11422: "Rosedale",
  11426: "Bellerose",
  11427: "Bellerose",
  11004: "Glen Oaks",
  11005: "Glen Oaks",
  11364: "Oakland Gardens",
  11361: "Bayside",
  11360: "Bayside",
  11362: "Little Neck",
  11363: "Little Neck",
  11358: "Flushing",
  11354: "Flushing",
  11355: "Flushing",
  11356: "College Point",
  11357: "Whitestone",
  11359: "Whitestone",
  11691: "Far Rockaway",
  11692: "Arverne",
  11693: "Far Rockaway",
  11694: "Rockaway Park",
  11695: "Breezy Point",
  11697: "Breezy Point",

  // Bronx
  10451: "South Bronx",
  10454: "Mott Haven",
  10455: "Mott Haven",
  10459: "Longwood",
  10474: "Hunts Point",
  10460: "West Farms",
  10472: "Soundview",
  10473: "Soundview",
  10462: "Parkchester",
  10461: "Morris Park",
  10465: "Throgs Neck",
  10464: "City Island",
  10469: "Baychester",
  10470: "Wakefield",
  10466: "Wakefield",
  10467: "Norwood",
  10468: "Fordham",
  10458: "Belmont",
  10457: "Tremont",
  10453: "Morris Heights",
  10452: "Highbridge",
  10456: "Melrose",
  10475: "Co-op City",
  10463: "Kingsbridge",
  10471: "Riverdale",

  // Staten Island
  10301: "St. George",
  10302: "Port Richmond",
  10303: "Mariners Harbor",
  10304: "Stapleton",
  10305: "South Beach",
  10306: "New Dorp",
  10307: "Tottenville",
  10308: "Great Kills",
  10309: "Charleston",
  10310: "West Brighton",
  10312: "Annadale",
  10314: "Bull's Head",
};

/**
 * Groups neighborhoods by borough for easier selection in UI
 */
export const neighborhoodsByBorough = {
  Manhattan: [
    "Battery Park City",
    "Chelsea",
    "East Harlem",
    "East Village",
    "Financial District",
    "Gramercy Park",
    "Greenwich Village",
    "Harlem",
    "Hamilton Heights",
    "Inwood",
    "Lower East Side",
    "Midtown East",
    "Murray Hill",
    "SoHo",
    "Tribeca",
    "Upper East Side",
    "Upper West Side",
    "Washington Heights",
    "West Village",
  ],

  Brooklyn: [
    "Bay Ridge",
    "Bedford-Stuyvesant",
    "Bensonhurst",
    "Borough Park",
    "Brighton Beach",
    "Brooklyn Heights",
    "Brownsville",
    "Bushwick",
    "Canarsie",
    "Carroll Gardens",
    "Coney Island",
    "Crown Heights",
    "Dyker Heights",
    "East Flatbush",
    "East New York",
    "Flatbush",
    "Fort Greene",
    "Gravesend",
    "Greenpoint",
    "Kensington",
    "Midwood",
    "Park Slope",
    "Prospect Heights",
    "Sheepshead Bay",
    "Sunset Park",
    "Williamsburg",
  ],

  Queens: [
    "Astoria",
    "Bayside",
    "Bellerose",
    "Cambria Heights",
    "College Point",
    "Corona",
    "East Elmhurst",
    "Elmhurst",
    "Far Rockaway",
    "Flushing",
    "Forest Hills",
    "Fresh Meadows",
    "Glen Oaks",
    "Hollis",
    "Jackson Heights",
    "Jamaica",
    "Kew Gardens Hills",
    "Little Neck",
    "Long Island City",
    "Maspeth",
    "Middle Village",
    "Oakland Gardens",
    "Queens Village",
    "Rego Park",
    "Ridgewood",
    "Rockaway Park",
    "Rosedale",
    "Sunnyside",
    "Springfield Gardens",
    "Whitestone",
    "Woodside",
  ],

  Bronx: [
    "Baychester",
    "Belmont",
    "City Island",
    "Co-op City",
    "Fordham",
    "Highbridge",
    "Hunts Point",
    "Kingsbridge",
    "Longwood",
    "Melrose",
    "Morris Heights",
    "Morris Park",
    "Mott Haven",
    "Norwood",
    "Parkchester",
    "Riverdale",
    "Soundview",
    "South Bronx",
    "Throgs Neck",
    "Tremont",
    "Wakefield",
    "West Farms",
  ],

  "Staten Island": [
    "Annadale",
    "Bull's Head",
    "Charleston",
    "Great Kills",
    "Mariners Harbor",
    "New Dorp",
    "Port Richmond",
    "South Beach",
    "St. George",
    "Stapleton",
    "Tottenville",
    "West Brighton",
  ],
};

/**
 * Gets neighborhood name from zipcode
 * @param {string} zipcode - The zipcode to look up
 * @returns {string} The corresponding neighborhood name or 'Unknown'
 */
export const getNeighborhoodFromZip = (zipcode) => {
  if (!zipcode) return "Unknown";
  return zipToNeighborhood[zipcode] || "Unknown";
};

/**
 * Gets all neighborhoods in a specific borough
 * @param {string} borough - Borough name
 * @returns {string[]} Array of neighborhood names
 */
export const getNeighborhoodsByBorough = (borough) => {
  if (!borough) return [];
  return neighborhoodsByBorough[borough] || [];
};

/**
 * Gets borough from zipcode
 * @param {string} zipcode - The zipcode to look up
 * @returns {string} The borough name or 'Unknown'
 */
export const getBoroughFromZip = (zipcode) => {
  if (!zipcode) return "Unknown";

  // Determine borough based on zipcode ranges
  const zip = parseInt(zipcode, 10);

  if (zip >= 10001 && zip <= 10282) return "Manhattan";
  if (zip >= 10451 && zip <= 10475) return "Bronx";
  if (zip >= 11201 && zip <= 11256) return "Brooklyn";
  if ((zip >= 11004 && zip <= 11109) || (zip >= 11351 && zip <= 11697))
    return "Queens";
  if (zip >= 10301 && zip <= 10314) return "Staten Island";

  return "Unknown";
};
