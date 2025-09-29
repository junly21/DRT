import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "../ui/Screen";
import { StopPicker } from "./StopPicker";
import { api } from "../../lib/api";
import { queryKeys } from "../../lib/queryClient";
import { getButtonClasses, MATERIAL_ICONS } from "../../lib/design-system";

interface StopSelectorProps {
  mode: "ferry" | "bus";
  title: string;
  subtitle: string;
  selectedStopId: string | null;
  onStopSelect: (stopId: string) => void;
  onNext: () => void;
  nextButtonText?: string;
  excludeStopId?: string | null; // 제외할 정류장 ID (하차 정류장 선택 시 승차 정류장 제외용)
  infoCard?: {
    title: string;
    content: string;
    bgColor: string;
    textColor: string;
  };
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
  infoCard,
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

  // Filter stops based on mode and exclude specific stop if provided
  // Note: ferry mode also uses bus stops since it's actually a bus call app
  const stopType = mode === "ferry" ? "bus" : mode;
  const filteredStops = stops.filter(
    (stop) =>
      stop.type === stopType && (!excludeStopId || stop.id !== excludeStopId)
  );

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
        accent: "bg-blue-100",
        accentText: "text-blue-800",
        accentTextSecondary: "text-blue-700",
        accentTextTertiary: "text-blue-600",
      };
    } else {
      return {
        primary: "bg-green-600",
        primaryDisabled: "bg-gray-300",
        primaryText: "text-white",
        primaryTextDisabled: "text-gray-500",
        accent: "bg-green-100",
        accentText: "text-green-800",
        accentTextSecondary: "text-green-700",
        accentTextTertiary: "text-green-600",
      };
    }
  };

  const theme = getThemeColors();

  return (
    <Screen>
      <View className="flex-1 py-6">
        {/* Header */}
        <View className="flex-row items-center mb-8 pt-6">
          <TouchableOpacity
            className="w-12 h-12 rounded-xl bg-gray-100 items-center justify-center mr-4 shadow-sm border border-gray-200"
            onPress={handleBack}>
            <Text className="text-xl text-gray-700">{MATERIAL_ICONS.back}</Text>
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-3xl font-bold text-gray-900">{title}</Text>
            <Text className="text-base text-gray-600 mt-2 font-medium">
              {subtitle}
            </Text>
          </View>
        </View>

        {/* Stop Picker */}
        <View className="flex-1">
          <StopPicker
            stops={filteredStops}
            isLoading={isLoading}
            error={error?.message || null}
            selectedStopId={selectedStopId}
            onSelect={handleStopSelect}
            title={`${mode === "ferry" ? "여객선" : "버스"} 정류장 목록`}
            placeholder="정류장 이름을 검색하세요"
            filterType={mode}
          />
        </View>

        {/* Selected Stop Summary */}
        {selectedStop && (
          <View
            className={`${theme.accent} rounded-xl p-6 mt-4 mb-4 border-2 ${
              mode === "ferry" ? "border-blue-200" : "border-green-200"
            }`}>
            <View className="flex-row items-center mb-3">
              <Text className="text-xl mr-3">{MATERIAL_ICONS.check}</Text>
              <Text className={`text-sm font-bold ${theme.accentText}`}>
                선택된 승차 정류장
              </Text>
            </View>
            <Text
              className={`text-xl font-bold ${theme.accentTextSecondary} mb-2`}>
              {selectedStop.name}
            </Text>
            {selectedStop.address && (
              <Text
                className={`text-sm ${theme.accentTextTertiary} font-medium`}>
                📍 {selectedStop.address}
              </Text>
            )}
          </View>
        )}

        {/* Info Card */}
        {infoCard && (
          <View className={`${infoCard.bgColor} rounded-xl p-4 mb-4`}>
            <Text className={`${infoCard.textColor} font-semibold mb-2`}>
              {infoCard.title}
            </Text>
            <Text className={`${infoCard.textColor} text-sm`}>
              {infoCard.content}
            </Text>
          </View>
        )}

        {/* Next Button */}
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
            {selectedStopId ? nextButtonText : "승차 정류장을 선택해주세요"}
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}
