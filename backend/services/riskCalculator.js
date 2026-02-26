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

  // ADVANCE
  const waterLevel = parseFloat(selectedStation.m);
  const threshold = parseFloat(selectedStation.o);

  const percentageOfThreshold = threshold
    ? (waterLevel / threshold) * 100
    : 0;

  const exceedMeters = waterLevel - threshold;

  const lastUpdated = new Date(selectedStation.q);
  const hoursSinceUpdate =
    (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60);
  
  // ADNVAMCE
  let riskScore = 0;

  // Water contribution (70%)
  riskScore += Math.min(percentageOfThreshold, 100) * 0.7;

  // Trend contribution (20%)
  if (selectedStation.s === "Rising") {
    riskScore += 20;
  }

  // Weather contribution (10%)
  if (activeStorm) {
    riskScore += 10;
  }

  riskScore = Math.min(Math.round(riskScore), 100);


  // ADVCNDE FINAL
  let finalRisk = "Low";

  if (riskScore >= 80) {
    finalRisk = "Severe";
  } else if (riskScore >= 60) {
    finalRisk = "Danger";
  } else if (riskScore >= 40) {
    finalRisk = "Warning";
  } else if (riskScore >= 20) {
    finalRisk = "Watch";
  }
    
  
  // NOW
  function extractSpecificPlace(stationName) {
    if (!stationName) return "";
    const match = stationName.split(" di ");
    return match.length > 1 ? match[1] : stationName;
  }

  const specificPlace = extractSpecificPlace(selectedStation.b);

  return {
    riskLevel: finalRisk,
    riskScore,

    location: {
      place: specificPlace,
      district: selectedStation.e,
      state: selectedStation.f,
      full: `${specificPlace}, ${selectedStation.e}, ${selectedStation.f}`
    },

    metrics: {
      waterLevel,
      threshold,
      percentageOfThreshold: Number(percentageOfThreshold.toFixed(1)),
      exceedMeters: Number(exceedMeters.toFixed(2)),
      trend: selectedStation.s,
      hoursSinceUpdate: Number(hoursSinceUpdate.toFixed(1))
    },

    station: {
      name: selectedStation.b,
      lat: parseFloat(selectedStation.c),
      lng: parseFloat(selectedStation.d),
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