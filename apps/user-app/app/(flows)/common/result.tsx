import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, ScrollView, StatusBar, Text } from "react-native";
import { router } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallStore, useCurrentLocation } from "@drt/store";
import { api } from "@drt/api-client";
import { ResultHeader } from "./components/ResultHeader";
import TripInfoCard from "./components/TripInfoCard";
import VehicleInfoCard from "./components/VehicleInfoCard";
import { CallIdCard } from "./components/CallIdCard";
import { ActionButtons } from "./components/ActionButtons";
import { CallCancellationModals } from "./components/CallCancellationModals";
import {
  callVehicle,
  type CallVehicleRequest,
  type CallVehicleResponse,
  type CallVehicleResponseItem,
} from "../../../services/callVehicle";
import {
  formatCallDateTime,
  formatTimestampToReadable,
} from "../../../utils/datetime";
import { useCallCancellation } from "../../../hooks/useCallCancellation";

export default function ResultScreen() {
  const {
    mode,
    destStopId,
    destStopName,
    originStopId,
    busBoardingStopId,
    busBoardingStopName,
    busAlightingStopId,
    busAlightingStopName,
    ferryBoardingStopId,
    ferryBoardingStopName,
    ferrySelectedSchedule,
    passengerCount,
    deviceId,
    currentCallId,
    callStatus,
    setCurrentCall,
    setCallStatus,
    setLoading,
    setError,
    callValidation,
    clearCallValidation,
  } = useCallStore();
  const currentLocation = useCurrentLocation();
  const coords = currentLocation?.coords;

  // 호출 API 응답 상태
  const [callResult, setCallResult] = useState<CallVehicleResponseItem | null>(
    null
  );

  const startAndEndIds = useMemo(() => {
    if (mode === "bus") {
      return {
        startPointId: busBoardingStopId || originStopId || null,
        endPointId: busAlightingStopId || destStopId || null,
      };
    }

    if (mode === "passenger") {
      return {
        startPointId: ferryBoardingStopId || originStopId || null,
        endPointId: busAlightingStopId || destStopId || null,
      };
    }

    return {
      startPointId: originStopId,
      endPointId: destStopId,
    };
  }, [
    mode,
    busBoardingStopId,
    busAlightingStopId,
    ferryBoardingStopId,
    originStopId,
    destStopId,
  ]);

  const { startPointId, endPointId } = startAndEndIds;
  const validationParams = callValidation?.params;
  const scheduleRideTime = formatTimestampToReadable(
    validationParams?.SCHEDULE_RIDE_DTM,
    {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
  const scheduleAlightTime = formatTimestampToReadable(
    validationParams?.SCHEDULE_ALGH_DTM,
    {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  useEffect(() => {
    if (!callValidation) {
      router.replace("/");
    }
  }, [callValidation, router]);

  // Create call mutation
  const {
    mutate: mutateCallVehicle,
    isPending: isCallPending,
    isSuccess: isCallSuccess,
    isError: isCallError,
  } = useMutation<CallVehicleResponse, Error, CallVehicleRequest>({
    mutationFn: (request: CallVehicleRequest) => callVehicle(request),
    onSuccess: (response: CallVehicleResponse) => {
      console.log("[ResultScreen] 호출 응답", response);
      const [result] = response;

      if (result?.RESULT === "SUCCESS") {
        setCallResult(result);
        setCallStatus("confirmed");
        setError(null);
      } else {
        const message =
          result?.MESSAGE || "호출이 실패했습니다. 다시 시도해주세요.";
        setCallResult(result ?? null);
        setCallStatus("cancelled");
        setError(message);
      }

      setCurrentCall(null);
      setLoading(false);
    },
    onError: (error: any) => {
      console.error("[ResultScreen] 호출 실패", error);
      setCallStatus("cancelled");
      setError(error.message || "호출 중 오류가 발생했습니다.");
      setCurrentCall(null);
      setCallResult(null);
      setLoading(false);
    },
  });

  const {
    isCancelPending,
    isConfirmVisible,
    isSuccessVisible,
    openConfirmModal,
    closeConfirmModal,
    confirmCancellation,
    closeSuccessModal,
  } = useCallCancellation();

  // Fetch stop information
  const { data: originStop } = useQuery({
    queryKey: ["stop", startPointId],
    queryFn: () => (startPointId ? api.getStop(startPointId) : null),
    enabled: !!startPointId,
  });

  const { data: destStop } = useQuery({
    queryKey: ["stop", endPointId],
    queryFn: () => (endPointId ? api.getStop(endPointId) : null),
    enabled: !!endPointId,
  });

  const canRequestCall =
    !!mode &&
    !!startPointId &&
    !!endPointId &&
    !!coords &&
    passengerCount > 0 &&
    callValidation?.result === "SUCCESS" &&
    !!callValidation.params;

  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (!canRequestCall) {
      return;
    }

    if (callStatus !== "idle") {
      return;
    }

    if (hasRequestedRef.current) {
      return;
    }

    const payload = callValidation?.params;
    if (!payload) {
      console.warn("[ResultScreen] 검증 정보가 존재하지 않습니다.");
      clearCallValidation();
      router.replace("/");
      return;
    }

    setCurrentCall(null);
    setCallResult(null);
    setLoading(true);
    setError(null);
    setCallStatus("calling");

    hasRequestedRef.current = true;
    console.log("[ResultScreen] 호출 요청 payload", payload);
    mutateCallVehicle(payload);
  }, [
    canRequestCall,
    callStatus,
    setLoading,
    setError,
    setCallStatus,
    mutateCallVehicle,
    setCurrentCall,
    callValidation,
    clearCallValidation,
    router,
  ]);

  const headerResult = callResult;

  const fallbackOriginName =
    mode === "bus"
      ? busBoardingStopName
      : mode === "passenger"
        ? ferryBoardingStopName
        : null;
  const fallbackDestName =
    mode === "bus"
      ? busAlightingStopName
      : mode === "passenger"
        ? (destStopName ?? ferrySelectedSchedule?.routeName ?? null)
        : null;
  const resolvedOriginStopName =
    originStop?.name ?? fallbackOriginName ?? undefined;
  const resolvedDestStopName = destStop?.name ?? fallbackDestName ?? undefined;

  const headerTitle =
    callStatus === "confirmed"
      ? "호출완료!"
      : callStatus === "calling"
        ? "호출 중..."
        : "호출 실패";

  const headerSubtitle =
    headerResult?.MESSAGE ||
    (callStatus === "calling"
      ? "차량 배정을 진행 중입니다."
      : isCallError
        ? "호출 중 오류가 발생했습니다."
        : "다시 시도해주세요.");

  const isSuccess =
    callStatus === "confirmed" && headerResult?.RESULT === "SUCCESS";

  const handleBackToHome = () => {
    clearCallValidation();
    router.replace("/");
  };

  const handleCancelCall = () => {
    openConfirmModal();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ececec" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ececec" />

      {/* Header Section */}
      <ResultHeader title={headerTitle} subtitle={headerSubtitle} />

      {/* Content Cards */}
      <View style={{ flex: 1, paddingHorizontal: 16, marginTop: 16 }}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Trip Information Card */}
          <TripInfoCard
            mode={mode}
            originStopName={resolvedOriginStopName}
            destStopName={resolvedDestStopName}
          />

          {scheduleRideTime && (
            <View
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 16,
                padding: 20,
                marginTop: 16,
                gap: 12,
                shadowColor: "#000",
                shadowOffset: { width: 3, height: 3 },
                shadowOpacity: 0.12,
                shadowRadius: 3,
                elevation: 3,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#111827",
                }}>
                예정 승하차 정보
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
                <Text style={{ color: "#6B7280" }}>승차 예정</Text>
                <Text style={{ fontWeight: "600", color: "#111827" }}>
                  {scheduleRideTime}
                </Text>
              </View>
              {scheduleAlightTime && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}>
                  <Text style={{ color: "#6B7280" }}>하차 예정</Text>
                  <Text style={{ fontWeight: "600", color: "#111827" }}>
                    {scheduleAlightTime}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Vehicle Information */}
          <VehicleInfoCard />

          {/* Call ID */}
          {currentCallId && <CallIdCard callId={currentCallId} />}

          {/* Capacity Info */}
          {isSuccess && headerResult && (
            <View
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 16,
                padding: 20,
                marginTop: 16,
                shadowColor: "#000",
                shadowOffset: { width: 3, height: 3 },
                shadowOpacity: 0.12,
                shadowRadius: 3,
                elevation: 3,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#111827",
                  marginBottom: 12,
                }}>
                호출 결과
              </Text>
              <View style={{ gap: 8 }}>
                <Text style={{ color: "#4b5563" }}>
                  {`최대 수용 인원: ${headerResult.CAPACITY}명`}
                </Text>
                <Text style={{ color: "#4b5563" }}>
                  {`현재 예약 인원: ${headerResult.CURREN_RESERVED}명`}
                </Text>
                <Text style={{ color: "#4b5563" }}>
                  {`이번 예약 인원: ${headerResult.NEWRSV}명`}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Action Buttons and KICT Logo */}
      <ActionButtons
        onCancelCall={handleCancelCall}
        onBackToHome={handleBackToHome}
        isCancelDisabled={isCancelPending || isCallPending}
      />

      <CallCancellationModals
        isConfirmVisible={isConfirmVisible}
        isSuccessVisible={isSuccessVisible}
        onRequestCancel={closeConfirmModal}
        onConfirmCancel={confirmCancellation}
        onDismissSuccess={closeSuccessModal}
        isCancelling={isCancelPending}
      />
    </View>
  );
}
