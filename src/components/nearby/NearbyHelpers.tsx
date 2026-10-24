"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { MapPin, Clock, Star, Phone, Navigation } from "lucide-react";
import dynamic from "next/dynamic";

// Haversine formula - distance between two GPS points (in km)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ETA in minutes assuming 15 km/h average travel speed
function getETA(distanceKm: number): number {
  return Math.round((distanceKm / 15) * 60);
}

// Mock helpers in Risali Sector, Bhilai area
const MOCK_HELPERS = [
  { id: "h1", name: "Priya Sahu", nameHi: "प्रिया साहू", lat: 21.2051, lon: 81.3381, rating: 4.8, skills: ["Cooking", "Cleaning"], hourlyRate: 149, available: true, experience: 5 },
  { id: "h2", name: "Sunita Yadav", nameHi: "सुनीता यादव", lat: 21.2035, lon: 81.3395, rating: 4.6, skills: ["Baby Sitting", "Cooking"], hourlyRate: 179, available: true, experience: 3 },
  { id: "h3", name: "Kavita Patel", nameHi: "कविता पटेल", lat: 21.2068, lon: 81.3362, rating: 4.9, skills: ["Elderly Care", "Cooking"], hourlyRate: 199, available: true, experience: 8 },
  { id: "h4", name: "Meena Verma", nameHi: "मीना वर्मा", lat: 21.2020, lon: 81.3410, rating: 4.5, skills: ["Cleaning", "Utensil Washing"], hourlyRate: 129, available: false, experience: 2 },
  { id: "h5", name: "Rekha Tiwari", nameHi: "रेखा तिवारी", lat: 21.2080, lon: 81.3340, rating: 4.7, skills: ["Cooking", "Laundry"], hourlyRate: 159, available: true, experience: 6 },
  { id: "h6", name: "Anita Dewangan", nameHi: "अनिता देवांगन", lat: 21.2010, lon: 81.3350, rating: 4.4, skills: ["House Work", "Cleaning"], hourlyRate: 139, available: true, experience: 4 },
];

// Dynamically import map (no SSR)
const NearbyMap = dynamic(() => import("./NearbyMap"), { ssr: false, loading: () => (
  <div className="w-full h-64 rounded-2xl bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">
    🗺️ Map load ho raha hai...
  </div>
) });

interface HelperWithDistance {
  id: string;
  name: string;
  nameHi: string;
  lat: number;
  lon: number;
  rating: number;
  skills: string[];
  hourlyRate: number;
  available: boolean;
  experience: number;
  distance: number;
  eta: number;
}

