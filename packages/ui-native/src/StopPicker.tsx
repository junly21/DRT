import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Stop } from "@drt/api-client";
import { Coordinates, calculateDistance, formatDistance } from "@drt/utils";

interface StopPickerProps {
  stops: Stop[];
  isLoading?: boolean;
  error?: string | null;
  userLocation?: Coordinates | null;
  selectedStopId?: string | null;
  onSelect: (stop: Stop) => void;
  title?: string;
  placeholder?: string;
  filterType?: "bus" | "ferry" | "all";
}

// Material Icons (이 부분은 나중에 별도 패키지로 분리할 수 있음)
const MATERIAL_ICONS = {
  search: "🔍",
  location: "📍",
  check: "✓",
  error: "❌",
};

export function StopPicker({
  stops,
  isLoading = false,
  error = null,
  userLocation = null,
  selectedStopId = null,
  onSelect,
  title = "정류장 선택",
  placeholder = "정류장 이름을 검색하세요",
  filterType = "all",
}: StopPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort stops
  const filteredStops = useMemo(() => {
    let filtered = stops;

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((stop) => stop.type === filterType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (stop) =>
          stop.name.toLowerCase().includes(query) ||
          stop.address?.toLowerCase().includes(query)
      );
    }

    // Sort by distance if user location is available
    if (userLocation) {
      filtered = filtered
        .map((stop) => ({
          ...stop,
          distance: calculateDistance(userLocation, stop),
        }))
        .sort((a, b) => a.distance - b.distance);
    }

    return filtered;
  }, [stops, searchQuery, filterType, userLocation]);

  const renderStopItem = ({
    item: stop,
  }: {
    item: Stop & { distance?: number };
  }) => {
    const isSelected = selectedStopId === stop.id;

    return (
      <TouchableOpacity
        className={`p-5 border-b border-gray-100 ${
          isSelected ? "bg-blue-50 border-l-4 border-l-blue-600" : "bg-white"
        }`}
        onPress={() => onSelect(stop)}>
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <Text className="text-lg mr-2">{MATERIAL_ICONS.location}</Text>
              <Text
                className={`font-bold text-lg ${
                  isSelected ? "text-blue-800" : "text-gray-900"
                }`}>
                {stop.name}
              </Text>
            </View>
            {stop.address && (
              <Text className="text-gray-600 text-sm mt-1 ml-7 font-medium">
                {stop.address}
              </Text>
            )}
            <View className="flex-row items-center mt-3 ml-7">
              <View
                className={`px-3 py-1 rounded-xl ${
                  stop.type === "ferry" ? "bg-blue-600" : "bg-green-600"
                }`}>
                <Text className="text-white text-xs font-bold">
                  {stop.type === "ferry" ? "여객선" : "버스"}
                </Text>
              </View>
              {stop.distance !== undefined && (
                <View className="flex-row items-center ml-3">
                  <Text className="text-xs mr-1">📏</Text>
                  <Text className="text-gray-600 text-sm font-semibold">
                    {formatDistance(stop.distance)}
                  </Text>
                </View>
              )}
            </View>
          </View>
          {isSelected && (
            <View className="w-8 h-8 bg-blue-600 rounded-xl items-center justify-center shadow-sm">
              <Text className="text-white text-base">
                {MATERIAL_ICONS.check}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center py-16">
      <View className="w-20 h-20 bg-gray-100 rounded-xl items-center justify-center mb-6">
        <Text className="text-4xl">{MATERIAL_ICONS.search}</Text>
      </View>
      <Text className="text-gray-700 text-center text-lg font-semibold mb-2">
        {searchQuery.trim() ? "검색 결과가 없습니다" : "정류장을 검색해보세요"}
      </Text>
      <Text className="text-gray-500 text-center text-sm">
        {searchQuery.trim()
          ? "다른 키워드로 검색해보세요"
          : "정류장 이름을 입력하여 검색할 수 있습니다"}
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View className="flex-1 justify-center items-center py-16">
      <View className="w-20 h-20 bg-red-100 rounded-xl items-center justify-center mb-6">
        <Text className="text-4xl">{MATERIAL_ICONS.error}</Text>
      </View>
      <Text className="text-red-700 text-center px-4 text-lg font-semibold mb-2">
        오류가 발생했습니다
      </Text>
      <Text className="text-red-600 text-center px-4 text-sm">{error}</Text>
    </View>
  );

  const renderLoadingState = () => (
    <View className="flex-1 justify-center items-center py-16">
      <View className="w-20 h-20 bg-blue-100 rounded-xl items-center justify-center mb-6">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
      <Text className="text-gray-700 text-center text-lg font-semibold mb-2">
        정류장 정보를 불러오는 중...
      </Text>
      <Text className="text-gray-500 text-center text-sm">
        잠시만 기다려주세요
      </Text>
    </View>
  );

  return (
    <View className="flex-1">
      {/* Header */}
      <Text className="text-xl font-bold text-gray-900 mb-4">{title}</Text>

      {/* Search Input */}
      <View className="mb-4 relative">
        <View className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <Text className="text-xl text-gray-500">{MATERIAL_ICONS.search}</Text>
        </View>
        <TextInput
          className="bg-white border-2 border-gray-200 rounded-xl pl-12 pr-4 py-4 text-base text-gray-900 font-medium shadow-sm"
          placeholder="정류장 이름 검색"
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Results Count */}
      {!isLoading && !error && (
        <Text className="text-sm text-gray-500 mb-3">
          {filteredStops.length}개의 정류장
          {userLocation && " (거리순 정렬)"}
        </Text>
      )}

      {/* Content */}
      <View className="flex-1 bg-white rounded-xl overflow-hidden">
        {error ? (
          renderErrorState()
        ) : isLoading ? (
          renderLoadingState()
        ) : (
          <FlatList
            data={filteredStops}
            renderItem={renderStopItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}
