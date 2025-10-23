import React, { useEffect, useState } from "react";
import { View, ScrollView, StatusBar } from "react-native";
import { router } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallStore } from "@drt/store";
import { api, CallRequest } from "@drt/api-client";
import { ResultHeader } from "./components/ResultHeader";
import { TripInfoCard } from "./components/TripInfoCard";
import { VehicleInfoCard } from "./components/VehicleInfoCard";
import { CallIdCard } from "./components/CallIdCard";
import { ActionButtons } from "./components/ActionButtons";
import { CallModal } from "./components/CallModal";

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

  return (
    <View style={{ flex: 1, backgroundColor: "#ececec" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ececec" />

      {/* Header Section */}
      <ResultHeader title="호출완료!" subtitle="차량이 배정되었습니다." />

      {/* Content Cards */}
      <View style={{ flex: 1, paddingHorizontal: 16, marginTop: 16 }}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Trip Information Card */}
          <TripInfoCard
            mode={mode}
            originStopName={originStop?.name}
            destStopName={destStop?.name}
            estimatedBoardingTime={callData?.estimatedBoardingTime}
            estimatedAlightingTime={callData?.estimatedAlightingTime}
          />

          {/* Vehicle Information Card */}
          {callData?.vehicleInfo && (
            <VehicleInfoCard
              vehicleInfo={callData.vehicleInfo}
              driver={callData.driver}
              onCallDriver={handleCallDriver}
            />
          )}

          {/* Call ID */}
          {currentCallId && <CallIdCard callId={currentCallId} />}
        </ScrollView>
      </View>

      {/* Action Buttons and KICT Logo */}
      <ActionButtons
        callStatus={callStatus}
        currentCallId={currentCallId}
        onCancelCall={handleCancelCall}
        onBackToHome={handleBackToHome}
      />

      {/* Call Modal */}
      <CallModal
        visible={showCallModal}
        message={callMessage}
        onClose={() => setShowCallModal(false)}
        onConfirm={confirmCall}
      />
    </View>
  );
}
