// const { fetchStationData } = require("./didService");
// const { fetchThunderstormData } = require("./weatherService");
// const { getSeverityRank } = require("../utils/severityRank");

// async function getRiskData(state, district) {
//   const stations = await fetchStationData();

//   // Filter by state & district
//   const filtered = stations.filter(station =>
//     station.f === state.toUpperCase() &&
//     station.e.toLowerCase() === district.toLowerCase() &&
//     station.m !== "-9999" &&
//     station.ee === "ON"
//   );

//   if (filtered.length === 0) {
//     return { riskLevel: "Low", message: "No active stations found." };
//   }

//   // Find highest severity station
//   const highest = filtered.reduce((prev, current) =>
//     getSeverityRank(current.n) > getSeverityRank(prev.n) ? current : prev
//   );

//   const thunderstorms = await fetchThunderstormData();

//   const activeStorm = thunderstorms.find(alert =>
//     alert.Msg_EN.toLowerCase().includes(state.toLowerCase())
//   );

//   let finalRisk = highest.n;

//   if (highest.n === "Danger" && activeStorm) {
//     finalRisk = "Critical";
//   }

//   return {
//     riskLevel: finalRisk,
//     station: highest.b,
//     waterLevel: highest.m,
//     trend: highest.s,
//     lastUpdated: highest.q,
//     thunderstorm: activeStorm ? true : false
//   };
// }

// module.exports = { getRiskData };

// VERSION 2 I GUESS
// services/riskCalculator.js (Improved)
// improve to make it production-level.

// const { fetchStationData } = require("./didService");
// const { fetchThunderstormData } = require("./weatherService");
// const { getSeverityRank } = require("../utils/severityRank");

// async function getRiskData(state, district) {
//   if (!state || !district) {
//     throw new Error("State and district are required");
//   }

//   const rawStations = await fetchStationData();

//   // If data wrapped in object, adjust here if needed
//   const stations = Array.isArray(rawStations)
//     ? rawStations
//     : rawStations.aaData || rawStations.data || [];

//   // Filter relevant stations
//   const filtered = stations.filter(station =>
//     station.f === state.toUpperCase() &&
//     station.e.toLowerCase() === district.toLowerCase() &&
//     station.m !== "-9999" &&
//     station.ee === "ON"
//   );

//   if (filtered.length === 0) {
//     return {
//       riskLevel: "Low",
//       location: `${district}, ${state}`,
//       message: "No active monitoring stations found.",
//       stationsAnalyzed: 0
//     };
//   }

//   // Get most severe station
//   const highest = filtered.reduce((prev, current) =>
//     getSeverityRank(current.n) > getSeverityRank(prev.n)
//       ? current
//       : prev
//   );

//   // Fetch thunderstorm alerts
//   const thunderData = await fetchThunderstormData();

//   const activeStorm = thunderData.find(alert =>
//     alert.Msg_EN?.toLowerCase().includes(state.toLowerCase())
//   );

//   let finalRisk = highest.n;

//   if (highest.n === "Danger" && activeStorm) {
//     finalRisk = "Critical";
//   }

//   return {
//     riskLevel: finalRisk,
//     location: `${district}, ${state}`,
//     station: {
//       name: highest.b,
//       waterLevel: parseFloat(highest.m),
//       threshold: parseFloat(highest.o),
//       exceededBy: parseFloat(highest.p),
//       trend: highest.s,
//       lastUpdated: highest.q
//     },
//     weather: {
//       thunderstormActive: !!activeStorm
//     },
//     stationsAnalyzed: filtered.length,
//     dataSource: "DID + MET Malaysia"
//   };
// }

// module.exports = { getRiskData };


// VERSION 3 MEOW RAWR
// after add cache.js

// const { fetchStationData } = require("./didService");
// const { fetchThunderstormData } = require("./weatherService");
// const { getSeverityRank } = require("../utils/severityRank");
// const { isCacheValid, getCache, setCache } = require("../utils/cache");

// async function getRiskData(state, district) {
//   if (!state || !district) {
//     throw new Error("State and district are required");
//   }

//   let stations;
//   let thunderData;

//   // 🔥 Check cache first
//   if (isCacheValid()) {
//     console.log("Using cached data...");
//     const cached = getCache();
//     stations = cached.stations;
//     thunderData = cached.thunderData;
//   } else {
//     console.log("Fetching fresh data...");
//     const rawStations = await fetchStationData();
//     stations = Array.isArray(rawStations)
//       ? rawStations
//       : rawStations.aaData || rawStations.data || [];

//     thunderData = await fetchThunderstormData();

//     setCache({ stations, thunderData });
//   }

//   // Filter relevant stations
//   const filtered = stations.filter(station =>
//     station.f === state.toUpperCase() &&
//     station.e.toLowerCase() === district.toLowerCase() &&
//     station.m !== "-9999" &&
//     station.ee === "ON"
//   );

//   if (filtered.length === 0) {
//     return {
//       riskLevel: "Low",
//       location: `${district}, ${state}`,
//       message: "No active monitoring stations found.",
//       stationsAnalyzed: 0,
//       cached: isCacheValid()
//     };
//   }

//   const highest = filtered.reduce((prev, current) =>
//     getSeverityRank(current.n) > getSeverityRank(prev.n)
//       ? current
//       : prev
//   );

//   const activeStorm = thunderData.find(alert =>
//     alert.Msg_EN?.toLowerCase().includes(state.toLowerCase())
//   );

//   let finalRisk = highest.n;

//   if (highest.n === "Danger" && activeStorm) {
//     finalRisk = "Critical";
//   }

//   return {
//     riskLevel: finalRisk,
//     location: `${district}, ${state}`,
//     station: {
//       name: highest.b,
//       waterLevel: parseFloat(highest.m),
//       threshold: parseFloat(highest.o),
//       exceededBy: parseFloat(highest.p),
//       trend: highest.s,
//       lastUpdated: highest.q
//     },
//     weather: {
//       thunderstormActive: !!activeStorm
//     },
//     stationsAnalyzed: filtered.length,
//     cached: isCacheValid(),
//     dataSource: "DID + MET Malaysia"
//   };
// }

// module.exports = { getRiskData };



// VERSION 4 GRRR 
// after add distance.js
// coordinate version
// now allow 2 modes
// 1 - state + district
// 2 - Lat - longitude
// so modify getRiskData()

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

  // 🔥 If lat/lng provided
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
    station: {
      name: selectedStation.b,
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