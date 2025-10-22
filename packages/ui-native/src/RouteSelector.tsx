import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { Screen } from "./Screen";
import {
  getButtonClasses,
  getCardClasses,
  MATERIAL_ICONS,
  CONTAINER_CLASSES,
} from "@drt/utils";

export interface Route {
  id: string;
  name: string;
  description: string;
  duration: string;
  stops: string[];
  frequency: string;
  price?: number;
  color?: string;
}

interface RouteSelectorProps {
  mode: "ferry" | "bus";
  title: string;
  subtitle: string;
  routes: Route[];
  selectedRouteId: string | null;
  onRouteSelect: (route: Route) => void;
  onNext: () => void;
  nextButtonText?: string;
  infoCard?: {
    title: string;
    content: string;
    bgColor: string;
    textColor: string;
  };
}

export function RouteSelector({
  mode,
  title,
  subtitle,
  routes,
  selectedRouteId,
  onRouteSelect,
  onNext,
  nextButtonText = "다음 단계",
  infoCard,
}: RouteSelectorProps) {
  // 색상 클래스 매핑 (NativeWind 동적 클래스 문제 해결)
  const getColorClass = (colorString: string | undefined) => {
    switch (colorString) {
      case "bg-blue-500":
        return "bg-blue-500";
      case "bg-green-500":
        return "bg-green-500";
      case "bg-purple-500":
        return "bg-purple-500";
      case "bg-red-500":
        return "bg-red-500";
      case "bg-orange-500":
        return "bg-orange-500";
      case "bg-yellow-500":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getThemeColors = () => {
    if (mode === "ferry") {
      return {
        primary: "bg-blue-600",
        primaryDisabled: "bg-gray-300",
        primaryText: "text-white",
        primaryTextDisabled: "text-gray-500",
        selected: "border-blue-600 bg-blue-50",
        selectedText: "text-blue-900",
        selectedTextSecondary: "text-blue-800",
        selectedTextTertiary: "text-blue-700",
        checkmark: "bg-blue-600",
        badge: "bg-blue-100 text-blue-800",
      };
    } else {
      return {
        primary: "bg-green-600",
        primaryDisabled: "bg-gray-300",
        primaryText: "text-white",
        primaryTextDisabled: "text-gray-500",
        selected: "border-green-600 bg-green-50",
        selectedText: "text-green-900",
        selectedTextSecondary: "text-green-800",
        selectedTextTertiary: "text-green-700",
        checkmark: "bg-green-600",
        badge: "bg-green-100 text-green-800",
      };
    }
  };

  const theme = getThemeColors();

  return (
    <Screen>
      <View className="flex-1">
        {/* 헤더 섹션 - 표준화된 클래스 사용 */}
        <View className={CONTAINER_CLASSES.header}>
          <View className="items-center">
            <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
              {title}
            </Text>
            <Text className="text-gray-600 text-center text-lg leading-6 px-4">
              {subtitle}
            </Text>
          </View>
        </View>

        {/* 메인 콘텐츠 영역 */}
        <ScrollView
          className={CONTAINER_CLASSES.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}>
          {/* 노선 목록 */}
          <View>
            {routes.map((route, index) => {
              const isSelected = selectedRouteId === route.id;
              return (
                <TouchableOpacity
                  key={route.id}
                  className={`rounded-2xl p-6 ${index > 0 ? "mt-4" : ""} ${
                    isSelected
                      ? `${theme.primary} shadow-xl border-2 border-opacity-20`
                      : "bg-white shadow-md border border-gray-100"
                  }`}
                  onPress={() => onRouteSelect(route)}
                  style={{
                    shadowColor: isSelected ? "#000" : "#000",
                    shadowOffset: { width: 0, height: isSelected ? 8 : 4 },
                    shadowOpacity: isSelected ? 0.15 : 0.08,
                    shadowRadius: isSelected ? 12 : 8,
                    elevation: isSelected ? 8 : 4,
                  }}>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      {/* 노선 번호 원형 배지 */}
                      <View
                        className={`w-14 h-14 ${getColorClass(
                          route.color
                        )} rounded-full items-center justify-center mr-5 shadow-sm`}>
                        <Text
                          className="text-white text-lg font-bold"
                          numberOfLines={1}
                          allowFontScaling={false}>
                          {(() => {
                            const simpleMatch = route.name.match(/\d+/);
                            return simpleMatch?.[0] ?? "?";
                          })()}
                        </Text>
                      </View>

                      <View className="flex-1">
                        <Text
                          className={`text-lg font-semibold mb-1 ${
                            isSelected ? "text-white" : "text-gray-900"
                          }`}>
                          {route.name}
                        </Text>
                        <Text
                          className={`text-sm ${
                            isSelected
                              ? "text-white opacity-90"
                              : "text-gray-600"
                          }`}>
                          {route.duration} • {route.frequency}
                        </Text>
                      </View>
                    </View>

                    {/* 선택 표시 */}
                    {isSelected && (
                      <View className="w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm">
                        <Text className="text-green-600 text-base font-bold">
                          ✓
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Info Card - 개선된 스타일링 */}
          {infoCard && (
            <View
              className={`${infoCard.bgColor} rounded-2xl p-6 mt-8 border border-opacity-20`}>
              <Text
                className={`${infoCard.textColor} font-semibold text-base mb-3`}>
                {infoCard.title}
              </Text>
              <Text className={`${infoCard.textColor} text-sm leading-6`}>
                {infoCard.content}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* 하단 버튼 - 표준화된 클래스 사용 */}
        <View className={CONTAINER_CLASSES.footer}>
          <TouchableOpacity
            className={`rounded-2xl p-6 shadow-lg ${
              selectedRouteId
                ? `${theme.primary} active:opacity-90`
                : "bg-gray-300"
            }`}
            onPress={onNext}
            disabled={!selectedRouteId}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}>
            <View className="items-center">
              <Text
                className={`text-xl font-bold ${
                  selectedRouteId ? "text-white" : "text-gray-500"
                }`}>
                {selectedRouteId ? nextButtonText : "노선을 선택해주세요"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}
