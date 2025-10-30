import React from "react";
import Svg, { Path, G } from "react-native-svg";

interface FerryIconProps {
  size?: "sm" | "md" | "lg";
  color?: string;
}

const sizeMap = {
  sm: 12,
  md: 24,
  lg: 48,
};

export function FerryIcon({ size = "md", color = "#222222" }: FerryIconProps) {
  const iconSize = sizeMap[size];

  return (
    <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24">
      <G fill={color}>
        {/* 간단한 여객선 아이콘 */}
        <Path d="M2 18h20v2H2z" />
        <Path d="M4 16h16v2H4z" />
        <Path d="M6 14h12v2H6z" />
        <Path d="M8 12h8v2H8z" />
        <Path d="M10 10h4v2h-4z" />
        <Path d="M12 8h2v2h-2z" />
      </G>
    </Svg>
  );
}
