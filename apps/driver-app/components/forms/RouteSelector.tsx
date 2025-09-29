import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { Screen } from "../ui/Screen";
import {
  getButtonClasses,
  getCardClasses,
  MATERIAL_ICONS,
} from "../../lib/design-system";

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
  const handleBack = () => {
    router.back();
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
      };
    }
  };

  const theme = getThemeColors();

  return (
    <Screen>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center mb-8 pt-6 px-6">
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

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}>
          {routes.map((route) => {
            const isSelected = selectedRouteId === route.id;
            return (
              <TouchableOpacity
                key={route.id}
                className={`${getCardClasses(
                  isSelected ? "selected" : "default"
                )} mb-4`}
                onPress={() => onRouteSelect(route)}>
                {/* Route Header */}
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    {/* Route Badge/Icon */}
                    {route.color ? (
                      <View
                        className={`w-9 h-9 ${route.color} rounded-lg items-center justify-center mr-3`}>
                        <Text
                          className="text-white text-sm font-bold leading-none"
                          numberOfLines={1}
                          allowFontScaling={false}
                          ellipsizeMode="clip">
                          {route.name.match(/\d+/)?.[0] ??
                            route.name.replace("번", "").trim()}
                        </Text>
                      </View>
                    ) : null}

                    <Text
                      className={`text-xl font-bold ${
                        isSelected ? theme.selectedText : "text-gray-900"
                      }`}>
                      {route.name}
                    </Text>
                  </View>
                  {isSelected && (
                    <View
                      className={`w-8 h-8 ${theme.checkmark} rounded-xl items-center justify-center shadow-sm`}>
                      <Text className="text-white text-base">
                        {MATERIAL_ICONS.check}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Route Description */}
                <Text
                  className={`text-lg mb-3 ${
                    isSelected ? theme.selectedTextSecondary : "text-gray-700"
                  }`}>
                  {route.description}
                </Text>

                {/* Route Details */}
                <View className="space-y-2">
                  <View className="flex-row items-center">
                    <Text className="text-gray-500 text-sm w-16">소요시간</Text>
                    <Text
                      className={`text-sm font-medium ${
                        isSelected
                          ? theme.selectedTextTertiary
                          : "text-gray-700"
                      }`}>
                      {route.duration}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Text className="text-gray-500 text-sm w-16">운행간격</Text>
                    <Text
                      className={`text-sm font-medium ${
                        isSelected
                          ? theme.selectedTextTertiary
                          : "text-gray-700"
                      }`}>
                      {route.frequency}
                    </Text>
                  </View>

                  {route.price && (
                    <View className="flex-row items-center">
                      <Text className="text-gray-500 text-sm w-16">요금</Text>
                      <Text
                        className={`text-sm font-medium ${
                          isSelected
                            ? theme.selectedTextTertiary
                            : "text-gray-700"
                        }`}>
                        {route.price.toLocaleString()}원
                      </Text>
                    </View>
                  )}
                </View>

                {/* Stops */}
                <View className="mt-4 pt-4 border-t border-gray-200">
                  <Text className="text-gray-500 text-sm mb-2">
                    경유 정류장
                  </Text>
                  <View className="flex-row flex-wrap">
                    {route.stops.map((stop, index) => (
                      <View
                        key={index}
                        className="flex-row items-center mr-4 mb-1">
                        <Text
                          className={`text-sm ${
                            isSelected
                              ? theme.selectedTextTertiary
                              : "text-gray-600"
                          }`}>
                          {stop}
                        </Text>
                        {index < route.stops.length - 1 && (
                          <Text className="text-gray-400 ml-2">→</Text>
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Info Card */}
          {infoCard && (
            <View className={`${infoCard.bgColor} rounded-xl p-4 mb-6`}>
              <Text className={`${infoCard.textColor} font-semibold mb-2`}>
                {infoCard.title}
              </Text>
              <Text className={`${infoCard.textColor} text-sm leading-5`}>
                {infoCard.content}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Next Button */}
        <View className="p-6 pt-0">
          <TouchableOpacity
            className={getButtonClasses(
              mode === "ferry" ? "primary" : "success",
              !selectedRouteId
            )}
            onPress={onNext}
            disabled={!selectedRouteId}>
            <Text
              className={`text-lg font-bold text-center ${
                selectedRouteId ? "text-white" : "text-gray-500"
              }`}>
              {selectedRouteId ? nextButtonText : "노선을 선택해주세요"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}
