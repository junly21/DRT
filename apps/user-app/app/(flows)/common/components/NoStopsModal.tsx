import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

interface NoStopsModalProps {
  visible: boolean;
  message?: string;
  onConfirm: () => void;
}

export function NoStopsModal({
  visible,
  message,
  onConfirm,
}: NoStopsModalProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onConfirm}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}>
        <View
          style={{
            width: "100%",
            maxWidth: 340,
            backgroundColor: "#FFFFFF",
            borderRadius: 20,
            padding: 24,
          }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 16,
              textAlign: "center",
            }}>
            승차 가능한 정류장이 없습니다
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#4B5563",
              textAlign: "center",
              marginBottom: 24,
              lineHeight: 24,
            }}>
            {message || "금일 배차 중 승차 가능한 정류장이 없습니다."}
          </Text>
          <TouchableOpacity
            style={{
              width: "100%",
              backgroundColor: "#2563EB",
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: "center",
            }}
            onPress={onConfirm}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#FFFFFF",
              }}>
              확인
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

