import NearbyHelpers from "@/components/nearby/NearbyHelpers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Helpers Near Me | Qwikaam",
  description: "Find verified house helpers near you in Risali Sector, Bhilai",
};

export default function NearbyPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-700 to-teal-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="text-5xl mb-3">📍</div>
          <h1 className="text-3xl font-bold mb-2">Helpers Near You</h1>
          <p className="text-teal-100 text-sm">
            आपके पास उपलब्ध हेल्पर्स देखें • रिसाली सेक्टर, भिलाई
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <NearbyHelpers />
      </div>
    </main>
  );
}
