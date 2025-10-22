import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import { router } from "expo-router";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface FerryScheduleItem {
  id: string;
  departureTime: string;
  arrivalTime: string;
  route: string; // 배 이름
  routeInfo: string; // 출도착지 정보
  duration: string; // 소요시간
  departureLocation: string; // 출발지
  availableSeats: number;
  status: "available" | "limited" | "full";
}

const FERRY_SCHEDULES: FerryScheduleItem[] = [
  {
    id: "1",
    departureTime: "14:30",
    arrivalTime: "15:09",
    route: "평화웨이브호",
    routeInfo: "녹동-중송",
    duration: "39분",
    departureLocation: "녹동항",
    availableSeats: 15,
    status: "available",
  },
  {
    id: "2",
    departureTime: "15:30",
    arrivalTime: "16:09",
    route: "평화웨이브호",
    routeInfo: "녹동-중송",
    duration: "39분",
    departureLocation: "녹동항",
    availableSeats: 8,
    status: "limited",
  },
  {
    id: "3",
    departureTime: "16:30",
    arrivalTime: "17:09",
    route: "평화웨이브호",
    routeInfo: "녹동-중송",
    duration: "39분",
    departureLocation: "녹동항",
    availableSeats: 12,
    status: "available",
  },
  {
    id: "4",
    departureTime: "17:30",
    arrivalTime: "18:09",
    route: "평화웨이브호",
    routeInfo: "녹동-중송",
    duration: "39분",
    departureLocation: "녹동항",
    availableSeats: 0,
    status: "full",
  },
  {
    id: "5",
    departureTime: "18:30",
    arrivalTime: "19:09",
    route: "평화웨이브호",
    routeInfo: "녹동-중송",
    duration: "39분",
    departureLocation: "녹동항",
    availableSeats: 20,
    status: "available",
  },
];

export default function FerryScheduleScreen() {
  const handleScheduleSelect = (schedule: FerryScheduleItem) => {
    if (schedule.status === "full") return;

    // TODO: Store selected schedule in store
    // 노선 선택 없이 바로 승차정류장 선택으로 이동
    router.push("/(flows)/common/select-boarding-stop?flow=ferry" as any);
  };

  const getStatusInfo = (status: string, availableSeats: number) => {
    switch (status) {
      case "available":
        return {
          text: "좌석 여유 가능",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "limited":
        return {
          text: `좌석 ${availableSeats}석 남음`,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
        };
      case "full":
        return {
          text: "만석",
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      default:
        return {
          text: "",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
    }
  };

  return (
    <View className="flex-1 bg-drt-background">
      <StatusBar barStyle="dark-content" backgroundColor="#ececec" />

      {/* Subtitle */}

      {/* Schedule Cards */}
      <ScrollView
        className="flex-1 px-6 mt-6"
        showsVerticalScrollIndicator={false}>
        <View className="w-full items-center mt-4 mb-8">
          <Text className="text-drt-text text-base font-medium text-center opacity-50">
            원하는 시간을 선택해주세요.
          </Text>
        </View>

        <View className="space-y-6">
          {FERRY_SCHEDULES.map((schedule, index) => {
            const statusInfo = getStatusInfo(
              schedule.status,
              schedule.availableSeats
            );

            // 카드 배경색 결정 (새 디자인에 맞게)
            const getCardStyle = (status: string) => {
              switch (status) {
                case "available":
                  return {
                    backgroundColor: "#FFFFFF",
                    borderLeftWidth: 6,
                    borderLeftColor: "#2ED2A3", // 녹색 (그라데이션 대신 좌측 테두리)
                  };
                case "limited":
                  return {
                    backgroundColor: "#FFFFFF",
                    borderLeftWidth: 6,
                    borderLeftColor: "#F26264", // 빨간색
                  };
                case "full":
                  return {
                    backgroundColor: "#FFFFFF",
                    borderLeftWidth: 6,
                    borderLeftColor: "#F26264", // 빨간색
                  };
                default:
                  return {
                    backgroundColor: "#FFFFFF",
                    borderLeftWidth: 6,
                    borderLeftColor: "#2ED2A3",
                  };
              }
            };

            return (
              <TouchableOpacity
                key={schedule.id}
                className={`w-full rounded-2xl p-5 ${
                  schedule.status === "full" ? "opacity-60" : ""
                }`}
                onPress={() => handleScheduleSelect(schedule)}
                disabled={schedule.status === "full"}
                style={{
                  ...getCardStyle(schedule.status),
                  height: schedule.status === "full" ? 190 : 140, // 만석일 때 카드 높이 확장
                  shadowColor: "#000",
                  shadowOffset: { width: 3, height: 3 },
                  shadowOpacity: 0.16,
                  shadowRadius: 3,
                  elevation: 3,
                }}>
                {/* Card Content - 새 디자인 레이아웃에 맞게 */}
                <View className="flex-1 justify-between">
                  {/* 상단: 좌석상태 + 배 이름 (좌우 끝 배치) */}
                  <View className="flex-row items-center justify-between">
                    <Text className={`text-sm font-bold ${statusInfo.color}`}>
                      {statusInfo.text}
                    </Text>
                    <Text className="text-drt-text text-sm font-medium">
                      {schedule.route}
                    </Text>
                  </View>

                  {/* 중단: 출발시간 → 도착시간 (가운데 정렬) */}
                  <View className="items-start">
                    <Text className="text-3xl font-bold text-drt-text">
                      {schedule.departureTime} → {schedule.arrivalTime}
                    </Text>
                  </View>

                  {/* 하단: 출도착지 + 출발위치 (좌우 끝 배치) */}
                  <View className="flex-row items-center justify-between">
                    <View
                      className="px-2 rounded-[16px]"
                      style={{
                        backgroundColor: "rgba(22, 72, 200, 0.2)",
                        borderColor: "#1648c8",
                      }}>
                      <Text
                        className="text-sm font-medium"
                        style={{ color: "#1648c8" }}>
                        {schedule.routeInfo}
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-700 font-medium">
                      출발: {schedule.departureLocation}
                    </Text>
                  </View>

                  {schedule.status === "full" && (
                    <View className="mt-2 pt-4 border-t border-red-200">
                      <Text className="text-sm text-red-600 font-medium text-center">
                        이 시간대는 예약이 마감되었습니다
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Info Card */}
        <View className="bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-200 mt-6">
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center mr-3">
              <Text className="text-white text-sm">ℹ️</Text>
            </View>
            <Text className="text-blue-900 font-bold text-base">이용 안내</Text>
          </View>
          <Text className="text-blue-800 text-sm leading-5">
            • 출발 10분 전까지 승선 완료 필요{"\n"}• 좌석은 선착순으로
            배정됩니다{"\n"}• 날씨에 따라 운항이 취소될 수 있습니다
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
