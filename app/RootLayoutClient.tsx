"use client";

import AppShell from "@/components/navbar";
import React, { useEffect } from "react";

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("✅ Service Worker registered with scope:", registration.scope);
        })
        .catch((error) => {
          console.error("❌ Service Worker registration failed:", error);
        });
    }
  }, []);

  return (
    <div className="">
      <div className="">
        <AppShell>{children}</AppShell>
      </div>
    </div>
  );
}
