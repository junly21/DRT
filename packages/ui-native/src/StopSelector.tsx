import React from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { api, Stop } from "@drt/api-client";
import { queryKeys } from "@drt/utils";
import { StopPicker } from "./StopPicker";

// 타입 정의
type StopWithDistance = Stop & {
  distance: number;
};

interface StopSelectorProps {
  mode: "ferry" | "bus";
  title: string;
  subtitle: string;
  selectedStopId: string | null;
  onStopSelect: (stopId: string) => void;
  onNext: () => void;
  nextButtonText?: string;
  excludeStopId?: string | null; // 제외할 정류장 ID (하차 정류장 선택 시 승차 정류장 제외용)
  sortBy?: "distance" | "name"; // 정렬 방식 (거리순 또는 가나다순)
  infoCard?: {
    title: string;
    content: string;
  };
  selectedStopLabel?: string; // 선택된 정류장 라벨 (예: "선택된 승차 정류장", "선택된 하차 정류장")
  emptyStateText?: string; // 정류장 미선택 시 버튼 텍스트
}

export function StopSelector({
  mode,
  title,
  subtitle,
  selectedStopId,
  onStopSelect,
  onNext,
  nextButtonText = "다음 단계",
  excludeStopId,
  sortBy = "distance",
  infoCard,
  selectedStopLabel = "선택된 정류장",
  emptyStateText = "정류장을 선택해주세요",
}: StopSelectorProps) {
  // Fetch all stops
  const {
    data: stops = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.stops,
    queryFn: api.getStops,
  });

  // 시뮬레이션된 사용자 위치 (우실삼거리 근처)
  const mockUserLocation = {
    latitude: 34.6096,
    longitude: 127.3312,
  };

  // Filter stops based on mode and exclude specific stop if provided
  const stopType = mode === "ferry" ? "bus" : mode;
  const filteredStops = stops
    .filter(
      (stop: Stop) =>
        stop.type === stopType && (!excludeStopId || stop.id !== excludeStopId)
    )
    .map((stop: Stop) => {
      const stopWithDistance = {
        ...stop,
        distance:
          Math.sqrt(
            Math.pow(mockUserLocation.latitude - stop.latitude, 2) +
              Math.pow(mockUserLocation.longitude - stop.longitude, 2)
          ) * 111000, // 대략적인 거리 계산 (1도 ≈ 111km)
      };
      return stopWithDistance;
    })
    .sort((a: StopWithDistance, b: StopWithDistance) => {
      if (sortBy === "name") {
        // 가나다순 정렬
        return a.name.localeCompare(b.name, "ko");
      } else {
        // 거리순 정렬 (기본값)
        return a.distance - b.distance;
      }
    });

  const handleStopSelect = (stop: Stop) => {
    onStopSelect(stop.id);
  };

  const handleBack = () => {
    router.back();
  };

  const selectedStop = filteredStops.find(
    (stop: StopWithDistance) => stop.id === selectedStopId
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#ececec" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ececec" />

      {/* Header Section */}
      <View style={{ width: "100%" }}>
        {/* Main Title */}
        <View style={{ width: "100%", alignItems: "center", marginTop: 24 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              textAlign: "center",
              color: "#222222",
            }}>
            {title}
          </Text>
        </View>

        {/* Subtitle */}
        <View
          style={{
            width: "100%",
            alignItems: "center",
            marginTop: 16,
            paddingHorizontal: 24,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              textAlign: "center",
              opacity: 0.5,
              lineHeight: 24,
              color: "#222222",
            }}>
            {subtitle}
          </Text>
        </View>
      </View>

      {/* StopPicker 컴포넌트 사용 */}
      <StopPicker
        stops={filteredStops}
        selectedStopId={selectedStopId}
        onStopSelect={handleStopSelect}
        selectedStopLabel={selectedStopLabel}
        mode={mode}
        sortBy={sortBy}
      />

      {/* Info Card */}
      {infoCard && (
        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          <View
            style={{
              width: "100%",
              backgroundColor: "#f3f4f6",
              borderRadius: 16,
              padding: 16,
            }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  marginRight: 8,
                  color: "#222222",
                }}>
                ℹ️
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: "#222222",
                }}>
                {infoCard.title}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <View
                style={{
                  width: 4,
                  height: 4,
                  backgroundColor: "#9ca3af",
                  borderRadius: 2,
                  marginTop: 8,
                  marginRight: 12,
                }}
              />
              <Text
                style={{
                  fontSize: 14,
                  opacity: 0.6,
                  flex: 1,
                  lineHeight: 20,
                  color: "#222222",
                }}>
                {infoCard.content}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Bottom Button - Fixed at bottom */}
      <View style={{ paddingHorizontal: 16, marginTop: 24, marginBottom: 32 }}>
        <TouchableOpacity
          onPress={onNext}
          disabled={!selectedStopId}
          style={{
            width: "100%",
            height: 59,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: selectedStopId ? "#499c73" : "#d1d5db",
            shadowColor: "#000",
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 0.12,
            shadowRadius: 3,
            elevation: 3,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: selectedStopId ? "white" : "#6b7280",
            }}>
            {selectedStopId ? nextButtonText : emptyStateText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
