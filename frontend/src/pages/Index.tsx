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

      {/* Map Container */}
      <div
        style={{
          width: "100%",
          maxWidth: 1349,
          backgroundColor: "#FFFFFF",
          borderRadius: "30px",
          boxShadow: "9px 10px 8px 0px #00000040",
          margin: "20px auto 40px auto",
          padding: "25px 24px 30px 24px", // space for title
        }}
      >
        {/* Map Title */}
        <div
          style={{
            fontFamily: "Outfit, sans-serif",
            fontWeight: 600,
            fontSize: 20,
            color: "#000000",
            marginBottom: 20,
          }}
        >
          Flood Monitoring Map
        </div>

        {/* Inside Map Rectangle */}
        <div
          style={{
            width: "100%",
            height: 365,
            backgroundColor: "#f0f0f0",
            borderRadius: "30px",
            boxShadow: "0px 4px 4px 0px #00000040 inset",
            overflow: "hidden", // keeps map rounded
          }}
        >
          <FloodMap
            coordinates={
              riskData?.station
                ? { lat: riskData.station.lat, lng: riskData.station.lng }
                : undefined
            }
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

      {/* State and District Dropdowns */}
      <div
        style={{
          display: "flex",
          gap: "20px",  // Space between the dropdowns
          marginTop: "50px",  // Space between map and dropdown
          width: "30%",  // Keep dropdown width at 30% (as per your preference)
          // marginLeft: "24px", // Align with map on the left
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: "40px", // Add space between dropdowns and next section (Risk/AI)
        }}
      >
        {/* STATE Dropdown */}
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 14, color: "#333" }}>
            State
          </label>
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedDistrict(""); // Reset district when state changes
            }}
            style={{
              width: "100%",  // Keep it at 100% width of the container
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #ddd",
              backgroundColor: "#fff",
              fontSize: 14,
              outline: "none",
            }}
          >
            <option value="">Select State</option>
            {/* All 13 States and Federal Territories */}
            <option value="Johor">Johor</option>
            <option value="Kedah">Kedah</option>
            <option value="Kelantan">Kelantan</option>
            <option value="Melaka">Melaka</option>
            <option value="Negeri Sembilan">Negeri Sembilan</option>
            <option value="Pahang">Pahang</option>
            <option value="Perak">Perak</option>
            <option value="Perlis">Perlis</option>
            <option value="Pulau Pinang">Pulau Pinang</option>
            <option value="Sabah">Sabah</option>
            <option value="Sarawak">Sarawak</option>
            <option value="Selangor">Selangor</option>
            <option value="Terengganu">Terengganu</option>

            {/* Federal Territories */}
            <option value="WP Kuala Lumpur">WP Kuala Lumpur</option>
            <option value="WP Labuan">WP Labuan</option>
            <option value="WP Putrajaya">WP Putrajaya</option>
          </select>
        </div>

        {/* DISTRICT Dropdown */}
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 14, color: "#333" }}>
            District
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={!selectedState}
            style={{
              width: "100%",  // Keep it at 100% width of the container
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #ddd",
              backgroundColor: selectedState ? "#fff" : "#f5f5f5",
              fontSize: 14,
              outline: "none",
            }}
          >
            <option value="">{selectedState ? "Select District" : "Select state first"}</option>

            {selectedState === "Johor" && (
              <>
                <option value="Johor Bahru">Johor Bahru</option>
                <option value="Batu Pahat">Batu Pahat</option>
                <option value="Muar">Muar</option>
                <option value="Kluang">Kluang</option>
                <option value="Segamat">Segamat</option>
                <option value="Pontian">Pontian</option>
                <option value="Kota Tinggi">Kota Tinggi</option>
                <option value="Mersing">Mersing</option>
                <option value="Tangkak">Tangkak</option>
              </>
            )}
            {/* Add other states similarly */}
          </select>
        </div>
      </div>

      {/* Check Risk Button */}
      <button
        onClick={handleCheckRisk}
        disabled={loading}
        style={{
          marginTop: "20px",        // Space between dropdowns and button
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "12px 30px",     // Bigger padding for better feel
          fontSize: "16px",
          fontWeight: 600,
          color: "#fff",
          backgroundColor: "#d32f2f",  // Bold red
          border: "none",
          borderRadius: "12px",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 4px 6px rgba(0,0,0,0.2)", // Subtle shadow
          transition: "all 0.2s ease-in-out",
        }}
        onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#b71c1c")}
        onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = "#d32f2f")}
      >
        {loading ? "Checking..." : "Check Risk"}
      </button>

      {/* Risk and AI advice output */}
      <div style={{ position: "relative", width: 1207, margin: "80px auto 40px auto" }}>
        {/* Back Rectangle (decorative) */}
        <div
          style={{
            position: "absolute",
            top: -70,
            left: 0,
            width: "100%",
            height: 699,
            backgroundColor: "#e77a7a",
            borderRadius: 25,
            padding: 30,
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