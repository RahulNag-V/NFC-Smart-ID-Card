"use client";

import React from "react";
import { motion } from "framer-motion";

export interface MenuItem {
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

export interface FloatingMenuProps {
  items?: MenuItem[];
  accentColor?: string;
  darkColor?: string;
  activeLabel?: string;
}

export function FloatingMenu({
  items,
  accentColor = "#704a29",
  darkColor = "#1E1813",
  activeLabel,
}: FloatingMenuProps) {
  const menuItems: MenuItem[] = items ?? [
    { label: "Home" },
    { label: "Works" },
    { label: "Contact" },
  ];

  return (
    <nav
      aria-label="Floating Navigation Bar"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] print:hidden select-none"
    >
      <div className="flex items-center gap-1 p-1.5 rounded-full bg-[#FAF9F6]/90 backdrop-blur-xl border border-stone-200/90 shadow-xl transition-all duration-300">
        {menuItems.map((item) => {
          const isActive =
            item.isActive !== undefined
              ? item.isActive
              : activeLabel?.toLowerCase() === item.label.toLowerCase();

          return (
            <button
              key={item.label}
              type="button"
              onClick={item.onClick}
              className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-white shadow-xs'
                  : 'text-[#6B5E52] hover:text-[#1E1813] hover:bg-stone-200/40'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="floating-dock-active-pill"
                  className="absolute inset-0 rounded-full -z-10"
                  style={{ backgroundColor: accentColor }}
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-pulse" />}
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default FloatingMenu;
