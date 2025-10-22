import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "./Screen";
import { StopPicker } from "./StopPicker";
import { api } from "@drt/api-client";
import { queryKeys } from "@drt/utils";

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
    bgColor: string;
    textColor: string;
  };
  selectedStopLabel?: string; // 선택된 정류장 라벨 (예: "선택된 승차 정류장", "선택된 하차 정류장")
  emptyStateText?: string; // 정류장 미선택 시 버튼 텍스트
}

// Material Icons (이 부분은 나중에 별도 패키지로 분리할 수 있음)
const MATERIAL_ICONS = {
  back: "←",
  check: "✓",
};

// Button classes utility function
const getButtonClasses = (
  variant: "primary" | "success",
  disabled: boolean
) => {
  const baseClasses =
    "w-full py-4 rounded-xl items-center justify-center shadow-sm";

  if (disabled) {
    return `${baseClasses} bg-gray-300`;
  }

  if (variant === "primary") {
    return `${baseClasses} bg-blue-600`;
  } else {
    return `${baseClasses} bg-green-600`;
  }
};

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
  selectedStopLabel = "선택된 승차 정류장",
  emptyStateText = "승차 정류장을 선택해주세요",
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
  // Note: ferry mode also uses bus stops since it's actually a bus call app
  const stopType = mode === "ferry" ? "bus" : mode;
  const filteredStops = stops
    .filter(
      (stop) =>
        stop.type === stopType && (!excludeStopId || stop.id !== excludeStopId)
    )
    .map((stop) => {
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
    .sort((a, b) => {
      if (sortBy === "name") {
        // 가나다순 정렬
        return a.name.localeCompare(b.name, "ko");
      } else {
        // 거리순 정렬 (기본값)
        return a.distance - b.distance;
      }
    });

  const handleStopSelect = (stop: any) => {
    onStopSelect(stop.id);
  };

  const handleBack = () => {
    router.back();
  };

  const selectedStop = filteredStops.find((stop) => stop.id === selectedStopId);

  const getThemeColors = () => {
    if (mode === "ferry") {
      return {
        primary: "bg-blue-600",
        primaryDisabled: "bg-gray-300",
        primaryText: "text-white",
        primaryTextDisabled: "text-gray-500",
        accent: "bg-blue-50",
        accentText: "text-blue-800",
        accentTextSecondary: "text-blue-700",
        accentTextTertiary: "text-blue-600",
        borderColor: "border-blue-200",
        iconBg: "bg-blue-100",
      };
    } else {
      return {
        primary: "bg-green-600",
        primaryDisabled: "bg-gray-300",
        primaryText: "text-white",
        primaryTextDisabled: "text-gray-500",
        accent: "bg-green-50",
        accentText: "text-green-800",
        accentTextSecondary: "text-green-700",
        accentTextTertiary: "text-green-600",
        borderColor: "border-green-200",
        iconBg: "bg-green-100",
      };
    }
  };

  const theme = getThemeColors();

  return (
    <Screen>
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white px-6 py-4 border-b border-gray-100">
          <View className="flex-row items-center">
            <TouchableOpacity
              className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center mr-4"
              onPress={handleBack}>
              <Text className="text-lg text-gray-700">
                {MATERIAL_ICONS.back}
              </Text>
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900">{title}</Text>
              <Text className="text-sm text-gray-600 mt-1">{subtitle}</Text>
            </View>
            <View
              className={`w-12 h-12 ${theme.iconBg} rounded-xl items-center justify-center`}>
              <Text className="text-xl">📍</Text>
            </View>
          </View>
        </View>

        {/* Stop Picker */}
        <View className="flex-1 px-6 py-4">
          <StopPicker
            stops={filteredStops}
            isLoading={isLoading}
            error={error?.message || null}
            userLocation={sortBy === "distance" ? mockUserLocation : null}
            selectedStopId={selectedStopId}
            onSelect={handleStopSelect}
            title={`${mode === "ferry" ? "여객선" : "버스"} 정류장 목록 ${sortBy === "name" ? "(이름순)" : "(거리순)"}`}
            placeholder="정류장 이름을 검색하세요"
            filterType={mode}
          />
        </View>

        {/* Selected Stop Summary */}
        {selectedStop && (
          <View className="px-6 pb-4">
            <View
              className={`${theme.accent} rounded-2xl p-6 border-2 ${theme.borderColor}`}>
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 bg-white rounded-full items-center justify-center mr-3">
                  <Text className="text-sm text-green-600">
                    {MATERIAL_ICONS.check}
                  </Text>
                </View>
                <Text className={`text-sm font-bold ${theme.accentText}`}>
                  {selectedStopLabel}
                </Text>
              </View>
              <Text
                className={`text-lg font-bold ${theme.accentTextSecondary} mb-2`}>
                {selectedStop.name}
              </Text>
              {selectedStop.address && (
                <Text
                  className={`text-sm ${theme.accentTextTertiary} font-medium`}>
                  📍 {selectedStop.address}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Info Card */}
        {infoCard && (
          <View className="px-6 pb-4">
            <View
              className={`${infoCard.bgColor} rounded-2xl p-4 border ${infoCard.bgColor.replace("50", "200")}`}>
              <Text className={`${infoCard.textColor} font-semibold mb-2`}>
                {infoCard.title}
              </Text>
              <Text className={`${infoCard.textColor} text-sm`}>
                {infoCard.content}
              </Text>
            </View>
          </View>
        )}

        {/* Next Button */}
        <View className="px-6 pb-6">
          <TouchableOpacity
            className={getButtonClasses(
              mode === "ferry" ? "primary" : "success",
              !selectedStopId
            )}
            onPress={onNext}
            disabled={!selectedStopId}>
            <Text
              className={`text-lg font-bold text-center ${
                selectedStopId ? "text-white" : "text-gray-500"
              }`}>
              {selectedStopId ? nextButtonText : emptyStateText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}
