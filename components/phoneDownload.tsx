"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import Image from "next/image";
import { Smartphone, Laptop, Share, Download, ChevronLeft, ChevronRight, BookOpen, Copy } from "lucide-react";

declare global {
  interface Window {
    deferredPrompt: any;
    MSStream?: any;
  }
}

// iOS Download Button Component
const IosDownloadBtn = ({ onClick }: { onClick: () => void }) => (
  <Button onClick={onClick} className="bg-gradient-to-b from-white to-gray-400 hover:from-gray-300 hover:to-gray-500 text-gray-800 gap-2 w-full sm:w-auto">
    <img src={'/pwa/ios/apple-icon.svg'} width={20} height={20}/>
    Download for IOS
  </Button>
);

// Android Download Button Component
const AndroidDownloadBtn = ({ onClick }: { onClick: () => void }) => (
  <Button onClick={onClick} className="bg-gradient-to-br from-green-800 to-green-400 hover:from-green-900 hover:to-green-500 text-white gap-2 w-full sm:w-auto">
    <img src={'/pwa/android/android-icon.svg'} width={20} height={20}/>
    Download for Android
  </Button>
);

// Computer Download Button Component
const ComputerDownloadBtn = ({ onClick }: { onClick: () => void }) => (
  <Button onClick={onClick} className="bg-gradient-to-b from-blue-800 to-blue-500 hover:from-blue-900 hover:to-blue-600 text-white gap-2 w-full sm:w-auto">
    <Laptop className="h-7 w-7" />
    Download for Computer
  </Button>
);

// Carousel Wrapper to Handle Slide Change
const CarouselWithDots = ({ slides, isMobile }: { slides: { title: string; content: React.ReactNode }[], isMobile: boolean }) => {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    return () => {
      api.off("select", () => {});
    };
  }, [api]);

  return (
    <>
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent className="-ml-4">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="pl-4">
              <div className="px-4 text-center">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">{slide.title}</h3>
                {slide.content}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {!isMobile && <CarouselPrevious className="text-black" />}
        {!isMobile && <CarouselNext className="text-black" />}
      </Carousel>
      <div className="flex justify-center gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full ${index === current ? "bg-blue-500" : "bg-gray-500"}`}
          />
        ))}
      </div>
    </>
  );
};

