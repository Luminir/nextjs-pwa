"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Search,
  Bell,
  User,
  Settings,
  Sparkles,
} from "lucide-react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileDevice, setIsMobileDevice] = React.useState(false);

  React.useEffect(() => {
    const ua = navigator.userAgent || "";
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);
    setIsMobileDevice(isIOS || isAndroid);
  }, []);

  const nav = [
    { href: "/", label: "Home", icon: Home },
    { href: "/search", label: "Search", icon: Search },
    { href: "/notifications", label: "Alerts", icon: Bell },
    { href: "/profile", label: "Profile", icon: User },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <div className="min-h-dvh bg-black text-white grid grid-rows-[auto_1fr_auto]">
      {/* Top header (desktop + all non-mobile devices) */}
      {!isMobileDevice && (
        <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/40 border-b border-white/10">
          <div className="mx-auto max-w-[1024px] px-4">
            <div className="flex h-14 items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="size-5" />
                <span className="font-semibold">YourApp</span>
              </div>

              <nav className="flex items-center gap-1">
                {nav.map((item) => (
                  <TopNavItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    active={isActive(item.href)}
                  />
                ))}
              </nav>

              <div className="flex items-center gap-2">
                <Link
                  href="/settings"
                  className="inline-flex h-9 items-center rounded-2xl border border-white/10 px-3 text-sm hover:bg-white/5"
                >
                  <Settings className="mr-2 size-4" />
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main content */}
      <main
        className="mx-auto w-full max-w-[1024px] px-4 py-4"
        style={{
          paddingBottom: isMobileDevice
            ? "calc(env(safe-area-inset-bottom, 0px) + 4rem)"
            : "2rem",
        }}
      >
        {children}
      </main>

      {/* Bottom tabs (only real iOS/Android) */}
      {isMobileDevice && (
        <BottomTabs items={nav} activeHrefFn={isActive} />
      )}
    </div>
  );
}

function TopNavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative inline-flex h-9 items-center rounded-2xl px-3 text-sm transition-colors hover:bg-white/5 ${
        active ? "text-white" : "text-white/70"
      }`}
    >
      {label}
      {active && (
        <motion.span
          layoutId="topnav-active"
          className="absolute inset-0 -z-10 rounded-2xl bg-white/10"
          transition={{ type: "spring", stiffness: 400, damping: 34 }}
        />
      )}
    </Link>
  );
}

function BottomTabs({
  items,
  activeHrefFn,
}: {
  items: { href: string; label: string; icon: React.ElementType }[];
  activeHrefFn: (href: string) => boolean;
}) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto grid max-w-[1024px] grid-cols-4 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/50 py-1.5">
        {items.map(({ href, label, icon: Icon }) => {
          const active = activeHrefFn(href);
          return (
            <Link
              key={href}
              href={href}
              className="group relative flex flex-col items-center justify-center px-2"
            >
              <div className="relative">
                <Icon className={`size-6 ${active ? "opacity-100" : "opacity-70"}`} />
                {active && (
                  <motion.span
                    layoutId="tab-active-dot"
                    className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </div>
              <span
                className={`mt-0.5 text-[11px] leading-none ${
                  active ? "text-white" : "text-white/70"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
