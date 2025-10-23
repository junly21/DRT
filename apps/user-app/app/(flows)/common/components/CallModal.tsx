import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";

interface CallModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function CallModal({
  visible,
  message,
  onClose,
  onConfirm,
}: CallModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 24,
            width: "100%",
            maxWidth: 320,
          }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#222222",
              textAlign: "center",
              marginBottom: 16,
            }}>
            📞 전화하기
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#6b7280",
              textAlign: "center",
              marginBottom: 24,
            }}>
            {message}
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#d1d5db",
                borderRadius: 12,
                paddingVertical: 12,
              }}
              onPress={onClose}>
              <Text
                style={{
                  color: "#374151",
                  textAlign: "center",
                  fontWeight: "600",
                }}>
                취소
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#16a34a",
                borderRadius: 12,
                paddingVertical: 12,
              }}
              onPress={onConfirm}>
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "600",
                }}>
                전화하기
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
