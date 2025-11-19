import React from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "../../components/ui/Screen";
import { useCallStore } from "@drt/store";
import { useInitializeDeviceId } from "../../hooks/useInitializeDeviceId";
import { fetchUsageHistory } from "../../services/usageHistory";
import { parseCallDateTime, formatPaymentMethod } from "../../utils/datetime";

interface UsageHistoryItem {
  dispatchSeq: number;
  deviceId: string;
  callDateTime: string;
  startPointId: string;
  endPointId: string;
  rsvNum: number;
  payment: "CARD" | "CASH" | "MOBILE";
}

export default function UsageHistoryScreen() {
  useInitializeDeviceId();
  const deviceId = useCallStore((state) => state.deviceId);

  const {
    data: usageHistory = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["usage-history", deviceId],
    queryFn: () => {
      const effectiveDeviceId = deviceId || "SIMULATOR_DEVICE";
      return fetchUsageHistory(effectiveDeviceId);
    },
    enabled: true,
    refetchOnWindowFocus: false,
  });

  const getPaymentIcon = (payment: "CARD" | "CASH" | "MOBILE") => {
    switch (payment) {
      case "CARD":
        return "💳";
      case "CASH":
        return "💵";
      case "MOBILE":
        return "📱";
      default:
        return "💳";
    }
  };

  const totalTrips = usageHistory.length;

  return (
    <Screen>
      <View style={{ flex: 1, padding: 24 }}>
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 8,
            }}>
            이용 내역
          </Text>
          <Text style={{ fontSize: 16, color: "#6B7280" }}>
            최근 이용한 서비스 내역을 확인할 수 있습니다
          </Text>
        </View>

        {/* Summary Card */}
        <View
          style={{
            backgroundColor: "#EFF6FF",
            borderRadius: 12,
            padding: 24,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: "#DBEAFE",
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#1E3A8A",
              marginBottom: 8,
            }}>
            총 이용 횟수
          </Text>
          <Text style={{ fontSize: 32, fontWeight: "bold", color: "#1E40AF" }}>
            {totalTrips}회
          </Text>
        </View>

        {/* History List */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 64,
              }}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text
                style={{
                  fontSize: 16,
                  color: "#6B7280",
                  marginTop: 16,
                }}>
                이용 내역을 불러오는 중...
              </Text>
            </View>
          ) : isError ? (
            <View
              style={{
                backgroundColor: "#F9FAFB",
                borderRadius: 12,
                padding: 32,
                alignItems: "center",
                marginTop: 32,
              }}>
              <Text style={{ fontSize: 36, marginBottom: 16 }}>⚠️</Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#374151",
                  marginBottom: 8,
                }}>
                이용 내역을 불러오지 못했습니다
              </Text>
              <Text
                style={{ fontSize: 14, color: "#6B7280", textAlign: "center" }}>
                잠시 후 다시 시도해주세요
              </Text>
            </View>
          ) : usageHistory.length === 0 ? (
            <View
              style={{
                backgroundColor: "#F9FAFB",
                borderRadius: 12,
                padding: 32,
                alignItems: "center",
                marginTop: 32,
              }}>
              <Text style={{ fontSize: 36, marginBottom: 16 }}>📋</Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#374151",
                  marginBottom: 8,
                }}>
                이용 내역이 없습니다
              </Text>
              <Text
                style={{ fontSize: 14, color: "#6B7280", textAlign: "center" }}>
                DRT 서비스를 이용하시면 여기에 기록이 표시됩니다
              </Text>
            </View>
          ) : (
            <View style={{ gap: 16 }}>
              {usageHistory.map((item, index) => {
                const parsedDateTime = parseCallDateTime(item.call_dtm);
                const dateTime = parsedDateTime
                  ? `${parsedDateTime.date} ${parsedDateTime.time}`
                  : item.call_dtm;

                return (
                  <View
                    key={`${item.dispatch_seq}-${item.device_id}-${item.call_dtm}-${index}`}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: 12,
                      padding: 24,
                      borderWidth: 1,
                      borderColor: "#E5E7EB",
                    }}>
                    {/* Header - 호출일시 */}
                    <View style={{ marginBottom: 16 }}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: "#111827",
                          marginBottom: 4,
                        }}>
                        {dateTime}
                      </Text>
                    </View>

                    {/* 정보 그리드 */}
                    <View style={{ gap: 12 }}>
                      {/* 디바이스 아이디 */}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: "#374151",
                            width: 100,
                          }}>
                          디바이스 ID
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#6B7280",
                            flex: 1,
                          }}>
                          {item.device_id}
                        </Text>
                      </View>

                      {/* 출발지 */}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: "#374151",
                            width: 100,
                          }}>
                          출발지
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#6B7280",
                            flex: 1,
                          }}>
                          {item.start_point_id}
                        </Text>
                      </View>

                      {/* 종점 */}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: "#374151",
                            width: 100,
                          }}>
                          종점
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#6B7280",
                            flex: 1,
                          }}>
                          {item.end_point_id}
                        </Text>
                      </View>

                      {/* 예약인원 */}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: "#374151",
                            width: 100,
                          }}>
                          예약인원
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#6B7280",
                            flex: 1,
                          }}>
                          {item.rsv_num}명
                        </Text>
                      </View>

                      {/* 결제수단 */}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: "#374151",
                            width: 100,
                          }}>
                          결제수단
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            flex: 1,
                          }}>
                          <Text style={{ fontSize: 18, marginRight: 8 }}>
                            {getPaymentIcon(item.payment)}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              color: "#6B7280",
                            }}>
                            {formatPaymentMethod(item.payment)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </Screen>
  );
}
