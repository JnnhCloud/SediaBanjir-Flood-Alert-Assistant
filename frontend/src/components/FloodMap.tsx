import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Metrics {
  waterLevel?: number;
  trend?: string;
}

interface Props {
  coordinates?: { lat: number; lng: number };
  stationName?: string;
  riskLevel?: string;
  metrics?: Metrics;
}

export default function FloodMap({
  coordinates,
  stationName,
  riskLevel,
  metrics,
}: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.CircleMarker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const malaysiaCenter: [number, number] = [4.2105, 101.9758];
  const malaysiaZoom = 6;

  // // Malaysia bounds to restrict panning
  // const malaysiaBounds = L.latLngBounds(
  //   L.latLng(1.5, 98.0),
  //   L.latLng(7.5, 119.5)
  // );
  
  // Extend bounds to include part of Indonesia near southern Johor
  const malaysiaBounds = L.latLngBounds(
    L.latLng(0.5, 98.0),   // extend south
    L.latLng(7.5, 119.5)   // keep northeast corner same
  );



  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: malaysiaCenter,
        zoom: malaysiaZoom,
        minZoom: 5,
        maxZoom: 11,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);

      mapRef.current.setMaxBounds(malaysiaBounds);

      // --- Add Custom Reset Button to Leaflet Map Controls ---
      const ResetControl = L.Control.extend({
        options: { position: "topleft" }, // same as zoom control
        onAdd: function () {
          const container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
          container.style.backgroundColor = "#fff";
          container.style.width = "34px";
          container.style.height = "34px";
          container.style.display = "flex";
          container.style.alignItems = "center";
          container.style.justifyContent = "center";
          container.style.cursor = "pointer";
          container.title = "Reset to default view";

          // Use a simple Unicode map icon or reset icon
          container.innerHTML = "⟳"; // circular arrow icon
          container.style.fontSize = "18px";  // Increase font size
          container.style.fontWeight = "bold";  // Make it bold

          L.DomEvent.on(container, "click", (e) => {
            L.DomEvent.stopPropagation(e);
            mapRef.current?.setView(malaysiaCenter, malaysiaZoom);
          });

          return container;
        },
      });

      mapRef.current.addControl(new ResetControl());
    }
  }, []);

  // Update marker when coordinates / riskLevel change
  useEffect(() => {
    if (!mapRef.current || !coordinates) return;

    mapRef.current.setView([coordinates.lat, coordinates.lng], 11);

    let color = "green";
    switch (riskLevel?.toLowerCase()) {
      case "danger":
      case "critical":
      case "severe":
        color = "red";
        break;
      case "warning":
        color = "orange";
        break;
      case "alert":
        color = "yellow";
        break;
    }

    const popupContent = `
      <b>${stationName || "Selected Station"}</b><br>
      Risk Level: ${riskLevel || "-"}<br>
      Water Level: ${metrics?.waterLevel ?? "-"} m<br>
      Trend: ${metrics?.trend ?? "-"}
    `;

    if (markerRef.current) {
      markerRef.current.setLatLng([coordinates.lat, coordinates.lng]);
      markerRef.current.setStyle({ fillColor: color });
      markerRef.current.setPopupContent(popupContent);
    } else {
      markerRef.current = L.circleMarker([coordinates.lat, coordinates.lng], {
        radius: 10,
        fillColor: color,
        color: "#000",
        weight: 1,
        fillOpacity: 0.8,
      })
        .addTo(mapRef.current)
        .bindPopup(popupContent)
        .openPopup();
    }
  }, [coordinates, stationName, riskLevel, metrics]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        height: "400px",
        position: "relative",  // Make legend positioning relative
        marginBottom: "20px",
        backgroundColor: "#000", // keep your background if needed
      }}
    >
      {/* Leaflet Map is injected here */}

      {/* Risk Legend */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",   // distance from bottom
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "30px",
          alignItems: "center",
          padding: "5px 10px",
          backgroundColor: "#00000080", // semi-transparent if desired
          borderRadius: "15px",
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
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "25px",
                borderRadius: "50%",
                backgroundColor: risk.color,
              }}
            />
            <span
              style={{
                fontFamily: "Outfit, sans-serif",
                fontWeight: 400,
                fontSize: "24px",
                color: "#fff",
                lineHeight: "100%",
              }}
            >
              {risk.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  // return <div ref={mapContainerRef} style={{ height: "400px", marginBottom: "20px" }} />;
}