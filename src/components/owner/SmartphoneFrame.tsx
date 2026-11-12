import React from 'react';
import { Wifi } from 'lucide-react';

interface SmartphoneFrameProps {
  children: React.ReactNode;
  className?: string;
  frameHeightClass?: string;
}

export const SmartphoneFrame: React.FC<SmartphoneFrameProps> = ({
  children,
  className = '',
  frameHeightClass = 'h-[740px] sm:h-[780px]',
}) => {
  return (
    <div className={`relative mx-auto my-2 shrink-0 ${className}`}>
      {/* Physical Side Buttons (Protruding from chassis) */}
      {/* Left Edge: Action Button */}
      <div
        className="absolute -left-[14px] top-[102px] w-[3px] h-[26px] bg-[#292524] rounded-l-[3px] border-l border-y border-[#57534e]/60 shadow-xs pointer-events-none z-10"
        aria-hidden="true"
      />
      {/* Left Edge: Volume Up */}
      <div
        className="absolute -left-[14px] top-[146px] w-[3px] h-[52px] bg-[#292524] rounded-l-[3px] border-l border-y border-[#57534e]/60 shadow-xs pointer-events-none z-10"
        aria-hidden="true"
      />
      {/* Left Edge: Volume Down */}
      <div
        className="absolute -left-[14px] top-[210px] w-[3px] h-[52px] bg-[#292524] rounded-l-[3px] border-l border-y border-[#57534e]/60 shadow-xs pointer-events-none z-10"
        aria-hidden="true"
      />
      {/* Right Edge: Side / Power Button */}
      <div
        className="absolute -right-[14px] top-[168px] w-[3px] h-[76px] bg-[#292524] rounded-r-[3px] border-r border-y border-[#57534e]/60 shadow-xs pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* Main Smartphone Chassis (Dark Titanium / Matte Black with subtle outer rim) */}
      <div className="w-[375px] sm:w-[385px] max-w-full rounded-[48px] border-[12px] border-[#1c1917] bg-[#1c1917] shadow-2xl shadow-black/55 ring-1 ring-[#44403c]/70 ring-offset-1 ring-offset-[#1c1917] transition-all relative">
        {/* Inner Phone Screen Display */}
        <div
          className={`relative w-full ${frameHeightClass} max-h-[calc(100vh-140px)] rounded-[36px] overflow-hidden bg-[#fbf8f3] flex flex-col`}
        >
          {/* iOS Status Bar with Dynamic Island */}
          <div className="sticky top-0 z-40 bg-[#fbf8f3]/95 backdrop-blur-md pt-2.5 pb-1.5 px-6 flex items-center justify-between select-none pointer-events-none border-b border-[#d9cdbd]/25 shrink-0">
            {/* Left: Clock */}
            <span className="text-[12px] font-semibold text-[#1c1917] tracking-tight font-sans pl-1">
              9:41
            </span>

            {/* Center: Dynamic Island Cutout */}
            <div className="w-28 h-7 bg-black rounded-full flex items-center justify-end pr-2.5 shadow-xs relative pointer-events-none">
              {/* Camera Lens Reflection Dot */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#0a0f1d] border border-[#1e293b]/80 relative flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#3b82f6]/30 absolute top-0.5 right-0.5" />
                <div className="w-0.5 h-0.5 rounded-full bg-white/50 absolute top-0.5 right-0.5" />
              </div>
            </div>

            {/* Right: Cellular, Wi-Fi, and Battery Status Icons */}
            <div className="flex items-center gap-1.5 text-[#1c1917] pr-1">
              {/* Cellular Signal (4 bars) */}
              <div className="flex items-end gap-[1.5px] h-2.5" title="Cellular Signal">
                <div className="w-[2.5px] h-1 bg-[#1c1917] rounded-[0.5px]" />
                <div className="w-[2.5px] h-1.5 bg-[#1c1917] rounded-[0.5px]" />
                <div className="w-[2.5px] h-2 bg-[#1c1917] rounded-[0.5px]" />
                <div className="w-[2.5px] h-2.5 bg-[#1c1917] rounded-[0.5px]" />
              </div>

              {/* Wi-Fi Icon */}
              <Wifi className="w-3.5 h-3.5 text-[#1c1917]" />

              {/* Battery Indicator with Fill */}
              <div className="flex items-center" title="100% Battery">
                <div className="w-5 h-2.5 rounded-[4px] border border-[#1c1917] p-[1.5px] flex items-center">
                  <div className="w-full h-full bg-[#1c1917] rounded-[1.5px]" />
                </div>
                <div className="w-0.5 h-1 bg-[#1c1917] rounded-r-[0.5px]" />
              </div>
            </div>
          </div>

          {/* Smooth Scrollable Screen Area (Zero desktop scrollbar clutter) */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none relative">
            {children}
          </div>

          {/* Sleek Bottom Home Indicator Bar */}
          <div className="sticky bottom-1.5 z-40 flex justify-center pointer-events-none py-1 shrink-0">
            <div className="w-32 h-1 bg-stone-800/40 rounded-full backdrop-blur-xs" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartphoneFrame;
