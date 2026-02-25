const { fetchStationData } = require("./didService");
const { fetchThunderstormData } = require("./weatherService");
const { getSeverityRank } = require("../utils/severityRank");
const { isCacheValid, getCache, setCache } = require("../utils/cache");
const { calculateDistance } = require("../utils/distance");

async function getRiskData(input) {
  let stations;
  let thunderData;

  // Cache check
  if (isCacheValid()) {
    console.log("Using cached data...");
    const cached = getCache();
    stations = cached.stations;
    thunderData = cached.thunderData;
  } else {
    console.log("Fetching fresh data...");
    const rawStations = await fetchStationData();
    stations = Array.isArray(rawStations)
      ? rawStations
      : rawStations.aaData || rawStations.data || [];

    thunderData = await fetchThunderstormData();
    setCache({ stations, thunderData });
  }

  // Remove invalid stations
  const validStations = stations.filter(station =>
    station.m !== "-9999" &&
    station.ee === "ON"
  );

  let selectedStation;

  // If lat/lng provided
  if (input.lat && input.lng) {
    const userLat = parseFloat(input.lat);
    const userLng = parseFloat(input.lng);

    validStations.forEach(station => {
      station.distance = calculateDistance(
        userLat,
        userLng,
        parseFloat(station.c),
        parseFloat(station.d)
      );
    });

    selectedStation = validStations.reduce((prev, current) =>
      current.distance < prev.distance ? current : prev
    );

  } else if (input.state && input.district) {

    const filtered = validStations.filter(station =>
      station.f === input.state.toUpperCase() &&
      station.e.toLowerCase() === input.district.toLowerCase()
    );

    if (filtered.length === 0) {
      return {
        riskLevel: "Low",
        message: "No stations found for this area."
      };
    }

    selectedStation = filtered.reduce((prev, current) =>
      getSeverityRank(current.n) > getSeverityRank(prev.n)
        ? current
        : prev
    );

  } else {
    throw new Error("Provide either (state + district) OR (lat + lng)");
  }

  const activeStorm = thunderData.find(alert =>
    alert.Msg_EN?.toLowerCase().includes(selectedStation.f.toLowerCase())
  );

  let finalRisk = selectedStation.n;

  if (selectedStation.n === "Danger" && activeStorm) {
    finalRisk = "Critical";
  }

  return {
    riskLevel: finalRisk,
    location: `${selectedStation.e}, ${selectedStation.f}`,

    coordinates: {
      lat: parseFloat(selectedStation.c),
      lng: parseFloat(selectedStation.d)
    },

    station: {
      name: selectedStation.b,
      lat: parseFloat(selectedStation.c),
      lng: parseFloat(selectedStation.d),
      waterLevel: parseFloat(selectedStation.m),
      threshold: parseFloat(selectedStation.o),
      trend: selectedStation.s,
      lastUpdated: selectedStation.q,
      distanceKm: selectedStation.distance
        ? selectedStation.distance.toFixed(2)
        : null
    },

    weather: {
      thunderstormActive: !!activeStorm
    },

    cached: isCacheValid()
  };
}

module.exports = { getRiskData };