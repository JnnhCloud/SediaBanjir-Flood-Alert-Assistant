import React, { useState, useEffect } from "react";
import { LocationSelector } from "../components/LocationSelector";
import { AlertCard } from "../components/AlertCard";

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState({
    state: "",
    district: "",
    area: "",
  });
  const [riskData, setRiskData] = useState<any>(null);
  const [aiAdvice, setAiAdvice] = useState<string>("");

  const handleLocationChange = (state: string, district: string, area: string) => {
    setSelectedLocation({ state: state.toUpperCase(), district, area });
  };

  useEffect(() => {
    if (!selectedLocation.state || !selectedLocation.district) return;

    const fetchRiskAndAI = async () => {
      try {
        // Fetch backend risk data
        const response = await fetch("http://localhost:5000/api/check-risk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            state: selectedLocation.state,
            district: selectedLocation.district,
          }),
        });

        const data = await response.json();
        setRiskData(data);

        // Fetch AI advice
        const aiRes = await fetch("http://localhost:7000/api/generate-advice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: selectedLocation.area,
            riskLevel: data.riskLevel,
            station: data.station,
            weather: data.weather,
            language: "en",
          }),
        });

        const aiData = await aiRes.json();
        setAiAdvice(aiData.advice);
      } catch (error) {
        console.error("Error fetching risk or AI advice:", error);
      }
    };

    fetchRiskAndAI();
  }, [selectedLocation]);

  return (
    <main className="min-h-screen bg-neutral-200 px-5 py-10">
      <div className="max-w-[1200px] mx-auto">
        <LocationSelector onLocationChange={handleLocationChange} />

        {riskData && (
          <AlertCard
            alertData={{
              location: riskData.location,
              status: riskData.riskLevel,
              description: aiAdvice || `Water level is ${riskData.station.waterLevel}m and trend is ${riskData.station.trend}.`,
              waterLevel: `${riskData.station.waterLevel} m`,
              trend: riskData.station.trend,
              lastUpdated: riskData.station.lastUpdated,
              rainfall: riskData.metrics?.rainfall, // optional
              prediction: riskData.metrics?.prediction, // optional
            }}
          />
        )}
      </div>
    </main>
  );
};

export default Index;