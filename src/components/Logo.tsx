import React from "react";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon" | "footer";
}

export const Logo: React.FC<LogoProps> = ({ className = "h-12", variant = "full" }) => {
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 200 74"
        className="h-10 sm:h-12 md:h-14 w-auto max-w-[170px] sm:max-w-[195px] md:max-w-[220px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="ABCO Food Supply (AFS)"
      >
        {/* Top Green Swoosh Arc over F and S */}
        <path
          d="M 64,13 C 98,-3 146,0 174,18"
          stroke="#009640"
          strokeWidth="3.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* --- MAIN AFS LETTERS --- */}
        <g fontWeight="950" fontStyle="italic" fontFamily="system-ui, -apple-system, sans-serif">
          {/* Bold Red 'A' */}
          <text
            x="8"
            y="42"
            fill="#e31837"
            fontSize="46"
            letterSpacing="-1.5"
          >
            A
          </text>

          {/* Bold Dark Navy 'F' */}
          <text
            x="50"
            y="42"
            fill="#0b1c3d"
            fontSize="46"
            letterSpacing="-1.5"
          >
            F
          </text>

          {/* Bold Dark Navy 'S' */}
          <text
            x="86"
            y="42"
            fill="#0b1c3d"
            fontSize="46"
            letterSpacing="-1.5"
          >
            S
          </text>
        </g>

        {/* Green leaf accent inside the letter 'A' */}
        <path
          d="M 26,29 C 24,35 29,39 32,37 C 34,35 34,31 30,27 C 28,25 26,27 26,29 Z"
          fill="#009640"
        />

        {variant !== "icon" && (
          <>
            {/* --- MIDDLE ROW: ABCO FOOD SUPPLY --- */}
            <g
              fontSize="14"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="0.8"
            >
              {/* ABCO in Navy */}
              <text x="8" y="58" fill="#0b1c3d">
                ABCO
              </text>
              {/* FOOD in Red */}
              <text x="58" y="58" fill="#e31837">
                FOOD
              </text>
              {/* SUPPLY in Navy */}
              <text x="106" y="58" fill="#0b1c3d">
                SUPPLY
              </text>
            </g>

            {/* --- BOTTOM ROW: TAGLINE --- */}
            <text
              x="9"
              y="70"
              fontSize="8.5"
              fontWeight="600"
              fontFamily="system-ui, -apple-system, sans-serif"
              fill="#475569"
              letterSpacing="0.4"
            >
              Quality Food, Reliable Supply
            </text>
          </>
        )}
      </svg>
    </div>
  );
};
