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

  // Define the bounds for Malaysia
  const malaysiaBounds = L.latLngBounds(
    L.latLng(1.5, 98.0), // South-West corner (Southernmost point)
    L.latLng(7.5, 119.5)  // North-East corner (Northernmost point)
  );

  // Initialize map
  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [4.2105, 101.9758], // Center on Malaysia
        zoom: 6, // Initial zoom to show the entire country
        minZoom: 6, // Minimum zoom level to restrict zooming out
        maxZoom: 11, // Maximum zoom level to prevent zooming in too much
        scrollWheelZoom: false, // Disable scroll zoom (optional)
        attributionControl: false, // Optional, remove attribution if needed
      });

      // Set up the tile layer (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);

      // Restrict panning and zooming to Malaysia's bounds
      mapRef.current.setMaxBounds(malaysiaBounds);
    }
  }, []);

  // Update marker when coordinates / riskLevel change
  useEffect(() => {
    if (!mapRef.current || !coordinates) return;

    // Zoom to selected coordinates
    mapRef.current.setView([coordinates.lat, coordinates.lng], 11);

    // Determine marker color based on risk level
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
      default:
        color = "green";
    }

    const popupContent = `
      <b>${stationName || "Selected Station"}</b><br>
      Risk Level: ${riskLevel || "-"}<br>
      Water Level: ${metrics?.waterLevel ?? "-"} m<br>
      Trend: ${metrics?.trend ?? "-"}
    `;

    // Smooth marker update
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

  return <div ref={mapContainerRef} style={{ height: "400px", marginBottom: "20px" }} />;
}