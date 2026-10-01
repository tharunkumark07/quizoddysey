import React from 'react';
import collegeLogo from '../assets/college-logo.png';

interface RmkLogoProps {
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
}

export const RmkLogo: React.FC<RmkLogoProps> = ({
  className = "h-14 w-auto",
  alt = "R.M.K. Engineering College Logo",
  style,
}) => {
  return (
    <img
      src={collegeLogo}
      alt={alt}
      className={`object-contain ${className}`}
      style={{
        objectFit: 'contain',
        ...style,
      }}
    />
  );
};
