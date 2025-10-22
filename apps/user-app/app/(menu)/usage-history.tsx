import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Screen } from "../../components/ui/Screen";
import { getButtonClasses, MATERIAL_ICONS } from "@drt/utils";

interface UsageHistoryItem {
  id: string;
  date: string;
  time: string;
  type: "ferry" | "bus";
  route: string;
  amount: number;
  status: "completed" | "cancelled" | "refunded";
  paymentMethod: string;
}

const USAGE_HISTORY: UsageHistoryItem[] = [
  {
    id: "1",
    date: "2024-01-15",
    time: "14:30",
    type: "ferry",
    route: "녹동항 → 중송항 (터미널행 버스)",
    amount: 2500,
    status: "completed",
    paymentMethod: "신용카드",
  },
  {
    id: "2",
    date: "2024-01-14",
    time: "09:15",
    type: "bus",
    route: "시청 → 공항",
    amount: 1800,
    status: "completed",
    paymentMethod: "삼성페이",
  },
  {
    id: "3",
    date: "2024-01-13",
    time: "16:45",
    type: "ferry",
    route: "녹동항 → 중송항 (터미널행 버스)",
    amount: 2500,
    status: "cancelled",
    paymentMethod: "신용카드",
  },
  {
    id: "4",
    date: "2024-01-12",
    time: "11:20",
    type: "bus",
    route: "대학가 → 시청",
    amount: 1200,
    status: "refunded",
    paymentMethod: "현금",
  },
];

export default function UsageHistoryScreen() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "ferry" | "bus">(
    "all"
  );
  const [usageHistory] = useState<UsageHistoryItem[]>(USAGE_HISTORY);

  const filteredHistory = usageHistory.filter((item) => {
    if (selectedFilter === "all") return true;
    return item.type === selectedFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
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
      case "refunded":
        return "환불";
      default:
        return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ferry":
        return MATERIAL_ICONS.ferry;
      case "bus":
        return MATERIAL_ICONS.bus;
      default:
        return MATERIAL_ICONS.bus;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ferry":
        return "bg-blue-50 border-blue-200";
      case "bus":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const totalAmount = filteredHistory
    .filter((item) => item.status === "completed")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalTrips = filteredHistory.filter(
    (item) => item.status === "completed"
  ).length;

  return (
    <Screen>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View className="flex-row space-x-4 mb-6">
          <View className="flex-1 bg-blue-50 rounded-xl p-4 border border-blue-200">
            <Text className="text-blue-900 font-bold text-lg mb-1">
              총 이용 횟수
            </Text>
            <Text className="text-2xl font-bold text-blue-800">
              {totalTrips}회
            </Text>
          </View>
          <View className="flex-1 bg-green-50 rounded-xl p-4 border border-green-200">
            <Text className="text-green-900 font-bold text-lg mb-1">
              총 결제 금액
            </Text>
            <Text className="text-2xl font-bold text-green-800">
              {totalAmount.toLocaleString()}원
            </Text>
          </View>
        </View>

        {/* Filter Buttons */}
        <View className="flex-row space-x-3 mb-6">
          <TouchableOpacity
            className={`px-4 py-2 rounded-lg ${
              selectedFilter === "all" ? "bg-blue-600" : "bg-gray-200"
            }`}
            onPress={() => setSelectedFilter("all")}>
            <Text
              className={`font-bold ${
                selectedFilter === "all" ? "text-white" : "text-gray-700"
              }`}>
              전체
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 py-2 rounded-lg ${
              selectedFilter === "ferry" ? "bg-blue-600" : "bg-gray-200"
            }`}
            onPress={() => setSelectedFilter("ferry")}>
            <Text
              className={`font-bold ${
                selectedFilter === "ferry" ? "text-white" : "text-gray-700"
              }`}>
              여객선
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 py-2 rounded-lg ${
              selectedFilter === "bus" ? "bg-blue-600" : "bg-gray-200"
            }`}
            onPress={() => setSelectedFilter("bus")}>
            <Text
              className={`font-bold ${
                selectedFilter === "bus" ? "text-white" : "text-gray-700"
              }`}>
              버스
            </Text>
          </TouchableOpacity>
        </View>

        {/* History List */}
        <View className="space-y-4 mb-6">
          {filteredHistory.map((item) => (
            <View
              key={item.id}
              className={`${getTypeColor(item.type)} rounded-xl p-6 border-2`}>
              {/* Header */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-3">
                    {getTypeIcon(item.type)}
                  </Text>
                  <View>
                    <Text className="text-lg font-bold text-gray-900">
                      {item.date} {item.time}
                    </Text>
                    <Text className="text-sm text-gray-600">{item.route}</Text>
                  </View>
                </View>

                <View
                  className={`px-3 py-1 rounded-lg ${getStatusColor(item.status)}`}>
                  <Text className="text-sm font-bold">
                    {getStatusText(item.status)}
                  </Text>
                </View>
              </View>

              {/* Details */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className="text-lg mr-2">{MATERIAL_ICONS.card}</Text>
                  <Text className="text-sm text-gray-600">
                    {item.paymentMethod}
                  </Text>
                </View>

                <Text className="text-xl font-bold text-gray-900">
                  {item.amount.toLocaleString()}원
                </Text>
              </View>

              {/* Actions */}
              {item.status === "completed" && (
                <View className="mt-4 pt-4 border-t border-gray-200">
                  <TouchableOpacity
                    className="bg-gray-100 py-2 px-4 rounded-lg"
                    onPress={() =>
                      Alert.alert("알림", "영수증 재발급 기능은 준비중입니다.")
                    }>
                    <Text className="text-gray-700 font-bold text-center">
                      영수증 재발급
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Empty State */}
        {filteredHistory.length === 0 && (
          <View className="bg-gray-50 rounded-xl p-8 items-center">
            <Text className="text-4xl mb-4">{MATERIAL_ICONS.info}</Text>
            <Text className="text-lg font-bold text-gray-700 mb-2">
              이용 내역이 없습니다
            </Text>
            <Text className="text-sm text-gray-500 text-center">
              DRT 서비스를 이용하시면 여기에 기록이 표시됩니다
            </Text>
          </View>
        )}

        {/* Info */}
        <View className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
          <View className="flex-row items-center mb-3">
            <Text className="text-lg mr-2">{MATERIAL_ICONS.info}</Text>
            <Text className="text-blue-900 font-bold">이용 내역 안내</Text>
          </View>
          <Text className="text-blue-800 text-sm leading-6 font-medium">
            • 이용 내역은 최근 3개월간의 기록을 보여줍니다{"\n"}• 영수증은 결제
            완료 후 자동으로 발급됩니다{"\n"}• 환불이나 취소된 건은 별도로
            표시됩니다
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}
