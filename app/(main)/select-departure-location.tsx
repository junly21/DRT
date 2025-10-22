import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { Screen } from "../../components/ui/Screen";
import { PlatformMap } from "@drt/ui-native";
import { useCallStore } from "@drt/store";
import { getButtonClasses, MATERIAL_ICONS } from "@drt/utils";

interface UserLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export default function SelectDepartureLocationScreen() {
  const { setDepartureLocation } = useCallStore();
  const [selectedLocation, setSelectedLocation] = useState<UserLocation | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationChange = (location: UserLocation) => {
    setSelectedLocation(location);
  };

  const handleNext = async () => {
    if (!selectedLocation) {
      Alert.alert("알림", "출발지를 선택해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      // Store에 출발지 정보 저장
      setDepartureLocation(selectedLocation);

      // 노선 선택 없이 바로 승차정류장 선택으로 이동 (flow 파라미터 전달)
      router.push("/(flows)/common/select-boarding-stop?flow=bus" as any);
    } catch (error) {
      console.error("Error setting departure location:", error);
      Alert.alert("오류", "출발지 설정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrentLocation = () => {
    // TODO: GPS를 사용해서 현재 위치 가져오기
    Alert.alert("안내", "현재 위치 기능은 준비중입니다.");
  };

  return (
    <Screen>
      <View className="flex-1">
        {/* Map */}
        <View className="flex-1">
          <PlatformMap onLocationChange={handleLocationChange} zoom={16} />
        </View>

        {/* Location Info Card */}
        {selectedLocation && (
          <View className="bg-white border-t-2 border-gray-200 p-6">
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-1">
                <View className="flex-row items-center mb-3">
                  <Text className="text-xl mr-3">{MATERIAL_ICONS.check}</Text>
                  <Text className="text-lg font-bold text-gray-900">
                    선택된 출발지
                  </Text>
                </View>
                <Text className="text-base text-gray-700 mb-3 font-semibold">
                  {selectedLocation.address || "주소를 가져오는 중..."}
                </Text>
                <Text className="text-xs text-gray-500 font-medium">
                  위도: {selectedLocation.latitude.toFixed(6)}, 경도:{" "}
                  {selectedLocation.longitude.toFixed(6)}
                </Text>
              </View>

              <TouchableOpacity
                className="bg-blue-100 px-4 py-3 rounded-xl border border-blue-200"
                onPress={handleCurrentLocation}>
                <View className="flex-row items-center">
                  <Text className="text-base mr-2">
                    {MATERIAL_ICONS.location}
                  </Text>
                  <Text className="text-blue-700 text-sm font-bold">
                    현재 위치
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Guide */}
            <View className="bg-green-50 rounded-xl p-5 mb-6 border border-green-200">
              <View className="flex-row items-center mb-3">
                <Text className="text-lg mr-2">{MATERIAL_ICONS.info}</Text>
                <Text className="text-green-900 font-bold">사용 방법</Text>
              </View>
              <Text className="text-green-800 text-sm leading-6 font-medium">
                • 지도를 드래그하여 원하는 위치로 이동하세요{"\n"}• 지도를
                클릭해도 위치를 변경할 수 있습니다{"\n"}• 빨간 마커가 선택된
                출발지를 나타냅니다
              </Text>
            </View>

            {/* Next Button */}
            <TouchableOpacity
              className={getButtonClasses(
                "success",
                !selectedLocation || isLoading
              )}
              onPress={handleNext}
              disabled={!selectedLocation || isLoading}>
              <View className="flex-row items-center justify-center">
                {isLoading ? (
                  <Text className="text-lg mr-2">{MATERIAL_ICONS.loading}</Text>
                ) : (
                  <Text className="text-lg mr-2">{MATERIAL_ICONS.check}</Text>
                )}
                <Text
                  className={`text-lg font-bold ${
                    selectedLocation && !isLoading
                      ? "text-white"
                      : "text-gray-500"
                  }`}>
                  {isLoading ? "설정 중..." : "이 위치에서 출발"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Screen>
  );
}
