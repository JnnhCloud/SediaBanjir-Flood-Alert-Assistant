import React, { useState } from "react";
import LocationSelector from "../components/LocationSelector";
import FloodMap from "../components/FloodMap";

export default function Index() {
  const [language, setLanguage] = useState<"en" | "bm">("en");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [riskData, setRiskData] = useState<any>(null);
  const [aiAdvice, setAiAdvice] = useState<string>("");

  const [loading, setLoading] = useState(false);

  const handleCheckRisk = async () => {
    if (!selectedState || !selectedDistrict) {
      alert("Please select both state and district!");
      return;
    }

    const payload = {
      state: selectedState,
      district: selectedDistrict,
    };

    try {
      setLoading(true);

      // 1️⃣ Call backend /check-risk
      const res = await fetch("http://localhost:5000/api/check-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Backend request failed");
      const data = await res.json();
      setRiskData(data);

      // 2️⃣ Call Gemini AI for advice
      const aiPayload = {
        ...data,
        language, // now uses the user's selected language
      };

      const aiRes = await fetch("http://localhost:7000/api/generate-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiPayload),
      });
      if (!aiRes.ok) throw new Error("AI request failed");
      const aiData = await aiRes.json();
      setAiAdvice(aiData.advice);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to fetch risk or AI advice.");
    } finally {
      setLoading(false);
    }
  };

  function formatAIAdvice(text: string) {
    if (!text) return "";

    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")  // bold
      .replace(/^### (.*$)/gim, "<h4>$1</h4>")         // sub headings (###)
      .replace(/^---$/gim, "<hr>")                      // horizontal divider
      .replace(/^\* (.*$)/gim, "<li>$1</li>")           // bullet points (*/ -)
      .replace(/\n\n/g, "<br><br>");                    // paragraph spacing

    // Wrap <li> elements in <ul> if any
    if (/<li>/.test(formatted)) {
      formatted = formatted.replace(/(<li>.*<\/li>)/gis, "<ul>$1</ul>");
    }

    // Apply a custom handling for sections (e.g., short explanation, advice)
    formatted = formatted
      .replace(/(1\.\s*Short Risk Explanation:)/g, "<h4>$1</h4>")
      .replace(/(2\.\s*Immediate Action Advice:)/g, "<h4>$1</h4>")
      .replace(/(3\.\s*Who Should Evacuate:)/g, "<h4>$1</h4>")
      .replace(/(4\.\s*Reassurance if Risk is Low:)/g, "<h4>$1</h4>");

    return formatted;
  }


  return (
    <div style={{ padding: 20 }}>
      <div className="dashboard-header">
        <h1 className="main-title">SEDIABANJIR</h1>
        <p className="sub-title">Malaysia Flood Alert Assistant</p>
      </div>

      {/* Outer container with map styling */}
      <div
        style={{
          position: "relative",
          width: "100%", // set width to 100% so it can be fully responsive
          height: 497,
          maxWidth: 1349, // the max width you requested
          backgroundColor: "#FFFFFF",
          borderRadius: "30px",
          boxShadow: "9px 10px 8px 0px #00000040",
          marginBottom: 40, // make sure it's above dropdown
          marginTop: 20, // prevent overlap with title
          display: "flex", // Use flexbox to center the map inside
          justifyContent: "center", // Horizontally center
          alignItems: "center", // Vertically center
        }}
      >
        {/* Inside map rectangle */}
        <div
          style={{
            position: "relative",
            width: "100%", // Ensure it adapts to parent container width
            maxWidth: 1301, // max width of map
            height: 365,
            backgroundColor: "#f0f0f0",
            borderRadius: "30px",
            opacity: 1.0,
            boxShadow: "0px 4px 4px 0px #00000040 inset",
          }}
        >
          <FloodMap
            coordinates={riskData?.station
              ? { lat: riskData.station.lat, lng: riskData.station.lng }
              : undefined}
            stationName={riskData?.station?.name}
            riskLevel={riskData?.riskLevel}
            metrics={riskData?.metrics}
          />
        </div>
      </div>

      {/* Language and location selector below */}
      <div style={{ marginBottom: 15, textAlign: "center" }}>
        <label>
          <input
            type="radio"
            name="language"
            value="en"
            checked={language === "en"}
            onChange={() => setLanguage("en")}
          />
          English
        </label>

        <label style={{ marginLeft: 15 }}>
          <input
            type="radio"
            name="language"
            value="bm"
            checked={language === "bm"}
            onChange={() => setLanguage("bm")}
          />
          Bahasa Malaysia
        </label>
      </div>

      <LocationSelector
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
      />

      <button
        style={{ marginTop: 20 }}
        onClick={handleCheckRisk}
        disabled={loading}
      >
        {loading ? "Checking..." : "Check Risk"}
      </button>

      {/* Risk and AI advice output */}
      <div style={{ position: "relative", width: 1207, margin: "40px auto" }}>
        {/* Back Rectangle (decorative) */}
        <div
          style={{
            position: "absolute",
            top: -20,
            left: 0,
            width: "100%",
            height: 699,
            backgroundColor: "#e77a7a",
            borderRadius: 25,
            zIndex: 0,
          }}
        ></div>

        {/* Front Rectangle (main output) */}
        <div
          style={{
            position: "relative",
            width: "100%",
            minHeight: 699,
            backgroundColor: "#f0f0f0",
            borderRadius: 25,
            padding: 30,
            boxShadow: "9px 10px 8px 0px #00000040",
            zIndex: 1,
            overflowY: "auto",
          }}
        >
          {riskData && (
            <div style={{ marginBottom: 30 }}>
              <h2 style={{ marginBottom: 15, color: "#d32f2f" }}>Risk Result</h2>
              <div
                style={{
                  padding: 15,
                  backgroundColor: "#fff",
                  borderRadius: 15,
                  border: "1px solid #ccc",
                }}
              >
                <p>
                  <b>Location:</b> {riskData.location.full}
                </p>
                <p>
                  <b>Risk Level:</b> {riskData.riskLevel}
                </p>
                <p>
                  <b>Risk Score:</b> {riskData.riskScore}/100
                </p>
                <p>
                  <b>Water Level:</b> {riskData.metrics?.waterLevel ?? "-"} m
                </p>
                <p>
                  <b>Threshold:</b> {riskData.metrics?.threshold ?? "-"} m
                </p>
                <p>
                  <b>Exceed:</b> {riskData.metrics?.exceedMeters ?? "-"} m (
                  {riskData.metrics?.percentageOfThreshold ?? "-"}%)
                </p>
                <p>
                  <b>Trend:</b> {riskData.metrics?.trend ?? "-"}
                </p>
                <p>
                  <b>Station:</b> {riskData.station?.name ?? "-"}
                </p>
                <p>
                  <b>Thunderstorm Active:</b>{" "}
                  {riskData.weather?.thunderstormActive ? "Yes" : "No"}
                </p>
              </div>
            </div>
          )}

          {aiAdvice && (
            <div>
              <h2 style={{ marginBottom: 15, color: "#081D93" }}>AI Advice</h2>
              <div
                style={{
                  padding: 15,
                  backgroundColor: "#fff",
                  borderRadius: 15,
                  border: "1px solid #ccc",
                  lineHeight: 1.6,
                }}
              >
                <div
                  className="ai-content"
                  dangerouslySetInnerHTML={{
                    __html: formatAIAdvice(aiAdvice),
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}