import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Screen } from "../components/ui/Screen";
import { getButtonClasses, MATERIAL_ICONS } from "../lib/design-system";
import { useCallStore } from "../store/call.store";

export default function DriverHome() {
  const {
    driverRegion,
    driverIsOperating,
    driverRouteId,
    setDriverRegion,
    endDriverOperation,
  } = useCallStore();

  const handleRegionSelect = (region: "금오도" | "거문도") => {
    setDriverRegion(region);
  };

  const handleStartOperation = () => {
    // 운행 시작을 누르면 노선 선택 화면으로 이동
    router.push("/common/select-route" as any);
  };

  const handleEndOperation = () => {
    endDriverOperation();
  };

  const handleBackToRegion = () => {
    setDriverRegion(null);
  };

  return (
    <Screen screenTitle="DRT 기사">
      <View className="flex-1 justify-center">
        {!driverRegion ? (
          // 지역 선택 화면
          <>
            {/* Header */}
            <View className="items-center mb-12">
              <View className="w-20 h-20 bg-blue-600 rounded-2xl items-center justify-center mb-6 shadow-lg">
                <Text className="text-4xl">{MATERIAL_ICONS.bus}</Text>
              </View>
              <Text className="text-4xl font-bold text-gray-900 text-center mb-3">
                DRT 기사
              </Text>
              <Text className="text-gray-600 text-center text-lg leading-6">
                운행할 지역을 선택해주세요
              </Text>
            </View>

            {/* Region Selection Buttons */}
            <View className="space-y-6">
              {/* 금오도 Button */}
              <TouchableOpacity
                className="bg-blue-600 rounded-xl p-8 shadow-lg active:bg-blue-700 border border-blue-700"
                onPress={() => handleRegionSelect("금오도")}
                accessibilityRole="button"
                accessibilityLabel="금오도 지역 선택"
                accessibilityHint="금오도 지역에서 운행을 시작합니다">
                <View className="items-center">
                  <View className="w-16 h-16 bg-white bg-opacity-20 rounded-xl items-center justify-center mb-4">
                    <Text className="text-3xl">🏝️</Text>
                  </View>
                  <Text className="text-white text-2xl font-bold mb-3">
                    금오도
                  </Text>
                  <Text className="text-blue-100 text-center text-base leading-6">
                    금오도 지역{"\n"}운행 서비스
                  </Text>
                </View>
              </TouchableOpacity>

              {/* 거문도 Button */}
              <TouchableOpacity
                className="bg-green-600 rounded-xl p-8 shadow-lg active:bg-green-700 border border-green-700"
                onPress={() => handleRegionSelect("거문도")}
                accessibilityRole="button"
                accessibilityLabel="거문도 지역 선택"
                accessibilityHint="거문도 지역에서 운행을 시작합니다">
                <View className="items-center">
                  <View className="w-16 h-16 bg-white bg-opacity-20 rounded-xl items-center justify-center mb-4">
                    <Text className="text-3xl">🏝️</Text>
                  </View>
                  <Text className="text-white text-2xl font-bold mb-3">
                    거문도
                  </Text>
                  <Text className="text-green-100 text-center text-base leading-6">
                    거문도 지역{"\n"}운행 서비스
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          // 운행 관리 화면
          <>
            {/* Header */}
            <View className="items-center mb-12">
              <View className="w-20 h-20 bg-blue-600 rounded-2xl items-center justify-center mb-6 shadow-lg">
                <Text className="text-4xl">{MATERIAL_ICONS.bus}</Text>
              </View>
              <Text className="text-4xl font-bold text-gray-900 text-center mb-3">
                {driverRegion} 운행
              </Text>
              <Text className="text-gray-600 text-center text-lg leading-6">
                운행을 시작하거나 종료하세요
              </Text>
            </View>

            {/* Operation Buttons */}
            <View className="space-y-6">
              {/* 운행 시작 Button */}
              <TouchableOpacity
                className={`rounded-xl p-8 shadow-lg border ${
                  driverIsOperating
                    ? "bg-gray-300 border-gray-400"
                    : "bg-green-600 border-green-700 active:bg-green-700"
                }`}
                onPress={handleStartOperation}
                disabled={driverIsOperating}
                accessibilityRole="button"
                accessibilityLabel="운행 시작"
                accessibilityHint="현재 지역에서 운행을 시작합니다">
                <View className="items-center">
                  <View className="w-16 h-16 bg-white bg-opacity-20 rounded-xl items-center justify-center mb-4">
                    <Text className="text-3xl">▶️</Text>
                  </View>
                  <Text className="text-white text-2xl font-bold mb-3">
                    {driverIsOperating ? "운행 중" : "운행 시작"}
                  </Text>
                  <Text className="text-green-100 text-center text-base leading-6">
                    {driverRegion} 지역에서{"\n"}
                    {driverIsOperating ? "운행 중입니다" : "운행을 시작합니다"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* 운행 종료 Button */}
              <TouchableOpacity
                className={`rounded-xl p-8 shadow-lg border ${
                  driverIsOperating
                    ? "bg-red-600 border-red-700 active:bg-red-700"
                    : "bg-gray-300 border-gray-400"
                }`}
                onPress={handleEndOperation}
                disabled={!driverIsOperating}
                accessibilityRole="button"
                accessibilityLabel="운행 종료"
                accessibilityHint="현재 운행을 종료합니다">
                <View className="items-center">
                  <View className="w-16 h-16 bg-white bg-opacity-20 rounded-xl items-center justify-center mb-4">
                    <Text className="text-3xl">⏹️</Text>
                  </View>
                  <Text className="text-white text-2xl font-bold mb-3">
                    운행 종료
                  </Text>
                  <Text className="text-red-100 text-center text-base leading-6">
                    {driverIsOperating
                      ? "현재 운행을 종료합니다"
                      : "운행 중이 아닙니다"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* 뒤로가기 Button */}
              <TouchableOpacity
                className="bg-gray-500 rounded-xl p-6 shadow-lg active:bg-gray-600 border border-gray-600"
                onPress={handleBackToRegion}
                accessibilityRole="button"
                accessibilityLabel="지역 선택으로 돌아가기">
                <View className="items-center">
                  <Text className="text-white text-lg font-semibold">
                    ← 지역 선택으로 돌아가기
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Footer Info */}
        <View className="mt-12 items-center">
          <Text className="text-gray-500 text-sm text-center">
            {!driverRegion
              ? "운행할 지역을 선택해주세요"
              : `${driverRegion} 지역 운행 관리`}
          </Text>
        </View>
      </View>
    </Screen>
  );
}
