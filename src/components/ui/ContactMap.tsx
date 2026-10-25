"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import react-leaflet to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

// Bhilai, Chhattisgarh coordinates
const OFFICE_LOCATION = { lat: 21.2094, lng: 81.3784 };

export default function ContactMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Fix Leaflet default icon issue
    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    });
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-48 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 border border-slate-700 animate-pulse">
        Loading map...
      </div>
    );
  }

  return (
    <div className="w-full h-48 rounded-lg overflow-hidden border border-slate-700">
      <MapContainer
        center={[OFFICE_LOCATION.lat, OFFICE_LOCATION.lng]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[OFFICE_LOCATION.lat, OFFICE_LOCATION.lng]}>
          <Popup>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>
              📍 Qwikkaam HQ
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              Risali Sector, Bhilai
              <br />
              Chhattisgarh, India
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
