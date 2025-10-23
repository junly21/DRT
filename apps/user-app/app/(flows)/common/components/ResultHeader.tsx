import React from "react";
import { View, Text, Image } from "react-native";

interface ResultHeaderProps {
  title: string;
  subtitle: string;
}

export function ResultHeader({ title, subtitle }: ResultHeaderProps) {
  return (
    <View style={{ width: "100%", alignItems: "center", marginTop: 47 }}>
      {/* Check Icon */}
      <View style={{ marginBottom: 8 }}>
        <Image
          source={require("../../../../assets/check.svg")}
          style={{ width: 29, height: 38 }}
          resizeMode="contain"
        />
      </View>

      {/* Main Title */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          color: "#222222",
          marginBottom: 4,
        }}>
        {title}
      </Text>

      {/* Subtitle */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: "500",
          textAlign: "center",
          opacity: 0.5,
          color: "#222222",
          marginBottom: 16,
        }}>
        {subtitle}
      </Text>
    </View>
  );
}
