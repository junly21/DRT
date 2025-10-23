import React from "react";
import { View, Text } from "react-native";

interface TripInfoCardProps {
  mode: "passenger" | "bus" | null;
  originStopName: string | undefined;
  destStopName: string | undefined;
  estimatedBoardingTime?: string;
  estimatedAlightingTime?: string;
}

export function TripInfoCard({
  mode,
  originStopName,
  destStopName,
  estimatedBoardingTime,
  estimatedAlightingTime,
}: TripInfoCardProps) {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.16,
        shadowRadius: 3,
        elevation: 3,
      }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}>
        <View
          style={{
            width: 48,
            height: 48,
            backgroundColor: mode === "passenger" ? "#dbeafe" : "#dcfce7",
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
          }}>
          <Text style={{ fontSize: 24 }}>
            {mode === "passenger" ? "⛴️" : "🚌"}
          </Text>
        </View>
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#222222",
            }}>
            {mode === "passenger" ? "여객선 이용" : "버스 이용"}
          </Text>
          <Text style={{ fontSize: 14, color: "#6b7280" }}>여행 정보</Text>
        </View>
      </View>

      {/* Route */}
      <View
        style={{
          backgroundColor: "#f9fafb",
          borderRadius: 12,
          padding: 16,
        }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>
              출발지
            </Text>
            <Text style={{ fontWeight: "600", color: "#222222" }}>
              {originStopName || "정류장 정보 로딩 중..."}
            </Text>
          </View>
          <View style={{ marginHorizontal: 16 }}>
            <Text style={{ fontSize: 24, color: "#9ca3af" }}>→</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>
              도착지
            </Text>
            <Text style={{ fontWeight: "600", color: "#222222" }}>
              {destStopName || "정류장 정보 로딩 중..."}
            </Text>
          </View>
        </View>
      </View>

      {/* Time Information */}
      {(estimatedBoardingTime || estimatedAlightingTime) && (
        <View
          style={{
            backgroundColor: "#dbeafe",
            borderRadius: 12,
            padding: 16,
            marginTop: 16,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: "#1e40af",
              marginBottom: 12,
            }}>
            ⏰ 예상 운행 시간
          </Text>
          <View style={{ gap: 8 }}>
            {estimatedBoardingTime && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Text style={{ fontSize: 14, color: "#1e40af" }}>
                  탑승 예정시간
                </Text>
                <Text style={{ fontWeight: "600", color: "#1e40af" }}>
                  {new Date(estimatedBoardingTime).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            )}
            {estimatedAlightingTime && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Text style={{ fontSize: 14, color: "#1e40af" }}>
                  하차 예정시간
                </Text>
                <Text style={{ fontWeight: "600", color: "#1e40af" }}>
                  {new Date(estimatedAlightingTime).toLocaleTimeString(
                    "ko-KR",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
