import React from "react";
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { KakaoMap } from "./KakaoMap";

interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  type: "bus" | "ferry";
}

interface PlatformStopMapProps {
  stops: Stop[];
  selectedStopId?: string | null;
  onStopSelect?: (stop: Stop) => void;
  userLocation?: {
    latitude: number;
    longitude: number;
  } | null;
  center?: {
    latitude: number;
    longitude: number;
  };
  zoom?: number;
}

// 웹용 정류장 목록 컴포넌트
function WebStopList({
  stops,
  selectedStopId,
  onStopSelect,
}: PlatformStopMapProps) {
  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-white rounded-t-2xl p-6 m-4 shadow-lg">
        <Text className="text-xl font-bold text-gray-900 text-center mb-2">
          🗺️ 정류장 지도 미리보기
        </Text>
        <Text className="text-gray-600 text-center mb-6 leading-5">
          웹에서는 목록으로 정류장을 확인할 수 있습니다.{"\n"}
          실제 앱에서는 지도에서 정류장 위치를 볼 수 있습니다.
        </Text>
      </View>

      <ScrollView className="flex-1 px-4">
        {stops.map((stop) => {
          const isSelected = selectedStopId === stop.id;
          return (
            <TouchableOpacity
              key={stop.id}
              className={`bg-white rounded-xl p-4 mb-3 shadow-sm border-2 ${
                isSelected ? "border-blue-600 bg-blue-50" : "border-gray-200"
              }`}
              onPress={() => onStopSelect && onStopSelect(stop)}>
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text
                    className={`font-semibold text-base ${
                      isSelected ? "text-blue-800" : "text-gray-900"
                    }`}>
                    📍 {stop.name}
                  </Text>
                  {stop.address && (
                    <Text className="text-gray-500 text-sm mt-1">
                      {stop.address}
                    </Text>
                  )}
                  <Text className="text-xs text-gray-400 mt-1">
                    위도: {stop.latitude.toFixed(4)}, 경도:{" "}
                    {stop.longitude.toFixed(4)}
                  </Text>
                </View>
                {isSelected && (
                  <View className="w-6 h-6 bg-blue-600 rounded-full items-center justify-center">
                    <Text className="text-white text-xs">✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

export function PlatformStopMap(props: PlatformStopMapProps) {
  // 웹 플랫폼에서는 정류장 목록 표시
  if (Platform.OS === "web") {
    return <WebStopList {...props} />;
  }

  // 네이티브 플랫폼에서는 실제 지도 컴포넌트 사용
  return <KakaoMap {...props} />;
}
