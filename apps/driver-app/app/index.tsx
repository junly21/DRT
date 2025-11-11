import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useCallStore } from "@drt/store";
import { useInitializeDeviceId } from "../hooks/useInitializeDeviceId";
import { useInitializeDriverLocation } from "../hooks/useInitializeDriverLocation";
import { useSyncVehicleId } from "../hooks/useSyncVehicleId";

export default function DriverHome() {
  const { driverIsOperating, endDriverOperation } = useCallStore();

  useInitializeDeviceId();
  useInitializeDriverLocation();
  useSyncVehicleId();

  const handleStartOperation = () => {
    // 운행 시작을 누르면 노선 선택 화면으로 이동
    router.push("/common/select-route" as any);
  };

  // 운행 중일 때는 운행 중 화면으로 리다이렉트
  React.useEffect(() => {
    if (driverIsOperating) {
      router.replace("/operating" as any);
    }
  }, [driverIsOperating]);

  const handleEndOperation = () => {
    endDriverOperation();
  };

  return (
    <View className="flex-1 bg-drt-background">
      <StatusBar barStyle="dark-content" backgroundColor="#ececec" />

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        {/* Header Container */}
        <View className="flex-1 justify-center items-center px-6 py-8">
          {/* Logo */}
          <Image
            source={require("../assets/bus-icon2x.svg")}
            className="w-24 h-12 mb-4"
            resizeMode="contain"
          />

          {/* Title */}
          <Text className="text-drt-text text-2xl font-bold text-center mb-2">
            금오도 운행
          </Text>

          {/* Subtitle */}
          <Text className="text-drt-text text-base font-medium text-center opacity-50 mb-8">
            운행을 시작하거나 종료하세요
          </Text>

          {/* Buttons Container */}
          <View className="w-full items-center space-y-6">
            {/* 운행 시작 Button */}
            <TouchableOpacity
              className={`w-full max-w-sm rounded-2xl items-center justify-center px-6 py-8 ${
                driverIsOperating ? "bg-gray-300" : "bg-drt-ferry"
              }`}
              onPress={handleStartOperation}
              disabled={driverIsOperating}
              accessibilityRole="button"
              accessibilityLabel="운행 시작"
              accessibilityHint="운행을 시작합니다"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 3, height: 3 },
                shadowOpacity: 0.16,
                shadowRadius: 3,
                elevation: 3,
              }}>
              {/* Start Icon */}
              <View
                className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${
                  driverIsOperating ? "bg-gray-400" : "bg-white/20"
                }`}>
                <Image
                  source={require("../assets/bus-icon2x.svg")}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
              </View>

              {/* Title */}
              <Text
                className={`text-xl font-bold text-center mb-2 ${
                  driverIsOperating ? "text-gray-600" : "text-white"
                }`}>
                운행 시작
              </Text>

              {/* Description */}
              <Text
                className={`text-sm font-medium text-center opacity-70 leading-5 ${
                  driverIsOperating ? "text-gray-500" : "text-white"
                }`}>
                금오도 지역에서{"\n"}운행을 시작합니다
              </Text>
            </TouchableOpacity>

            {/* 운행 종료 Button */}
            <TouchableOpacity
              className={`w-full max-w-sm rounded-2xl items-center justify-center px-6 py-8 ${
                driverIsOperating ? "bg-red-600" : "bg-gray-300"
              }`}
              onPress={handleEndOperation}
              disabled={!driverIsOperating}
              accessibilityRole="button"
              accessibilityLabel="운행 종료"
              accessibilityHint="현재 운행을 종료합니다"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 3, height: 3 },
                shadowOpacity: 0.16,
                shadowRadius: 3,
                elevation: 3,
              }}>
              {/* Stop Icon */}
              <View
                className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${
                  driverIsOperating ? "bg-white/20" : "bg-gray-400"
                }`}>
                <Image
                  source={require("../assets/pngwing.com 1.svg")}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
              </View>

              {/* Title */}
              <Text
                className={`text-xl font-bold text-center mb-2 ${
                  driverIsOperating ? "text-white" : "text-gray-600"
                }`}>
                운행 종료
              </Text>

              {/* Description */}
              <Text
                className={`text-sm font-medium text-center opacity-70 leading-5 ${
                  driverIsOperating ? "text-white" : "text-gray-500"
                }`}>
                {driverIsOperating
                  ? "현재 운행을 종료합니다"
                  : "운행 중이 아닙니다"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View className="px-6 pb-8 pt-6">
          {/* Footer Logo */}
          <View className="items-center">
            <Image
              source={require("../assets/KICT.svg")}
              className="w-48 h-10"
              resizeMode="contain"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
