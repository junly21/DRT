import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
  Modal,
} from "react-native";
import { router } from "expo-router";
import { useCallStore, useCurrentLocation } from "@drt/store";
import { useInitializeCurrentLocation } from "../hooks/useInitializeCurrentLocation";
import { useInitializeDeviceId } from "../hooks/useInitializeDeviceId";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function HomeScreen() {
  const { setMode, resetAll, passengerCount, setPassengerCount } =
    useCallStore();
  const currentLocation = useCurrentLocation();
  const [modePending, setModePending] = useState<"passenger" | "bus" | null>(
    null
  );
  const [isPassengerModalVisible, setPassengerModalVisible] = useState(false);
  const [selectedPassengerCount, setSelectedPassengerCount] = useState(1);

  useInitializeCurrentLocation();
  useInitializeDeviceId();

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
    setModePending(mode);
    setSelectedPassengerCount(Math.max(1, passengerCount ?? 1));
    setPassengerModalVisible(true);
  };

  const handlePassengerCountChange = (delta: number) => {
    setSelectedPassengerCount((prev) => Math.max(1, prev + delta));
  };

  const handlePassengerModalClose = () => {
    setPassengerModalVisible(false);
    setModePending(null);
  };

  const handlePassengerModalConfirm = () => {
    if (!modePending) {
      handlePassengerModalClose();
      return;
    }

    resetAll();
    setPassengerCount(selectedPassengerCount);
    console.log("[HomeScreen] 선택한 탑승 인원 저장", {
      selectedPassengerCount,
      storedPassengerCount: useCallStore.getState().passengerCount,
    });
    setMode(modePending);
    setPassengerModalVisible(false);

    if (modePending === "passenger") {
      router.push("/(main)/ferry-schedule");
    } else {
      router.push("/(flows)/common/select-boarding-stop?flow=bus" as any);
    }

    setModePending(null);
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

      <Modal
        transparent
        animationType="fade"
        visible={isPassengerModalVisible}
        onRequestClose={handlePassengerModalClose}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 24,
          }}>
          <View
            style={{
              width: "100%",
              maxWidth: 320,
              borderRadius: 20,
              backgroundColor: "#FFFFFF",
              padding: 24,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#111827",
                marginBottom: 8,
                textAlign: "center",
              }}>
              탑승 인원을 선택해주세요
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#6B7280",
                textAlign: "center",
                marginBottom: 24,
              }}>
              최소 1명 이상 선택할 수 있습니다.
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="탑승 인원 감소"
                accessibilityHint="탑승 인원을 1명 줄입니다"
                onPress={() => handlePassengerCountChange(-1)}
                disabled={selectedPassengerCount <= 1}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 24,
                  opacity: selectedPassengerCount <= 1 ? 0.4 : 1,
                  backgroundColor: "#FFFFFF",
                }}>
                <Text
                  style={{ fontSize: 28, fontWeight: "600", color: "#111827" }}>
                  -
                </Text>
              </TouchableOpacity>

              <Text
                style={{ fontSize: 32, fontWeight: "bold", color: "#111827" }}>
                {selectedPassengerCount}
              </Text>

              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="탑승 인원 증가"
                accessibilityHint="탑승 인원을 1명 늘립니다"
                onPress={() => handlePassengerCountChange(1)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: "#2563EB",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 24,
                }}>
                <Text
                  style={{ fontSize: 28, fontWeight: "600", color: "#FFFFFF" }}>
                  +
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 12,
              }}>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={handlePassengerModalClose}
                style={{
                  paddingHorizontal: 18,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                }}>
                <Text
                  style={{ fontSize: 16, color: "#6B7280", fontWeight: "600" }}>
                  취소
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={handlePassengerModalConfirm}
                style={{
                  paddingHorizontal: 18,
                  paddingVertical: 12,
                  borderRadius: 12,
                  backgroundColor: "#2563EB",
                }}>
                <Text
                  style={{ fontSize: 16, color: "#FFFFFF", fontWeight: "600" }}>
                  확인
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