export default function NearbyHelpers({ serviceFilter }: { serviceFilter?: string }) {
  const { t, language } = useLanguage();
  const [baseHelpers, setBaseHelpers] = useState<any[]>(MOCK_HELPERS);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState("");
  const [loading, setLoading] = useState(false);
  const [helpers, setHelpers] = useState<HelperWithDistance[]>([]);
  const [selectedHelper, setSelectedHelper] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/helpers')
      .then(res => res.json())
      .then(data => {
        if (data?.helpers?.length) {
          const mapped = data.helpers.map((h: any, idx: number) => {
            const angle = (idx * 45) * (Math.PI / 180);
            const r = 0.0025 + (idx % 4) * 0.0018;
            return {
              id: h.id,
              name: h.name,
              nameHi: h.nameHi || h.name,
              lat: 21.2043 + r * Math.cos(angle),
              lon: 81.3372 + r * Math.sin(angle),
              rating: h.rating || 4.8,
              skills: h.skills || ['House Help'],
              hourlyRate: h.hourlyRate || 149,
              available: h.availability === 'available',
              experience: h.experience || 3,
            };
          });
          setBaseHelpers(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const calculateWithLoc = (loc: { lat: number; lon: number }, sourceHelpers = baseHelpers) => {
    return sourceHelpers.map((h) => ({
      ...h,
      distance: parseFloat(getDistance(loc.lat, loc.lon, h.lat, h.lon).toFixed(1)),
      eta: getETA(getDistance(loc.lat, loc.lon, h.lat, h.lon)),
    })).sort((a, b) => a.distance - b.distance);
  };

  const getLocation = () => {
    setLoading(true);
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError(t("GPS not supported by your browser", "आपका ब्राउज़र GPS सपोर्ट नहीं करता"));
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setUserLocation(loc);
        setHelpers(calculateWithLoc(loc));
        setLoading(false);
      },
      (err) => {
        // If GPS denied, use Risali Sector center as default
        const defaultLoc = { lat: 21.2043, lon: 81.3372 };
        setUserLocation(defaultLoc);
        setHelpers(calculateWithLoc(defaultLoc));
        setLocationError(t("Using Risali Sector as default location", "डिफ़ॉल्ट रूप से रिसाली सेक्टर का उपयोग कर रहे हैं"));
        setLoading(false);
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {t("Helpers Near You", "आपके पास के हेल्पर्स")}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {t("Available in Risali Sector, Bhilai", "रिसाली सेक्टर, भिलाई में उपलब्ध")}
          </p>
        </div>
        <button
          onClick={getLocation}
          disabled={loading}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
        >
          <Navigation className="w-4 h-4" />
          {loading ? t("Finding...", "ढूंढ रहे हैं...") : userLocation ? t("Refresh", "रीफ्रेश") : t("Find Near Me", "मेरे पास खोजें")}
        </button>
      </div>

      {/* Location error info */}
      {locationError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          {locationError}
        </div>
      )}

      {/* Map */}
      {userLocation && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          <NearbyMap
            userLocation={userLocation}
            helpers={helpers}
            selectedHelper={selectedHelper}
            onSelectHelper={setSelectedHelper}
          />
        </div>
      )}

      {/* No location yet */}
      {!userLocation && !loading && (
        <div className="bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-100 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">📍</div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {t("Find Helpers Near You", "अपने पास हेल्पर्स खोजें")}
          </h3>
          <p className="text-slate-500 text-sm mb-4">
            {t("Click 'Find Near Me' to see available helpers in your area with distance and arrival time.", "अपने क्षेत्र में उपलब्ध हेल्पर्स देखने के लिए 'मेरे पास खोजें' पर क्लिक करें।")}
          </p>
          <button
            onClick={getLocation}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            📍 {t("Find Near Me", "मेरे पास खोजें")}
          </button>
        </div>
      )}

      {/* Helper Cards */}
      {helpers.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
            {helpers.filter(h => h.available).length} {t("helpers available nearby", "हेल्पर्स पास में उपलब्ध")}
          </h3>
          {helpers.map((helper) => (
            <div
              key={helper.id}
              onClick={() => setSelectedHelper(helper.id === selectedHelper ? null : helper.id)}
              className={`bg-white rounded-2xl border-2 p-4 cursor-pointer transition-all ${
                selectedHelper === helper.id
                  ? "border-teal-500 shadow-md"
                  : "border-slate-100 hover:border-slate-200 hover:shadow-sm"
              } ${!helper.available ? "opacity-60" : ""}`}
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0 ${
                  helper.available ? "bg-teal-500" : "bg-slate-400"
                }`}>
                  {(language === 'hi' ? helper.nameHi : helper.name).charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900">
                      {language === 'hi' ? helper.nameHi : helper.name}
                    </span>
                    {helper.available ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        ● {t("Available", "उपलब्ध")}
                      </span>
                    ) : (
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                        ● {t("Busy", "व्यस्त")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {helper.rating}
                    </span>
                    <span>{helper.experience} {t("yrs exp", "साल अनुभव")}</span>
                    <span className="font-semibold text-slate-700">₹{helper.hourlyRate}/hr</span>
                  </div>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {helper.skills.map(s => (
                      <span key={s} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Distance & ETA */}
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 text-teal-600 font-bold">
                    <MapPin className="w-4 h-4" />
                    <span>{helper.distance} km</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{helper.eta} {t("min", "मिनट")}</span>
                  </div>
                </div>
              </div>

              {/* Expanded: Book button */}
              {selectedHelper === helper.id && helper.available && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3">
                  <a
                    href={`/book/instant?helper=${helper.id}`}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded-xl text-center text-sm transition-colors"
                  >
                    {t("Book Now", "अभी बुक करें")} — {helper.eta} {t("min arrival", "मिनट में आएंगे")}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
