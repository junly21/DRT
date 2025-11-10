import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Screen } from "../../components/ui/Screen";
import { MATERIAL_ICONS } from "@drt/utils";

interface UsageHistoryItem {
  id: string;
  date: string;
  time: string;
  type: "ferry" | "bus";
  route: string;
  amount: number;
  status: "completed" | "cancelled";
  paymentMethod: string;
}

const USAGE_HISTORY: UsageHistoryItem[] = [
  {
    id: "1",
    date: "2025-01-15",
    time: "14:30",
    type: "ferry",
    route: "우실삼거리 → 녹동항 여객터미널",
    amount: 2500,
    status: "completed",
    paymentMethod: "카드",
  },
  {
    id: "2",
    date: "2025-01-14",
    time: "09:15",
    type: "bus",
    route: "금오도터미널 → 녹동항 여객터미널",
    amount: 1800,
    status: "completed",
    paymentMethod: "카드",
  },
  {
    id: "3",
    date: "2025-01-13",
    time: "16:45",
    type: "ferry",
    route: "녹동항 여객터미널 → 중송항",
    amount: 2500,
    status: "cancelled",
    paymentMethod: "카드",
  },
  {
    id: "4",
    date: "2025-01-12",
    time: "11:20",
    type: "bus",
    route: "여천터미널 → 우실삼거리",
    amount: 1200,
    status: "cancelled",
    paymentMethod: "현금",
  },
];

export default function UsageHistoryScreen() {
  const [usageHistory] = useState<UsageHistoryItem[]>(USAGE_HISTORY);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "완료";
      case "cancelled":
        return "취소";
      default:
        return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ferry":
        return "🚢";
      case "bus":
        return "🚌";
      default:
        return "🚌";
    }
  };

  const totalTrips = usageHistory.filter(
    (item) => item.status === "completed"
  ).length;

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
          <View style={{ gap: 16 }}>
            {usageHistory.map((item) => (
              <View
                key={item.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 12,
                  padding: 24,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                }}>
                {/* Header */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ fontSize: 24, marginRight: 12 }}>
                      {getTypeIcon(item.type)}
                    </Text>
                    <View>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: "#111827",
                        }}>
                        {item.date} {item.time}
                      </Text>
                      <Text style={{ fontSize: 14, color: "#6B7280" }}>
                        {item.route}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      borderRadius: 8,
                      backgroundColor:
                        item.status === "completed" ? "#DCFCE7" : "#FEE2E2",
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        color:
                          item.status === "completed" ? "#166534" : "#DC2626",
                      }}>
                      {getStatusText(item.status)}
                    </Text>
                  </View>
                </View>

                {/* Details */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontSize: 18, marginRight: 8 }}>
                    {item.paymentMethod === "카드" ? "💳" : "💵"}
                  </Text>
                  <Text style={{ fontSize: 14, color: "#6B7280" }}>
                    {item.paymentMethod}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Empty State */}
          {usageHistory.length === 0 && (
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
          )}
        </ScrollView>
      </View>
    </Screen>
  );
}
