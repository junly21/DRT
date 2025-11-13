import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

interface ActionButtonsProps {
  onCancelCall: () => void;
  onBackToHome: () => void;
  isCancelDisabled?: boolean;
}

export function ActionButtons({
  onCancelCall,
  onBackToHome,
  isCancelDisabled = false,
}: ActionButtonsProps) {
  return (
    <>
      {/* Bottom Buttons */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 16,
          paddingBottom: 32,
          gap: 12,
        }}>
        <TouchableOpacity
          style={{
            flex: 1,
            height: 59,
            backgroundColor: isCancelDisabled ? "#d1d5db" : "#f26264",
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 0.12,
            shadowRadius: 3,
            elevation: 3,
          }}
          disabled={isCancelDisabled}
          onPress={onCancelCall}>
          <Text
            style={{
              color: isCancelDisabled ? "#6B7280" : "white",
              fontSize: 18,
              fontWeight: "bold",
            }}>
            호출취소
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            height: 59,
            backgroundColor: "#222222",
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 0.12,
            shadowRadius: 3,
            elevation: 3,
          }}
          onPress={onBackToHome}>
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
            홈으로 돌아가기
          </Text>
        </TouchableOpacity>
      </View>

      {/* KICT Logo */}
      <View
        style={{
          width: "100%",
          alignItems: "center",
          paddingBottom: 52,
        }}>
        <Image
          source={require("../../../../assets/KICT.png")}
          style={{ width: 201, height: 43 }}
          resizeMode="contain"
        />
      </View>
    </>
  );
}
