import React from "react";

export const Vision2030Badge: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-sm border border-slate-100 ${className}`}>
      {/* Saudi Emblem & 2030 */}
      <div className="flex flex-col items-center border-r border-slate-200 pr-3">
        <div className="flex items-center gap-1">
          {/* Saudi Palm & Swords SVG */}
          <svg className="w-5 h-5 text-emerald-800" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C12.5 4 14 6 16 6C14 7 13 8 12.5 10C12 8 11 7 9 6C11 6 11.5 4 12 2Z" />
            <path d="M7 14L17 14M9 12L15 16M15 12L9 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 7V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div className="leading-none">
            <span className="text-[11px] font-black tracking-tight text-slate-800 block">
              VISION رؤيـــــة
            </span>
            <span className="text-base font-black tracking-widest text-slate-900 leading-none">
              2030
            </span>
          </div>
        </div>
        <span className="text-[7.5px] uppercase tracking-tighter text-slate-500 font-semibold mt-0.5">
          Kingdom of Saudi Arabia
        </span>
      </div>

      {/* Slogan */}
      <div className="flex flex-col justify-center">
        <span className="font-serif italic text-xs md:text-sm font-semibold text-slate-800 leading-tight">
          Quality Food
        </span>
        <span className="font-serif italic text-[11px] text-brand-red font-medium leading-tight">
          for a Better Tomorrow
        </span>
      </div>
    </div>
  );
};
