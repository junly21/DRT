import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { PinIcon } from "./icons/PinIcon";

export interface StopPickerItem {
  id: string;
  name: string;
  address?: string | null;
  distance: number;
  direction?: string | null;
}

interface StopPickerProps {
  stops: StopPickerItem[];
  selectedStopId: string | null;
  onStopSelect: (stop: StopPickerItem) => void;
  selectedStopLabel: string;
  mode: "ferry" | "bus";
  sortBy: "distance" | "name";
}

export function StopPicker({
  stops,
  selectedStopId,
  onStopSelect,
  selectedStopLabel,
  mode,
  sortBy,
}: StopPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // 검색 필터링
  const filteredStops = stops.filter(
    (stop) =>
      stop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stop.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}>
      {/* 검색 바 */}
      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        <View
          style={{
            width: "100%",
            height: 59,
            backgroundColor: "white",
            borderRadius: 18,
            shadowColor: "#000",
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 0.12,
            shadowRadius: 3,
            elevation: 3,
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              fontWeight: "500",
              color: "#6b7280",
            }}
            placeholder="정류장 이름 검색"
            placeholderTextColor="rgba(107, 114, 128, 0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View style={{ width: 20, height: 20 }}>
            <Text style={{ color: "#9ca3af", fontSize: 18 }}>🔍</Text>
          </View>
        </View>
      </View>

      {/* 정류장 목록 제목 */}
      <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 8,
            color: "#222222",
          }}>
          버스 정류장 목록
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            opacity: 0.5,
            marginBottom: 16,
            color: "#222222",
          }}>
          {stops.length}개의 정류장 ({sortBy === "name" ? "이름순" : "거리순"}{" "}
          정렬)
        </Text>
      </View>

      {/* 정류장 목록 */}
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        {/* 정류장 리스트 */}
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={{ gap: 16 }}>
            {filteredStops.map((stop) => (
              <TouchableOpacity
                key={stop.id}
                onPress={() => onStopSelect(stop)}
                style={{
                  width: "100%",
                  borderRadius: 16,
                  padding: 16,
                  backgroundColor:
                    selectedStopId === stop.id
                      ? "rgba(103, 255, 179, 0.2)"
                      : "white",
                  shadowColor: "#000",
                  shadowOffset: { width: 3, height: 3 },
                  shadowOpacity: 0.16,
                  shadowRadius: 3,
                  elevation: 3,
                }}>
                {/* 정류장 카드 내용 */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                  {/* 왼쪽 - 정류장 정보 */}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        marginBottom: 4,
                        color: "#222222",
                      }}>
                      {stop.name}
                    </Text>
                    {stop.address && (
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          marginBottom: 4,
                          color: "#4b5563",
                        }}>
                        {stop.address}
                      </Text>
                    )}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color: "#6b7280",
                        }}>
                        거리: {Math.round(stop.distance)}m
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "500",
                          color: "#9ca3af",
                        }}>
                        |
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color: "#6b7280",
                        }}>
                        {stop.direction || "방향정보없음"}
                      </Text>
                    </View>
                  </View>

                  {/* 오른쪽 - 상태 아이콘 */}
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    <PinIcon selected={selectedStopId === stop.id} size={32} />
                  </View>
                </View>

                {/* 선택 표시 */}
                {/* {selectedStopId === stop.id && (
                  <View
                    style={{
                      marginTop: 12,
                      paddingTop: 12,
                      borderTopWidth: 1,
                      borderTopColor: "#d1d5db",
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        textAlign: "center",
                        color: "#222222",
                      }}>
                      {selectedStopLabel}
                    </Text>
                  </View>
                )} */}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
