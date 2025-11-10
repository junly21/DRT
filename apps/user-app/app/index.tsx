import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { useCallStore, useCurrentLocation } from "@drt/store";
import { useInitializeCurrentLocation } from "../hooks/useInitializeCurrentLocation";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function HomeScreen() {
  const { setMode, resetAll } = useCallStore();
  const currentLocation = useCurrentLocation();

  useInitializeCurrentLocation();

  useEffect(() => {
    if (currentLocation) {
      const {
        coords: { latitude, longitude },
        timestamp,
        source,
      } = currentLocation;

      console.log("[HomeScreen] 현재 저장된 위치", {
        latitude,
        longitude,
        timestamp,
        source,
      });
    } else {
      console.log("[HomeScreen] 저장된 위치가 없습니다.");
    }
  }, [currentLocation]);

  const handleModeSelect = (mode: "passenger" | "bus") => {
    resetAll(); // Clear any previous state
    setMode(mode);

    if (mode === "passenger") {
      router.push("/(main)/ferry-schedule");
    } else {
      // 버스 이용: 출발지 선택 없이 바로 승차정류장 선택으로 이동
      router.push("/(flows)/common/select-boarding-stop?flow=bus" as any);
    }
  };

  return (
    <View className="flex-1 bg-drt-background">
      <StatusBar barStyle="dark-content" backgroundColor="#ececec" />

      {/* Header Container */}
      <View className="flex-1 justify-center items-center px-6">
        {/* Logo */}
        <Image
          source={require("../assets/bus-icon2x.svg")}
          className="w-24 h-12 mb-4"
          resizeMode="contain"
        />

        {/* Title */}
        <Text className="text-drt-text text-2xl font-bold text-center mb-2">
          DRT 호출
        </Text>

        {/* Subtitle */}
        <Text className="text-drt-text text-base font-medium text-center opacity-50 mb-8">
          원하는 서비스를 선택해주세요.
        </Text>

        {/* Buttons Container */}
        <View className="w-full items-center space-y-6">
          {/* Ferry Button */}
          <TouchableOpacity
            className="w-full max-w-sm bg-drt-ferry rounded-2xl items-center justify-center px-6 py-8"
            onPress={() => handleModeSelect("passenger")}
            accessibilityRole="button"
            accessibilityLabel="여객선 이용 서비스 선택"
            accessibilityHint="여객선 시간표를 확인하고 터미널행 버스를 호출할 수 있습니다"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 3, height: 3 },
              shadowOpacity: 0.16,
              shadowRadius: 3,
              elevation: 3,
            }}>
            {/* Ferry Icon */}
            <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center mb-4">
              <Image
                source={require("../assets/ferry-icon.svg")}
                className="w-12 h-12"
                resizeMode="contain"
              />
            </View>

            {/* Ferry Title */}
            <Text className="text-white text-xl font-bold text-center mb-2">
              여객선 이용
            </Text>

            {/* Ferry Description */}
            <Text className="text-white text-sm font-medium text-center opacity-70 leading-5">
              여객선 시간표를 확인하고{"\n"}터미널행 버스를 호출합니다.
            </Text>
          </TouchableOpacity>

          {/* Bus Button */}
          <TouchableOpacity
            className="w-full max-w-sm bg-drt-bus rounded-2xl items-center justify-center px-6 py-8"
            onPress={() => handleModeSelect("bus")}
            accessibilityRole="button"
            accessibilityLabel="버스 이용 서비스 선택"
            accessibilityHint="출발지와 목적지를 설정하고 버스를 호출할 수 있습니다"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 3, height: 3 },
              shadowOpacity: 0.16,
              shadowRadius: 3,
              elevation: 3,
            }}>
            {/* Bus Icon */}
            <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center mb-4">
              <Image
                source={require("../assets/bus-icon.svg")}
                className="w-12 h-12"
                resizeMode="contain"
              />
            </View>

            {/* Bus Title */}
            <Text className="text-white text-xl font-bold text-center mb-2">
              버스 이용
            </Text>

            {/* Bus Description */}
            <Text className="text-white text-sm font-medium text-center opacity-70 leading-5">
              출발지와 목적지를 설정하고{"\n"}버스를 호출합니다.
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View className="px-6 pb-8">
        {/* Footer Text
        <View className="items-center mb-4">
          <Text className="text-drt-text text-sm font-medium text-center opacity-50 leading-5">
            위치 권한은{"\n"}가장 가까운 정류장을 찾을 때만 요청됩니다.
          </Text>
        </View> */}
        {/* Footer Logo */}
        <View className="items-center">
          <Image
            source={require("../assets/KICT.svg")}
            className="w-48 h-10"
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
}
