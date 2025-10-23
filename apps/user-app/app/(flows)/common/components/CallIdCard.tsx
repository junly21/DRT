import React from "react";
import { View, Text } from "react-native";

interface CallIdCardProps {
  callId: string;
}

export function CallIdCard({ callId }: CallIdCardProps) {
  return (
    <View
      style={{
        backgroundColor: "#f3f4f6",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
      }}>
      <Text style={{ fontSize: 14, color: "#6b7280", textAlign: "center" }}>
        호출 번호: {callId}
      </Text>
    </View>
  );
}
