import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";

interface Route {
  id: string;
  name: string;
  description: string;
  duration: string; // e.g., "07:00 ~ 19:00" or "7:00-7:30 (30분)"
  frequency: string; // e.g., "30분 간격" or "순환운행"
}

export default function DriverSelectRouteScreen() {
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const routes: Route[] = [
    {
      id: "r1",
      name: "1호차 노선1",
      description: "우실삼거리 - 소유 - 대유 - 여천터미널",
      duration: "07:00 ~ 19:00",
      frequency: "30분 간격",
    },
    {
      id: "r2",
      name: "1호차 노선2",
      description: "여천 ↔ 백야도",
      duration: "07:30 ~ 18:30",
      frequency: "1시간 간격",
    },
  ];

  const handleNext = () => {
    if (selectedRouteId) {
      router.replace("/operating");
    }
  };

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      {/* Header */}
      <View className="px-5 pt-14 pb-6">
        <Text className="text-xl font-bold text-gray-900 mb-1">
          운행할 노선을 선택해주세요
        </Text>
        <Text className="text-base text-gray-600">
          선택한 노선으로 운행을 시작합니다
        </Text>
      </View>

      {/* Route List */}
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}>
        {routes.map((route) => {
          const isSelected = selectedRouteId === route.id;

          const borderColor = isSelected ? "#1648C8" : "#DBDBDB";
          const backgroundColor = isSelected ? "#EEF3FF" : "#FFFFFF";

          return (
            <TouchableOpacity
              key={route.id}
              activeOpacity={0.9}
              onPress={() => setSelectedRouteId(route.id)}
              style={{
                backgroundColor,
                borderColor,
                borderWidth: 1.5,
                borderRadius: 16,
                paddingVertical: 24,
                paddingHorizontal: 20,
                marginBottom: 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}>
              {/* Header Row */}
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-semibold text-gray-900">
                  {route.name}
                </Text>
              </View>

              {/* Route Info */}
              <Text className="text-base text-gray-700 mb-2">
                {route.description}
              </Text>

              {/* Meta rows: duration and frequency */}
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-sm text-gray-500">소요시간</Text>
                <Text className="text-sm text-gray-900">{route.duration}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-500">운행간격</Text>
                <Text className="text-sm text-gray-900">{route.frequency}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Info Card */}
        <View className="bg-green-50 rounded-2xl p-6 mt-6 border border-green-200">
          <Text className="text-green-800 font-semibold text-base mb-3">
            ℹ️ 노선 안내
          </Text>
          <Text className="text-green-800 text-sm leading-6">
            • 노선은 지역 상황에 따라 변경될 수 있습니다{"\n"}• 운행 시작 후에는
            노선 변경이 제한될 수 있습니다
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View className="px-5 pb-8 bg-white border-t border-gray-100">
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={!selectedRouteId}
          onPress={handleNext}
          style={{
            backgroundColor: selectedRouteId ? "#1648C8" : "#DBDBDB",
            borderRadius: 12,
            paddingVertical: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}>
          <Text className="text-center text-white font-semibold text-lg">
            {selectedRouteId ? "운행 시작" : "노선을 선택해주세요"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
