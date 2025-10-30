import React from "react";
import Svg, { Path } from "react-native-svg";

interface PinIconProps {
  selected?: boolean;
  size?: number;
}

export function PinIcon({ selected = false, size = 32 }: PinIconProps) {
  if (selected) {
    return (
      <Svg width={size} height={size} viewBox="0 0 32 32">
        <Path
          d="M16 2C10.48 2 6 6.48 6 12c0 7.5 10 18 10 18s10-10.5 10-18c0-5.52-4.48-10-10-10zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
          fill="#67FFB3"
        />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Path
        d="M16 2C10.48 2 6 6.48 6 12c0 7.5 10 18 10 18s10-10.5 10-18c0-5.52-4.48-10-10-10zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
        fill="#6B7280"
      />
    </Svg>
  );
}
