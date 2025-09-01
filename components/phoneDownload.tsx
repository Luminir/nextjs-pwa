"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image"; // Import the Next.js Image component

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
  const [showIosInstallModal, setShowIosInstallModal] = useState(false);

  useEffect(() => {
    // Detect Android
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/android/i.test(ua)) setIsAndroid(true);

    // Detect iOS
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
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
      setShowIosInstallModal(true);
    }
  };

  if (!isIos && !isAndroid) return null;

  return (
    <>
      <button
        onClick={handleInstall}
        className="fixed bottom-20 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        {isIos ? "Add to Home Screen" : "Install App"}
      </button>

      {/* iOS Installation Modal */}
      {isIos && showIosInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
          <div className="bg-white text-black rounded-lg p-6 shadow-xl max-w-sm text-center">
            <h2 className="font-bold text-xl mb-4">Install App</h2>
            <p className="mb-4">
              On an iPhone, tap the **Share button** <Image // New image for the share button
                src="/pwa/ios-share-button.png" 
                alt="iOS Share button"
                width={24} // Adjust size as needed
                height={24} // Adjust size as needed
                className="inline-block mx-1 align-middle" // Style to keep it inline with text
              />
              at the bottom of the screen, then select **'Add to Home Screen'**.
            </p>
            <Image
              src="/pwa/ios-share-guide.jpg" // Path to your guide image
              alt="iOS Add to Home Screen guide"
              width={200}
              height={300}
              className="mx-auto rounded-lg mb-4 border border-gray-300" // Added a border for better visibility
            />
            <img
              src="/pwa/gify.gif" // Path to your GIF
              alt="iOS Add to Home Screen animated guide"
              className="mx-auto rounded-lg mb-4 border border-gray-300 max-w-full h-auto" // Added styling for responsiveness
            />
            <button
              onClick={() => setShowIosInstallModal(false)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}