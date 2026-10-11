import React from "react";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon" | "footer";
}

export const Logo: React.FC<LogoProps> = ({ className = "h-12", variant = "full" }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Stylized AFS Brand Badge */}
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 160 60"
          className="h-10 md:h-12 w-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top Green Accent Arc */}
          <path
            d="M 20,12 Q 80,-4 140,12"
            stroke="#009640"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* AFS Bold Letters */}
          <g fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fontStyle="italic">
            <text x="12" y="38" fill="#e31837" fontSize="32" letterSpacing="-1">
              A
            </text>
            <text x="44" y="38" fill="#1e293b" fontSize="32" letterSpacing="-1">
              F
            </text>
            <text x="72" y="38" fill="#e31837" fontSize="32" letterSpacing="-1">
              S
            </text>
          </g>
          {/* Bottom Green swoosh */}
          <path
            d="M 12,46 Q 75,54 145,44"
            stroke="#009640"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Subtle wheat / leaf accent icon */}
          <circle cx="138" cy="20" r="3" fill="#009640" />
          <circle cx="144" cy="16" r="2" fill="#e31837" />
        </svg>
      </div>

      {variant !== "icon" && (
        <div className="flex flex-col border-l border-slate-200 pl-2.5">
          <span className="font-black text-sm md:text-base tracking-wider text-slate-900 leading-none">
            ABCO FOOD SUPPLY
          </span>
          <span className="text-[10px] md:text-[11px] font-semibold text-brand-red tracking-tight mt-0.5">
            Leading Food, Reliable Quality
          </span>
        </div>
      )}
    </div>
  );
};
