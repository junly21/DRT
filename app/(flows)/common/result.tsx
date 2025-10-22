import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { router } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Screen } from "../../../components/ui/Screen";
import { useCallStore } from "@drt/store";
import { api, CallRequest } from "@drt/api-client";

export default function ResultScreen() {
  const {
    mode,
    destStopId,
    originStopId,
    busBoardingStopId,
    busAlightingStopId,
    ferryBoardingStopId,
    currentCallId,
    callStatus,
    setCurrentCall,
    setCallStatus,
    setLoading,
    setError,
  } = useCallStore();

  // 전화 걸기 모달 상태
  const [showCallModal, setShowCallModal] = useState(false);
  const [callMessage, setCallMessage] = useState("");

  // 현재 flow에 따라 올바른 stop ID를 사용
  const getStopIds = () => {
    if (mode === "bus") {
      return {
        originStopId: busBoardingStopId || originStopId,
        destStopId: busAlightingStopId || destStopId,
      };
    } else if (mode === "passenger") {
      // Ferry flow: 출발지는 선택한 정류장, 도착지는 터미널로 고정
      return {
        originStopId: ferryBoardingStopId || originStopId,
        destStopId: "ferry_1", // 녹동항 여객터미널로 고정
      };
    }
    return {
      originStopId: originStopId,
      destStopId: destStopId,
    };
  };

  const { originStopId: currentOriginStopId, destStopId: currentDestStopId } =
    getStopIds();

  // Create call mutation
  const createCallMutation = useMutation({
    mutationFn: (request: CallRequest) => api.createCall(request),
    onSuccess: (response) => {
      setCurrentCall(response.id);
      setCallStatus("confirmed");
      setError(null);
    },
    onError: (error: any) => {
      setCallStatus("cancelled");
      setError(error.message || "호출 중 오류가 발생했습니다.");
    },
  });

  // Poll call status
  const { data: callData } = useQuery({
    queryKey: ["call", currentCallId],
    queryFn: () => (currentCallId ? api.getCall(currentCallId) : null),
    enabled: !!currentCallId && callStatus === "confirmed",
    refetchInterval: 5000, // Poll every 5 seconds
  });

  // Fetch stop information
  const { data: originStop } = useQuery({
    queryKey: ["stop", currentOriginStopId],
    queryFn: () =>
      currentOriginStopId ? api.getStop(currentOriginStopId) : null,
    enabled: !!currentOriginStopId,
  });

  const { data: destStop } = useQuery({
    queryKey: ["stop", currentDestStopId],
    queryFn: () => (currentDestStopId ? api.getStop(currentDestStopId) : null),
    enabled: !!currentDestStopId,
  });

  // Create call on mount if not already created
  useEffect(() => {
    if (
      !currentCallId &&
      mode &&
      currentOriginStopId &&
      currentDestStopId &&
      callStatus !== "calling"
    ) {
      setCallStatus("calling");
      setLoading(true);

      const request: CallRequest = {
        mode,
        originStopId: currentOriginStopId,
        destStopId: currentDestStopId,
      };

      createCallMutation.mutate(request);
    }
  }, [currentOriginStopId, currentDestStopId]);

  const handleBackToHome = () => {
    router.replace("/");
  };

  const handleCancelCall = async () => {
    if (currentCallId) {
      try {
        await api.cancelCall(currentCallId);
        setCallStatus("cancelled");
      } catch (error) {
        console.error("Failed to cancel call:", error);
      }
    }
  };

  const handleCallDriver = (phoneNumber: string) => {
    setCallMessage(`${phoneNumber}로 전화를 걸까요?`);
    setShowCallModal(true);
  };

  const confirmCall = () => {
    // 실제 앱에서는 Linking.openURL(`tel:${phoneNumber}`) 사용
    // 웹에서는 시뮬레이션용 토스트만 표시
    setCallMessage("전화를 겁니다...");
    setTimeout(() => {
      setShowCallModal(false);
    }, 1500);
  };

  const getStatusInfo = () => {
    switch (callStatus) {
      case "calling":
        return {
          icon: "⏳",
          title: "호출 중...",
          description: "요청을 처리하고 있습니다.",
          color: "blue",
          bgColor: "bg-blue-50",
          textColor: "text-blue-800",
          borderColor: "border-blue-200",
        };
      case "confirmed":
        return {
          icon: "✅",
          title: "호출 완료!",
          description: "차량이 배정되었습니다.",
          color: "green",
          bgColor: "bg-green-50",
          textColor: "text-green-800",
          borderColor: "border-green-200",
        };
      case "cancelled":
        return {
          icon: "❌",
          title: "호출 취소됨",
          description: "호출이 취소되었습니다.",
          color: "red",
          bgColor: "bg-red-50",
          textColor: "text-red-800",
          borderColor: "border-red-200",
        };
      default:
        return {
          icon: "⏳",
          title: "처리 중...",
          description: "잠시만 기다려주세요.",
          color: "gray",
          bgColor: "bg-gray-50",
          textColor: "text-gray-800",
          borderColor: "border-gray-200",
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Screen>
      <View className="flex-1 bg-gray-50">
        {/* Status Header */}
        <View
          className={`${statusInfo.bgColor} px-6 py-8 border-b ${statusInfo.borderColor}`}>
          <View className="items-center">
            <View className="w-20 h-20 bg-white rounded-3xl items-center justify-center mb-6 shadow-lg">
              <Text className="text-4xl">{statusInfo.icon}</Text>
            </View>
            <Text
              className={`text-2xl font-bold ${statusInfo.textColor} text-center mb-2`}>
              {statusInfo.title}
            </Text>
            <Text className={`${statusInfo.textColor} text-center text-base`}>
              {statusInfo.description}
            </Text>
            {createCallMutation.isPending && (
              <ActivityIndicator
                size="large"
                color="#3b82f6"
                className="mt-4"
              />
            )}
          </View>
        </View>

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}>
          {/* Trip Information */}
          <View className="py-6">
            <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
              <View className="flex-row items-center mb-4">
                <View
                  className={`w-12 h-12 ${mode === "passenger" ? "bg-blue-100" : "bg-green-100"} rounded-xl items-center justify-center mr-4`}>
                  <Text className="text-2xl">
                    {mode === "passenger" ? "⛴️" : "🚌"}
                  </Text>
                </View>
                <View>
                  <Text className="text-lg font-bold text-gray-900">
                    {mode === "passenger" ? "여객선 이용" : "버스 이용"}
                  </Text>
                  <Text className="text-sm text-gray-600">여행 정보</Text>
                </View>
              </View>

              {/* Route */}
              <View className="bg-gray-50 rounded-xl p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-sm text-gray-600 mb-1">출발지</Text>
                    <Text className="font-semibold text-gray-900">
                      {originStop?.name || "정류장 정보 로딩 중..."}
                    </Text>
                  </View>
                  <View className="mx-4">
                    <Text className="text-2xl text-gray-400">→</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm text-gray-600 mb-1">도착지</Text>
                    <Text className="font-semibold text-gray-900">
                      {destStop?.name || "정류장 정보 로딩 중..."}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Time Information */}
              {callData &&
                (callData.estimatedBoardingTime ||
                  callData.estimatedAlightingTime) && (
                  <View className="bg-blue-50 rounded-xl p-4 mt-4">
                    <Text className="text-sm font-medium text-blue-900 mb-3">
                      ⏰ 예상 운행 시간
                    </Text>
                    <View className="space-y-2">
                      {callData.estimatedBoardingTime && (
                        <View className="flex-row items-center justify-between">
                          <Text className="text-blue-800 text-sm">
                            탑승 예정시간
                          </Text>
                          <Text className="text-blue-900 font-semibold">
                            {new Date(
                              callData.estimatedBoardingTime
                            ).toLocaleTimeString("ko-KR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Text>
                        </View>
                      )}
                      {callData.estimatedAlightingTime && (
                        <View className="flex-row items-center justify-between">
                          <Text className="text-blue-800 text-sm">
                            하차 예정시간
                          </Text>
                          <Text className="text-blue-900 font-semibold">
                            {new Date(
                              callData.estimatedAlightingTime
                            ).toLocaleTimeString("ko-KR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
            </View>

            {/* Vehicle Information */}
            {callData?.vehicleInfo && (
              <View className="bg-green-50 rounded-2xl p-6 mb-6 border border-green-200">
                <View className="flex-row items-center mb-4">
                  <View className="w-12 h-12 bg-green-100 rounded-xl items-center justify-center mr-4">
                    <Text className="text-2xl">🚌</Text>
                  </View>
                  <View>
                    <Text className="text-lg font-bold text-green-900">
                      차량 정보
                    </Text>
                    <Text className="text-sm text-green-700">배정된 차량</Text>
                  </View>
                </View>
                <View className="space-y-2">
                  <Text className="text-green-800">
                    • 차량 번호: {callData.vehicleInfo.licensePlate}
                  </Text>
                  <Text className="text-green-800">
                    • 차량 종류: {callData.vehicleInfo.type}
                  </Text>
                  {callData.driver && (
                    <>
                      <Text className="text-green-800">
                        • 기사님: {callData.driver.name}
                      </Text>
                      <View className="flex-row items-center">
                        <Text className="text-green-800">
                          • 연락처: {callData.driver.phone}
                        </Text>
                        <TouchableOpacity
                          className="ml-2 w-8 h-8 bg-green-600 rounded-full items-center justify-center"
                          onPress={() => {
                            if (callData.driver?.phone) {
                              handleCallDriver(callData.driver.phone);
                            }
                          }}>
                          <Text className="text-white text-sm">📞</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              </View>
            )}

            {/* Call ID */}
            {currentCallId && (
              <View className="bg-gray-100 rounded-xl p-4 mb-6">
                <Text className="text-gray-600 text-sm text-center">
                  호출 번호: {currentCallId}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View className="px-6 pb-6 space-y-3">
          {callStatus === "confirmed" && currentCallId && (
            <TouchableOpacity
              className="bg-red-500 rounded-xl py-4 shadow-lg"
              onPress={handleCancelCall}>
              <Text className="text-white text-lg font-bold text-center">
                호출 취소
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="bg-gray-500 rounded-xl py-4 shadow-lg"
            onPress={handleBackToHome}>
            <Text className="text-white text-lg font-bold text-center">
              홈으로 돌아가기
            </Text>
          </TouchableOpacity>
        </View>

        {/* 전화 걸기 모달 */}
        <Modal
          visible={showCallModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCallModal(false)}>
          <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-6">
            <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
              <Text className="text-xl font-bold text-gray-900 text-center mb-4">
                📞 전화하기
              </Text>
              <Text className="text-gray-600 text-center mb-6">
                {callMessage}
              </Text>
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  className="flex-1 bg-gray-300 rounded-xl py-3"
                  onPress={() => setShowCallModal(false)}>
                  <Text className="text-gray-700 text-center font-semibold">
                    취소
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-green-600 rounded-xl py-3"
                  onPress={confirmCall}>
                  <Text className="text-white text-center font-semibold">
                    전화하기
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Screen>
  );
}
