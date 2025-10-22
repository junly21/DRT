import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Screen } from "../components/ui/Screen";
import { MATERIAL_ICONS } from "@drt/utils";
import { useCallStore } from "@drt/store";

export default function OperatingScreen() {
  const { driverRegion, driverIsOperating, endDriverOperation } =
    useCallStore();

  const handleEndOperation = () => {
    endDriverOperation();
    // 운행 종료 후 운행 관리 화면으로 돌아가기
    router.replace("/" as any);
  };

  const handleBackToRegion = () => {
    endDriverOperation();
    // 지역 선택으로 돌아가기
    router.replace("/" as any);
  };

  return (
    <Screen screenTitle={`${driverRegion} 운행 중`}>
      <View className="flex-1 justify-center">
        {/* Header */}
        <View className="items-center mb-12">
          <View className="w-20 h-20 bg-green-600 rounded-2xl items-center justify-center mb-6 shadow-lg">
            <Text className="text-4xl">{MATERIAL_ICONS.bus}</Text>
          </View>
          <Text className="text-4xl font-bold text-gray-900 text-center mb-3">
            {driverRegion} 운행
          </Text>
          <Text className="text-gray-600 text-center text-lg leading-6">
            현재 운행 중입니다
          </Text>
        </View>

        {/* 운행 상태 표시 */}
        <View className="items-center mb-12">
          <View className="bg-green-100 rounded-2xl p-8 border-2 border-green-200">
            <View className="items-center">
              <View className="w-16 h-16 bg-green-600 rounded-full items-center justify-center mb-4">
                <Text className="text-white text-2xl">▶️</Text>
              </View>
              <Text className="text-green-800 text-2xl font-bold mb-2">
                운행 중
              </Text>
              <Text className="text-green-700 text-center text-base leading-6">
                {driverRegion} 지역에서{"\n"}정상적으로 운행 중입니다
              </Text>
            </View>
          </View>
        </View>

        {/* Operation Buttons */}
        <View>
          {/* 운행 종료 Button */}
          <TouchableOpacity
            className="bg-red-600 rounded-xl p-8 shadow-lg active:bg-red-700 border border-red-700"
            onPress={handleEndOperation}
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
                현재 운행을 종료합니다
              </Text>
            </View>
          </TouchableOpacity>

          {/* 뒤로가기 Button */}
          <TouchableOpacity
            className="bg-gray-500 rounded-xl p-6 shadow-lg active:bg-gray-600 border border-gray-600 mt-6"
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

        {/* Footer Info */}
        <View className="mt-12 items-center">
          <Text className="text-gray-500 text-sm text-center">
            {driverRegion} 지역 운행 중
          </Text>
        </View>
      </View>
    </Screen>
  );
}


