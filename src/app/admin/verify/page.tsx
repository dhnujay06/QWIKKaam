"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminVerifyPage from "@/components/admin/AdminVerifyPage";

export default function AdminVerifyRoute() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!sessionStorage.getItem("qwikkaam_admin")) {
        router.push("/admin");
      } else {
        setAuthorized(true);
      }
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">
        Checking authorization...
      </div>
    );
  }

  return <AdminVerifyPage />;
}
