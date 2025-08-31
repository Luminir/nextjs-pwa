"use client";

import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    deferredPrompt: any;
    MSStream?: any; // 👈 fix TS error
  }
}

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Detect Android
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/android/i.test(ua)) setIsAndroid(true);

    // Detect iOS
    if (/iPad|iPhone|iPod/.test(ua) && !(window.MSStream)) {
      setIsIos(true);
    }

    // Catch install prompt (Android Chrome)
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      setDeferredPrompt(null);
    } else if (isIos) {
      alert(
        "On iOS, tap the Share button (Safari) → 'Add to Home Screen' to install this app."
      );
    }
  };

  if (!isIos && !isAndroid) return null;

  return (
    <button
      onClick={handleInstall}
      className="fixed bottom-20 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
    >
      {isIos ? "Add to Home Screen" : "Install App"}
    </button>
  );
}
