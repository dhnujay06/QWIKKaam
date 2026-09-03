import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export const metadata: Metadata = {
  title: "Qwikaam - Trusted House Help, Just a Click Away | क्विकाम",
  description: "Connecting you with verified and trusted house helps, cooks, cleaners, babysitters, and elderly care services in your city.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans bg-slate-50 antialiased min-h-screen flex flex-col">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1 pb-16 md:pb-0">
            {children}
          </main>
          <Footer />
          <MobileBottomNav />
        </LanguageProvider>
      </body>
    </html>
  );
}
