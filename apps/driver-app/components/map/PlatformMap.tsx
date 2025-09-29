import React from "react";
import { Platform, View, Text, TouchableOpacity } from "react-native";
import { LocationPicker } from "./LocationPicker";
import { MATERIAL_ICONS } from "../../lib/design-system";

interface PlatformMapProps {
  onLocationChange: (location: {
    latitude: number;
    longitude: number;
    address?: string;
  }) => void;
  zoom?: number;
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
}

// 웹용 대체 컴포넌트
function WebMapPlaceholder({
  onLocationChange,
  initialLocation,
}: PlatformMapProps) {
  const [selectedLocation, setSelectedLocation] = React.useState(
    initialLocation || { latitude: 37.5665, longitude: 126.978 }
  );

  const handleLocationSelect = () => {
    // 시뮬레이션용 랜덤 위치 생성 (서울 근처)
    const randomLat = 37.5665 + (Math.random() - 0.5) * 0.01;
    const randomLng = 126.978 + (Math.random() - 0.5) * 0.01;

    const newLocation = {
      latitude: randomLat,
      longitude: randomLng,
      address: `서울특별시 중구 세종대로 ${
        Math.floor(Math.random() * 100) + 1
      }`,
    };

    setSelectedLocation(newLocation);
    onLocationChange(newLocation);
  };

  return (
    <View className="flex-1 bg-gray-50 items-center justify-center">
      <View className="bg-white rounded-xl p-8 m-6 shadow-lg max-w-sm border border-gray-200">
        <View className="w-16 h-16 bg-blue-100 rounded-xl items-center justify-center mx-auto mb-6">
          <Text className="text-3xl">{MATERIAL_ICONS.location}</Text>
        </View>
        <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
          지도 미리보기
        </Text>

        <View className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
          <Text className="text-xs text-blue-700 text-center mb-2 font-semibold">
            {MATERIAL_ICONS.info} 개발 모드 안내
          </Text>
          <Text className="text-blue-800 text-center text-sm leading-5 font-medium">
            실제 앱에서는 카카오 지도가 표시됩니다
          </Text>
        </View>

        <View className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
          <Text className="text-sm text-gray-700 mb-3 font-semibold">
            현재 선택된 위치:
          </Text>
          <Text className="font-bold text-gray-900 text-sm">
            위도: {selectedLocation.latitude.toFixed(6)}
          </Text>
          <Text className="font-bold text-gray-900 text-sm">
            경도: {selectedLocation.longitude.toFixed(6)}
          </Text>
        </View>

        <TouchableOpacity
          className="bg-blue-600 rounded-xl py-4 px-6 shadow-sm"
          onPress={handleLocationSelect}>
          <View className="flex-row items-center justify-center">
            <Text className="text-lg mr-2">{MATERIAL_ICONS.location}</Text>
            <Text className="text-white font-bold text-center">
              위치 변경 (시뮬레이션)
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function PlatformMap(props: PlatformMapProps) {
  // 웹 플랫폼에서는 대체 컴포넌트 표시
  if (Platform.OS === "web") {
    return <WebMapPlaceholder {...props} />;
  }

  // 네이티브 플랫폼에서는 실제 지도 컴포넌트 사용
  return <LocationPicker {...props} />;
}
