"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";

// Fix leaflet default icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom user location icon (blue)
const userIcon = new L.DivIcon({
  html: `<div style="background:#0ea5e9;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 3px rgba(14,165,233,0.3)"></div>`,
  className: "",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// Helper icon — green for available, gray for busy
const helperIcon = (available: boolean, selected: boolean) =>
  new L.DivIcon({
    html: `<div style="background:${selected ? '#0f766e' : available ? '#14b8a6' : '#94a3b8'};width:${selected ? 22 : 16}px;height:${selected ? 22 : 16}px;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:10px">👤</div>`,
    className: "",
    iconSize: [selected ? 22 : 16, selected ? 22 : 16],
    iconAnchor: [selected ? 11 : 8, selected ? 11 : 8],
  });

// Auto-center map on user location
function FlyToUser({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lon], 15, { duration: 1 });
  }, [lat, lon, map]);
  return null;
}

interface Helper {
  id: string;
  name: string;
  lat: number;
  lon: number;
  rating: number;
  hourlyRate: number;
  available: boolean;
  distance: number;
  eta: number;
}

interface NearbyMapProps {
  userLocation: { lat: number; lon: number };
  helpers: Helper[];
  selectedHelper: string | null;
  onSelectHelper: (id: string) => void;
}

export default function NearbyMap({ userLocation, helpers, selectedHelper, onSelectHelper }: NearbyMapProps) {
  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lon]}
      zoom={15}
      style={{ height: "320px", width: "100%" }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FlyToUser lat={userLocation.lat} lon={userLocation.lon} />

      {/* User location */}
      <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
        <Popup>📍 Aap yahan hain</Popup>
      </Marker>

      {/* Range circle — 1km */}
      <Circle
        center={[userLocation.lat, userLocation.lon]}
        radius={1000}
        pathOptions={{ color: "#0ea5e9", fillColor: "#0ea5e9", fillOpacity: 0.05, weight: 1, dashArray: "5,5" }}
      />

      {/* Helper markers */}
      {helpers.map((helper) => (
        <Marker
          key={helper.id}
          position={[helper.lat, helper.lon]}
          icon={helperIcon(helper.available, selectedHelper === helper.id)}
          eventHandlers={{ click: () => onSelectHelper(helper.id) }}
        >
          <Popup>
            <div style={{ minWidth: 140 }}>
              <div style={{ fontWeight: 700 }}>{helper.name}</div>
              <div style={{ color: helper.available ? "#0f766e" : "#94a3b8", fontSize: 12 }}>
                {helper.available ? "✅ Available" : "⏳ Busy"}
              </div>
              <div style={{ fontSize: 12, marginTop: 4 }}>
                📍 {helper.distance} km • ⏱ ~{helper.eta} min
              </div>
              <div style={{ fontSize: 12 }}>💰 ₹{helper.hourlyRate}/hr</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
