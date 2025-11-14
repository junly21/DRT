import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { StopPicker, StopPickerItem } from "./StopPicker";

interface StopSelectorProps {
  mode: "ferry" | "bus";
  title: string;
  subtitle: string;
  selectedStopId: string | null;
  onStopSelect: (stop: StopPickerItem) => void;
  onNext: () => void;
  nextButtonText?: string;
  excludeStopId?: string | null; // 제외할 정류장 ID (하차 정류장 선택 시 승차 정류장 제외용)
  sortBy?: "distance" | "name"; // 정렬 방식 (거리순 또는 가나다순)
  infoCard?: {
    title: string;
    content: string;
  };
  selectedStopLabel?: string; // 선택된 정류장 라벨 (예: "선택된 승차 정류장", "선택된 하차 정류장")
  emptyStateText?: string; // 정류장 미선택 시 버튼 텍스트
  stops?: StopPickerItem[];
  isLoading?: boolean;
  isFetching?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export function StopSelector({
  mode,
  title,
  subtitle,
  selectedStopId,
  onStopSelect,
  onNext,
  nextButtonText = "다음 단계",
  excludeStopId,
  sortBy = "distance",
  infoCard,
  selectedStopLabel = "선택된 정류장",
  emptyStateText = "정류장을 선택해주세요",
  stops = [],
  isLoading = false,
  isFetching = false,
  error = null,
  onRetry,
}: StopSelectorProps) {
  const filteredStops = stops
    .filter((stop) => !excludeStopId || stop.id !== excludeStopId)
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name, "ko");
      }
      return a.distance - b.distance;
    });

  const handleStopSelect = (stop: StopPickerItem) => {
    onStopSelect(stop);
  };

  const handleBack = () => {
    router.back();
  };

  const hasStops = filteredStops.length > 0;
  const shouldShowInitialLoading = isLoading || (!hasStops && isFetching);
  const showInlineFetchingIndicator = isFetching && hasStops && !isLoading;

  return (
    <View style={{ flex: 1, backgroundColor: "#ececec" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ececec" />

      {/* Header Section */}
      <View style={{ width: "100%" }}>
        {/* Main Title */}
        <View style={{ width: "100%", alignItems: "center", marginTop: 24 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              textAlign: "center",
              color: "#222222",
            }}>
            {title}
          </Text>
        </View>

        {/* Subtitle */}
        <View
          style={{
            width: "100%",
            alignItems: "center",
            marginTop: 16,
            paddingHorizontal: 24,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              textAlign: "center",
              opacity: 0.5,
              lineHeight: 24,
              color: "#222222",
            }}>
            {subtitle}
          </Text>
        </View>
      </View>

      {shouldShowInitialLoading ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}>
          <ActivityIndicator size="large" color="#499c73" />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: "#6b7280",
            }}>
            주변 정류장을 불러오는 중입니다...
          </Text>
        </View>
      ) : !hasStops ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 24,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              textAlign: "center",
              color: "#6b7280",
              lineHeight: 24,
            }}>
            표시할 정류장이 없습니다.
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {showInlineFetchingIndicator && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                paddingVertical: 12,
              }}>
              <ActivityIndicator size="small" color="#499c73" />
              <Text style={{ fontSize: 14, color: "#6b7280" }}>
                최신 정류장 정보를 불러오는 중입니다...
              </Text>
            </View>
          )}
        <StopPicker
          stops={filteredStops}
          selectedStopId={selectedStopId}
          onStopSelect={handleStopSelect}
          selectedStopLabel={selectedStopLabel}
          mode={mode}
          sortBy={sortBy}
        />
        </View>
      )}

      {error && (
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginTop: 16,
            marginHorizontal: 16,
            borderRadius: 12,
            backgroundColor: "rgba(239, 68, 68, 0.1)",
          }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#ef4444",
              marginBottom: onRetry ? 8 : 0,
              textAlign: "center",
            }}>
            정류장 정보를 불러오지 못했습니다.
          </Text>
          {onRetry && (
            <TouchableOpacity
              onPress={onRetry}
              style={{
                alignSelf: "center",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 9999,
                borderWidth: 1,
                borderColor: "#ef4444",
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ef4444",
                }}>
                다시 시도
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Info Card */}
      {infoCard && (
        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          <View
            style={{
              width: "100%",
              backgroundColor: "#f3f4f6",
              borderRadius: 16,
              padding: 16,
            }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  marginRight: 8,
                  color: "#222222",
                }}>
                ℹ️
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: "#222222",
                }}>
                {infoCard.title}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <View
                style={{
                  width: 4,
                  height: 4,
                  backgroundColor: "#9ca3af",
                  borderRadius: 2,
                  marginTop: 8,
                  marginRight: 12,
                }}
              />
              <Text
                style={{
                  fontSize: 14,
                  opacity: 0.6,
                  flex: 1,
                  lineHeight: 20,
                  color: "#222222",
                }}>
                {infoCard.content}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Bottom Button - Fixed at bottom */}
      <View style={{ paddingHorizontal: 16, marginTop: 24, marginBottom: 32 }}>
        <TouchableOpacity
          onPress={onNext}
          disabled={!selectedStopId}
          style={{
            width: "100%",
            height: 59,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: selectedStopId ? "#499c73" : "#d1d5db",
            shadowColor: "#000",
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 0.12,
            shadowRadius: 3,
            elevation: 3,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: selectedStopId ? "white" : "#6b7280",
            }}>
            {selectedStopId ? nextButtonText : emptyStateText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