// Main Download Buttons Component
export default function DownloadBtns() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [openModal, setOpenModal] = useState<"ios" | "android" | "computer" | null>(null);

  useEffect(() => {
    // Detect Android
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/android/i.test(ua)) setIsAndroid(true);

    // Detect iOS
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) setIsIos(true);

    // Catch install prompt for all platforms (including computer)
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
      setDeferredPrompt(e);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", () => {});
    };
  }, []);

  const handleIosClick = () => {
    setOpenModal("ios");
  };

  const handleAndroidClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      setDeferredPrompt(null);
    } else {
      setOpenModal("android");
    }
  };

  const handleComputerClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      setOpenModal("computer"); // Trigger modal alongside prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      setDeferredPrompt(null);
    } else {
      setOpenModal("computer"); // Fallback to modal if prompt isn't available
    }
  };

  const iosSlides = [
    {
      title: "Why not in App Store?",
      content: (
        <>
          <p className="text-gray-400 mb-4 text-sm sm:text-base">
          EGBO is not in the App Store because it's a Progressive Web App (PWA) — 
          0 second to download and work on all IOS versions!
        </p>
        <img
          src="/pwa/ios/why-not-appstore.png"
          alt="iOS Add to Home Screen guide"
          width={200}
          height={300}
          className="mx-auto rounded-lg w-full"
        />
        </>
      ),
    },
    {
      title: "Is your data safe?",
      content: (
        <>
          <p className="text-gray-400 mb-4 text-sm sm:text-base">
            Yes! EGBO IOS is a website that runs on your phone like a real app, keeping your data secure at 1 place & no phone's data collected.
          </p>
          <img
            src="/pwa/ios/ios-security.png"
            alt="iOS Security"
            width={200}
            height={300}
            className="mx-auto rounded-lg w-full"
          />
        </>
      ),
    },
    {
      title: "How to Install?",
      content: (
        <>
          <p className="text-gray-400 mb-2 text-sm sm:text-base">
            1. Tap the <strong className="font-bold">Share button & scroll down</strong>
          </p>
          <div className=" flex w-full justify-between bg-gray-300 p-1 rounded-b-3xl">
            <ChevronLeft className="w-6 h-6 text-gray-500"/>
            <ChevronRight className="w-6 h-6 text-gray-500"/>
            <img
            src="/pwa/ios/share-icon.svg"
            alt="iOS Add to Home Screen animated guide" className="w-6 h-6 text-black justify-self-center my-0.5 bg-white rounded-sm border border-red-500" />
            <BookOpen className="w-6 h-6 text-gray-500"/>
            <Copy className="w-6 h-6 text-gray-500"/>
          </div>
          <p className="text-gray-400 my-2 text-sm sm:text-base">
            2. Then select <strong className="font-bold">Add to Home Screen</strong>.
          </p>
          {/* check local: if en: ios-guide-en.gif, vi: ios-guide-vi.gif */}
          <img
            src="/pwa/ios/ios-guide-en.gif"
            alt="iOS Add to Home Screen animated guide"
            className="mx-auto rounded-lg mb-4 border border-gray-300 w-full max-w-[200px] h-auto"
          />
        </>
      ),
    },
  ];

  const androidSlides = [
    {
      title: "Why not in Play Store?",
      content: (
        <>
          <p className="text-gray-200 mb-4 text-sm sm:text-base">
            EGBO is a Progressive Web App (PWA), not in the Play Store, but lightweight and compatible with all Android versions!
          </p>
          <img
            src="/pwa/ios/why-not-appstore.png"
            alt="Android Install guide"
            width={200}
            height={300}
            className="mx-auto rounded-lg w-full"
          />
        </>
      ),
    },
    {
      title: "Is Your Data Safe?",
      content: (
        <>
          <p className="text-gray-200 mb-4 text-sm sm:text-base">
            Absolutely! EGBO Android is a web app on your phone, meaning no phone's data is collected.
          </p>
          <img
            src="/pwa/ios/ios-security.png"
            alt="Android Security"
            width={200}
            height={300}
            className="mx-auto rounded-lg w-full"
          />
        </>
      ),
    },
    {
      title: "How to Install",
      content: (
        <>
          <p className="text-gray-200 mb-4 text-sm sm:text-base">
            Tap <strong>Install</strong> when prompted, or add to your home screen via browser settings.
          </p>
          <img
            src="/pwa/android-gify.gif"
            alt="Android Install animated guide"
            className="mx-auto rounded-lg mb-4 border border-gray-300 w-full max-w-[200px] h-auto"
          />
        </>
      ),
    },
  ];

  const computerContent = (
    <div>
      {/* Windows Row */}
      <div className="flex flex-row justify-center gap-8 text-left">
        {/* Slim logo column */}
        <div className="bg-blue-200 rounded-lg h-[240px] w-[30px] flex justify-center items-center">
          <img
            src="/pwa/computer/windows-color-icon.svg"
            alt="Windows icon"
            className="w-6"
          />
        </div>
        {/* Steps */}
        <div className="w-[300px]">
          <p className="text-blue-200 md:text-xl mb-2">1. Downloads</p>
          <img
            src="/pwa/computer/windows-download.png"
            alt="Windows Downloads guide"
            className="rounded-lg border border-gray-300 h-[170px] w-full object-cover"
          />
          <p className="text-gray-200 text-sm sm:text-base mt-2">
            Click on <span className="text-blue-400">Install</span> on top right
          </p>
        </div>
        <div className="w-[300px]">
          <p className="text-blue-200 md:text-xl mb-2">2. Display</p>
          <img
            src="/pwa/computer/windows-pinning.png"
            alt="Windows pinning guide"
            className="rounded-lg border border-gray-300 h-[170px] w-full object-cover"
          />
          <p className="text-gray-200 text-sm sm:text-base mt-2">
            Check 3 of the following (if needed)
          </p>
        </div>

        <div className="w-[300px]">
          <p className="text-blue-200 md:text-xl mb-2">3. Open</p>
          <img
            src="/pwa/computer/windows-applications.gif"
            alt="Windows Applications guide"
            className="rounded-lg border border-gray-300 h-[170px] w-full object-cover"
          />
          <p className="text-gray-200 text-sm sm:text-base mt-2">
            Open EGBO & enjoy!
          </p>
        </div>
      </div>
      <hr className="my-2"/>
      {/* iOS Row */}
      <div className="flex flex-row justify-center gap-8 text-left">
        {/* Slim logo column */}
        <div className="bg-gray-200 rounded-lg h-[240px] w-[30px] flex justify-center items-center">
          <img
            src="/pwa/ios/apple-icon.svg"
            alt="iOS icon"
            className="w-6"
          />
        </div>
        {/* Steps */}
        <div className="w-[300px]">
          <p className="text-gray-200 md:text-xl mb-2">1. Click Share in Safari</p>
          <img
            src="/pwa/computer/mac-share.gif"
            alt="iOS Safari guide"
            className="rounded-lg border border-gray-300 h-[170px] w-full object-cover"
          />
          <p className="text-gray-200 text-sm sm:text-base mt-2 flex gap-1">
            Open <span className="font-bold">EGBO</span> in Safari & click 
            <img
            src="/pwa/ios/share-icon.svg"
            alt="iOS Add to Home Screen animated guide" className="w-6 h-6 text-black justify-self-center my-0.5 bg-white rounded-sm border border-red-500" />
          </p>
        </div>
        <div className="w-[300px]">
          <p className="text-gray-200 md:text-xl mb-2">2. Share</p>
          <img
            src="/pwa/computer/mac-add-dock.gif"
            alt="iOS share guide"
            className="rounded-lg border border-gray-300 h-[170px] w-full object-cover"
          />
          <p className="text-gray-200 text-sm sm:text-base mt-2">
            Tap the <strong>Share</strong> button
          </p>
        </div>
        <div className="w-[300px]">
          <p className="text-gray-200 md:text-xl mb-2">3. Add to Home</p>
          <img
            src="/pwa/computer/mac-add-homescreen.gif"
            alt="iOS Add to Home guide"
            className="rounded-lg border border-gray-300 h-[170px] w-full object-cover"
          />
          <p className="text-gray-200 text-sm sm:text-base mt-2">
            Select <span className="font-bold">Add to Home Screen</span>
          </p>
        </div>
      </div>
    </div>
  );


  const retriggerPrompt = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-black">
      <IosDownloadBtn onClick={handleIosClick} />
      <AndroidDownloadBtn onClick={handleAndroidClick} />
      <ComputerDownloadBtn onClick={handleComputerClick} />

      {/* iOS Modal with Carousel */}
      <Dialog open={openModal === "ios"} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-[90vw] sm:max-w-md bg-black bg-opacity-90 backdrop-blur-sm text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2 font-bold text-xl text-center sm:text-2xl bg-gradient-to-b from-white to-gray-400 text-transparent bg-clip-text">
              <img src={'/pwa/ios/apple-icon.svg'} width={20} height={20}/>
              Download for IOS
            </DialogTitle>
          </DialogHeader>
          <CarouselWithDots slides={iosSlides} isMobile={isIos || isAndroid} />
          <Button onClick={() => setOpenModal(null)} className="w-full bg-gradient-to-b from-white to-gray-400 hover:from-gray-300 hover:to-gray-500 text-gray-800">
            Got it
          </Button>
        </DialogContent>
      </Dialog>

      {/* Android Modal with Carousel */}
      <Dialog open={openModal === "android"} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-[90vw] sm:max-w-md bg-black bg-opacity-90 backdrop-blur-sm text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2 font-bold text-xl text-center sm:text-2xl bg-gradient-to-b from-green-100 to-green-500 text-transparent bg-clip-text">
              <img src={'/pwa/android/android-icon.svg'} width={20} height={20}/>
              Download for Android
            </DialogTitle>
          </DialogHeader>
          <CarouselWithDots slides={androidSlides} isMobile={isIos || isAndroid} />
          <Button onClick={() => setOpenModal(null)} className="w-full bg-gradient-to-br from-green-800 to-green-400 hover:from-green-900 hover:to-green-500 text-white">
            Got it
          </Button>
        </DialogContent>
      </Dialog>

      {/* Computer Modal */}
      <Dialog open={openModal === "computer"} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-[90vw] md:max-w-6xl max-h-[90vh] bg-black bg-opacity-90 backdrop-blur-sm text-white">
          <DialogHeader>
            <DialogTitle className="font-bold text-center text-white text-xl sm:text-2xl flex justify-center">
              <Download className="w-7 h-7 mr-2"/>
              <p>How to install EGBO on Window & Mac</p>
            </DialogTitle>
          </DialogHeader>
          {computerContent}
          <a onClick={retriggerPrompt} className="text-blue-200 text-sm text-center underline hover:cursor-pointer">
            Problem? Download again
          </a>
          {/* <Button onClick={() => setOpenModal(null)} className="w-fit px-5 py-2 justify-self-center mt-2 bg-gradient-to-b from-blue-800 to-blue-500 hover:from-blue-900 hover:to-blue-600 text-white">
            Got it
          </Button> */}
        </DialogContent>
      </Dialog>
    </div>
  );
}