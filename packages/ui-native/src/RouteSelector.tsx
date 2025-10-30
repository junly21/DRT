import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Screen } from "./Screen";

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
  return (
    <Screen>
      <View className="flex-1 bg-drt-background">
        {/* Header Section */}
        <View className="items-center py-8 px-6">
          <Text className="text-xl font-bold text-drt-text mb-2">{title}</Text>
          <Text className="text-base text-gray-600">{subtitle}</Text>
        </View>

        {/* Route List */}
        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}>
          {routes.map((route, index) => {
            const isSelected = selectedRouteId === route.id;
            const statusBadge = "운행 중"; // 기본값, 실제로는 route 데이터에서 추출

            return (
              <TouchableOpacity
                key={route.id}
                onPress={() => onRouteSelect(route)}
                activeOpacity={0.9}
                className={`mb-4 p-4 rounded-2xl border shadow-sm ${
                  isSelected
                    ? "border-blue-600 bg-blue-50"
                    : statusBadge === "운행 중"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white"
                }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}>
                {/* Header Row */}
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-lg font-semibold text-gray-900">
                    {route.name}
                  </Text>
                  <View
                    className={`px-3 py-1 rounded-full ${
                      statusBadge === "운행 중" ? "bg-green-500" : "bg-gray-200"
                    }`}>
                    <Text
                      className={`text-xs font-medium ${
                        statusBadge === "운행 중"
                          ? "text-white"
                          : "text-gray-700"
                      }`}>
                      {statusBadge}
                    </Text>
                  </View>
                </View>

                {/* Meta Info */}
                <View>
                  <Text className="text-base text-gray-700 mb-1">
                    {route.description}
                  </Text>
                  <Text className="text-sm text-gray-500 mb-1">
                    {route.duration}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {route.frequency}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Info Card */}
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

        {/* Bottom CTA Button */}
        <View className="px-6 py-6 bg-white border-t border-gray-100">
          <TouchableOpacity
            disabled={!selectedRouteId}
            className={`py-4 rounded-xl ${
              selectedRouteId ? "bg-blue-600" : "bg-gray-300"
            }`}
            onPress={onNext}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}>
            <Text className="text-center text-white font-semibold text-lg">
              {selectedRouteId ? nextButtonText : "노선을 선택해주세요"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}
