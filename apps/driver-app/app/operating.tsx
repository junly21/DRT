import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { router, useNavigation } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useCallStore } from "@drt/store";
import { useDriverLocationWatcher } from "../hooks/useDriverLocationWatcher";
import { useDriverOperationReporter } from "../hooks/useDriverOperationReporter";
import { endOperation } from "../services/operations";
import { DeviceInfoButton } from "../components/ui/DeviceInfoButton";

export default function OperatingScreen() {
  const {
    driverRegion,
    driverIsOperating,
    endDriverOperation,
    vehicleId,
    driverRouteId,
    driverStopInfo,
    setDriverStopInfo,
  } = useCallStore();

  useDriverLocationWatcher({
    enabled: driverIsOperating,
    timeInterval: 1000,
  });
  useDriverOperationReporter({
    enabled: driverIsOperating,
    intervalMs: 1000,
  });

  const endOperationMutation = useMutation({
    mutationFn: endOperation,
    onSuccess: () => {
      setDriverStopInfo(null);
      endDriverOperation();
      router.replace("/" as const);
    },
    onError: (error) => {
      console.error("[Driver][Operation] 운행 종료 실패", error);
      const message =
        error instanceof Error
          ? error.message
          : "운행 종료 중 오류가 발생했습니다.";
      Alert.alert("운행 종료 실패", message);
    },
  });

  const handleEndOperation = useCallback(() => {
    if (!vehicleId) {
      Alert.alert("차량 정보를 확인할 수 없습니다.");
      return;
    }

    endOperationMutation.mutate({ VEHICLE_ID: vehicleId });
  }, [vehicleId, endOperationMutation]);

  const stopName =
    driverStopInfo?.stopName ??
    (driverStopInfo?.isArrivalEvent === true
      ? "다음 정류장 정보를 불러오는 중..."
      : driverStopInfo?.isArrivalEvent === false
        ? "주변 정류장 정보를 불러오는 중..."
        : "-");
  const passengerCountLabel =
    driverStopInfo?.passengerCount != null
      ? `${driverStopInfo.passengerCount}명`
      : "-";
  const endButtonLabel = endOperationMutation.isPending
    ? "운행 종료 중..."
    : "운행 종료";

  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <DeviceInfoButton />,
    });
  }, [navigation]);

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
            {driverRegion} 운행 중
          </Text>

          {/* Subtitle */}
          <Text className="text-drt-text text-base font-medium text-center opacity-50 mb-8">
            현재 운행 중입니다
          </Text>

          {/* Buttons Container */}
          <View className="w-full items-center space-y-6">
            {/* 운행 중 Button (비활성화) */}
            <TouchableOpacity
              className="w-full max-w-sm rounded-2xl items-center justify-center px-6 py-8 bg-gray-300"
              disabled={true}
              accessibilityRole="button"
              accessibilityLabel="운행 중"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 3, height: 3 },
                shadowOpacity: 0.16,
                shadowRadius: 3,
                elevation: 3,
              }}>
              {/* Bus Icon */}
              <View className="w-20 h-20 bg-gray-400 rounded-full items-center justify-center mb-4">
                <Image
                  source={require("../assets/bus-icon2x.svg")}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
              </View>

              {/* Title */}
              <Text className="text-xl font-bold text-center mb-2 text-gray-600">
                운행 중
              </Text>

              {/* Description */}
              <Text className="text-sm font-medium text-center opacity-70 leading-5 text-gray-500">
                금오도 지역에서{"\n"}운행 중입니다
              </Text>
            </TouchableOpacity>

            {/* 운행 종료 Button */}
            <TouchableOpacity
              className="w-full max-w-sm rounded-2xl items-center justify-center px-6 py-8"
              onPress={handleEndOperation}
              disabled={endOperationMutation.isPending}
              accessibilityRole="button"
              accessibilityLabel="운행 종료"
              accessibilityHint="현재 운행을 종료합니다"
              style={{
                backgroundColor: endOperationMutation.isPending
                  ? "#E5E7EB"
                  : "#F26264",
                shadowColor: "#000",
                shadowOffset: { width: 3, height: 3 },
                shadowOpacity: 0.16,
                shadowRadius: 3,
                elevation: 3,
              }}>
              {/* Stop Icon */}
              <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4">
                <Image
                  source={require("../assets/pngwing.com 1.svg")}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
              </View>

              {/* Title */}
              <Text className="text-xl font-bold text-center mb-2 text-white">
                {endButtonLabel}
              </Text>

              {/* Description */}
              <Text className="text-sm font-medium text-center opacity-70 leading-5 text-white">
                현재 운행을 종료합니다
              </Text>
            </TouchableOpacity>

            {/* 운행 정보 카드 */}
            <View
              className="w-full max-w-sm rounded-2xl px-6 py-6 bg-white border border-gray-200"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}>
              {/* 다음 정류장 - 좌우 배치 */}
              <View className="flex-row justify-between items-center ">
                <Text className="text-gray-500 text-sm">다음 정류장</Text>
                <Text className="text-gray-900 text-lg font-bold">
                  {stopName}
                </Text>
              </View>
              <View className="border-t border-gray-200 my-4" />
              {/* 탑승 인원수 - 좌우 배치 */}
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500 text-sm">탑승 인원수</Text>
                <Text className="text-gray-900 text-lg font-bold">
                  {passengerCountLabel}
                </Text>
              </View>
              <View className="border-t border-gray-200 my-4" />
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500 text-sm">차량 ID</Text>
                <Text className="text-gray-900 text-sm font-medium">
                  {vehicleId ?? "-"}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mt-2">
                <Text className="text-gray-500 text-sm">노선 ID</Text>
                <Text className="text-gray-900 text-sm font-medium">
                  {driverRouteId ?? "-"}
                </Text>
              </View>
            </View>
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
