import React, { useState } from "react";
import LocationSelector from "../components/LocationSelector";
import FloodMap from "../components/FloodMap";
import { districtData } from "../data/districtData.ts";

export default function Index() {
  const [language, setLanguage] = useState<"en" | "bm">("en");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [riskData, setRiskData] = useState<any>(null);
  const [aiAdvice, setAiAdvice] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Map risk levels to colors
  const riskColors: Record<string, string> = {
    normal: "#11A700",
    alert: "#F3FF0A",
    warning: "#FF8C00",
    danger: "#F70202",
  };

  const getRiskColor = (level?: string) => {
    if (!level) return "#e77a7a"; // default color
    const key = level.toLowerCase();
    return riskColors[key] || "#e77a7a";
  };

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
      const aiPayload = { ...data, language };
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
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/^### (.*$)/gim, "<h4>$1</h4>")
      .replace(/^---$/gim, "<hr>")
      .replace(/^\* (.*$)/gim, "<li>$1</li>")
      .replace(/\n\n/g, "<br><br>");

    if (/<li>/.test(formatted)) {
      formatted = formatted.replace(/(<li>.*<\/li>)/gis, "<ul>$1</ul>");
    }

    formatted = formatted
      .replace(/(1\.\s*Short Risk Explanation:)/g, "<h4>$1</h4>")
      .replace(/(2\.\s*Immediate Action Advice:)/g, "<h4>$1</h4>")
      .replace(/(3\.\s*Who Should Evacuate:)/g, "<h4>$1</h4>")
      .replace(/(4\.\s*Reassurance if Risk is Low:)/g, "<h4>$1</h4>");

    return formatted;
  }

  const [backRectColor, setBackRectColor] = useState("#e77a7a");
  const [headingColor, setHeadingColor] = useState("#d32f2f");

  const normalizeRisk = (level?: string) => {
    if (!level) return "";

    const l = level.toLowerCase().trim();

    if (l.includes("normal")) return "normal";
    if (l.includes("alert")) return "alert";
    if (l.includes("warning")) return "warning";
    if (l.includes("danger") || l.includes("critical") || l.includes("severe"))
      return "danger";

    return "";
  };

  // Whenever riskData changes, update colors
  React.useEffect(() => {
    const normalized = normalizeRisk(riskData?.riskLevel);
    const color = riskColors[normalized] || "#e77a7a";

    setBackRectColor(color);
    setHeadingColor(color);
  }, [riskData]);

  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
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
          padding: "25px 24px 30px 24px",
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

        {/* Map Rectangle */}
        <div
          style={{
            width: "100%",
            height: 365,
            backgroundColor: "#f0f0f0",
            borderRadius: "30px",
            boxShadow: "0px 4px 4px 0px #00000040 inset",
            overflow: "hidden",
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

        {/* Risk Legend */}
        <div
          style={{
            marginTop: 15,
            display: "flex",
            justifyContent: "center",
            gap: 40,
            alignItems: "center",
          }}
        >
          {[
            { label: "Normal", color: "#11A700" },
            { label: "Alert", color: "#F3FF0A" },
            { label: "Warning", color: "#FF8C00" },
            { label: "Danger", color: "#F70202" },
          ].map((risk) => (
            <div
              key={risk.label}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <div
                style={{
                  width: 24,
                  height: 25,
                  borderRadius: "50%",
                  backgroundColor: risk.color,
                }}
              />
              <span
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: 400,
                  fontSize: 24,
                  color: "#000",
                  lineHeight: "100%",
                }}
              >
                {risk.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Language Selector */}
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

      {/* State & District Dropdowns */}
      <div
        style={{
          display: "flex",
          gap: 20,
          marginTop: 50,
          width: "30%",
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: 40,
        }}
      >
        {/* STATE */}
        <div style={{ flex: 1 }}>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontWeight: 600,
              fontSize: 14,
              color: "#333",
            }}
          >
            State
          </label>
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedDistrict("");
            }}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #ddd",
              backgroundColor: "#fff",
              fontSize: 14,
              outline: "none",
            }}
          >
            <option value="">Select State</option>
            {Object.keys(districtData).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* DISTRICT */}
        <div style={{ flex: 1 }}>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontWeight: 600,
              fontSize: 14,
              color: "#333",
            }}
          >
            District
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={!selectedState}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #ddd",
              backgroundColor: selectedState ? "#fff" : "#f5f5f5",
              fontSize: 14,
              outline: "none",
            }}
          >
            <option value="">
              {selectedState ? "Select District" : "Select state first"}
            </option>
            {selectedState &&
              districtData[selectedState]?.map((district: string) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Check Risk Button */}
      <button
        onClick={handleCheckRisk}
        disabled={loading}
        style={{
          marginTop: 20,
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "12px 30px",
          fontSize: 16,
          fontWeight: 600,
          color: "#fff",
          backgroundColor: "#d32f2f",
          border: "none",
          borderRadius: 12,
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
          transition: "all 0.2s ease-in-out",
        }}
        onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#b71c1c")}
        onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = "#d32f2f")}
      >
        {loading ? "Checking..." : "Check Risk"}
      </button>

      {/* Risk & AI Advice Output */}
      <div style={{ position: "relative", width: 1207, margin: "80px auto 40px auto" }}>
        {/* Back Rectangle */}
        <div
          style={{
            position: "absolute",
            top: -70,
            left: 0,
            width: "100%",
            height: 699,
            backgroundColor: backRectColor, // <-- dynamic
            borderRadius: 25,
            padding: 30,
            boxShadow: "9px 10px 8px 0px #00000040",
            zIndex: 0,
            transition: "background-color 0.5s ease", // smooth color change
          }}
        ></div>

        {/* Front Rectangle */}
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
              <h2
                style={{
                  marginBottom: 15,
                  fontSize: 36, // increased font size
                  color: headingColor, // dynamic risk color
                  transition: "color 0.5s ease",
                  textShadow: `
                    -1px -1px 2px rgba(0,0,0,0.1),
                    1px -1px 2px rgba(0,0,0,0.1),
                    -1px  1px 2px rgba(0,0,0,0.5),
                    1px  1px 2px rgba(0,0,0,0.5)
                  `
                }}
              >
                Risk Result
              </h2>
              <div
                style={{
                  padding: 15,
                  backgroundColor: "#fff",
                  borderRadius: 15,
                  border: "1px solid #ccc",
                  color: "#333333", // softer text
                }}
              >
              {/* <div style={{ padding: 15, backgroundColor: "#fff", borderRadius: 15, border: "1px solid #ccc" }}> */}
                <p><b>Location:</b> {riskData.location.full}</p>
                <p><b>Risk Level:</b> {riskData.riskLevel}</p>
                <p><b>Risk Score:</b> {riskData.riskScore}/100</p>
                <p><b>Water Level:</b> {riskData.metrics?.waterLevel ?? "-"} m</p>
                <p><b>Threshold:</b> {riskData.metrics?.threshold ?? "-"} m</p>
                <p><b>Exceed:</b> {riskData.metrics?.exceedMeters ?? "-"} m ({riskData.metrics?.percentageOfThreshold ?? "-"}%)</p>
                <p><b>Trend:</b> {riskData.metrics?.trend ?? "-"}</p>
                <p><b>Station:</b> {riskData.station?.name ?? "-"}</p>
                <p><b>Thunderstorm Active:</b> {riskData.weather?.thunderstormActive ? "Yes" : "No"}</p>
              </div>
            </div>
          )}

          {aiAdvice && (
            <div>
              <h2 style={{ marginBottom: 25, color: "#081D93" }}>AI Advice</h2>
              <div style={{ padding: 15, backgroundColor: "#fff", borderRadius: 15, border: "1px solid #ccc", lineHeight: 1.6 }}>
                <div
                  className="ai-content"
                  dangerouslySetInnerHTML={{ __html: formatAIAdvice(aiAdvice) }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <div
        style={{
          marginTop: 50,
          marginBottom: 50,
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Main footer text with hyperlinks*/}
        <p
          style={{
            width: 557,
            height: 52,
            margin: "0 auto",
            fontFamily: "Outfit, sans-serif",
            fontWeight: 400,
            fontSize: 16,
            lineHeight: "100%",
            letterSpacing: 0,
            textAlign: "center",
            color: "#000000",
          }}
        >
          Based on data from{" "}
          <a
            href="https://www.water.gov.my/index.php"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontWeight: 600, color: "#000000", textDecoration: "none" }}
          >
            Department of Irrigation and Drainage Malaysia
          </a>
        </p>

        {/* Disclaimer below */}
        <p
          style={{
            width: 411,
            height: 18,
            margin: "10px auto 0 auto",
            fontFamily: "Outfit, sans-serif",
            fontWeight: 400,
            fontSize: 13,
            lineHeight: "100%",
            letterSpacing: 0,
            textAlign: "center",
            color: "#6E6363",
          }}
        >
          · Relief Centre information is subject to official updates from NADMA.
        </p>
      </div>
    </div>
  );
}