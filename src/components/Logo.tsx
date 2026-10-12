import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  imageClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  imageClassName = "h-12 sm:h-14 md:h-16 w-auto",
}) => {
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {/* width/height = 2x the largest rendered size, so next/image serves a small file */}
      <Image
        src="/categories/logo.png"
        alt="ABCO Food Supply (AFS)"
        width={256}
        height={144}
        priority
        className={imageClassName}
      />
    </div>
  );
};
