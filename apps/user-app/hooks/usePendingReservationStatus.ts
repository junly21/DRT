import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallStore } from "@drt/store";
import {
  fetchVehicleCallStatus,
  type VehicleCallStatusItem,
} from "../services/selectVehicleCallStatus";
import {
  formatEpochMsToCallDateTime,
  formatEpochMsToDispatchDate,
} from "../utils/datetime";

export function usePendingReservationStatus() {
  const deviceId = useCallStore((state) => state.deviceId);
  const activeReservation = useCallStore((state) => state.activeReservation);
  const setActiveReservation = useCallStore(
    (state) => state.setActiveReservation
  );
  const setCallValidation = useCallStore((state) => state.setCallValidation);
  const clearCallValidation = useCallStore(
    (state) => state.clearCallValidation
  );
  const setCallStatus = useCallStore((state) => state.setCallStatus);
  const setPassengerCount = useCallStore((state) => state.setPassengerCount);
  const setPayment = useCallStore((state) => state.setPayment);
  const setMode = useCallStore((state) => state.setMode);
  const setBusBoardingStop = useCallStore((state) => state.setBusBoardingStop);
  const setBusAlightingStop = useCallStore(
    (state) => state.setBusAlightingStop
  );
  const setFerryBoardingStop = useCallStore(
    (state) => state.setFerryBoardingStop
  );
  const setDestStop = useCallStore((state) => state.setDestStop);
  const setCurrentCall = useCallStore((state) => state.setCurrentCall);

  const [isPromptVisible, setPromptVisible] = useState(false);
  const [isChecking, setChecking] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);

  const hydrateReservation = useCallback(
    (item: VehicleCallStatusItem) => {
      const rawCallDiv =
        item.call_div ??
        (item as unknown as { CALL_DIV?: string }).CALL_DIV ??
        null;

      const normalizedCallDiv =
        rawCallDiv && rawCallDiv.toUpperCase() === "FERRY"
          ? "FERRY"
          : rawCallDiv && rawCallDiv.toUpperCase() === "STN"
            ? "STN"
            : null;

      const currentMode = useCallStore.getState().mode;
      const modeFallback =
        currentMode === "passenger"
          ? "FERRY"
          : currentMode === "bus"
            ? "STN"
            : null;

      const inferredCallDiv = normalizedCallDiv ?? modeFallback ?? "STN";
      const mode = inferredCallDiv === "FERRY" ? "passenger" : "bus";
      setMode(mode);
      setPassengerCount(item.rsv_num);

      setPayment({
        method: item.payment.toLowerCase() as "card" | "cash" | "mobile",
        amount: null,
      });

      setBusBoardingStop({
        id: item.start_point_id,
        name: item.start_point_nm ?? null,
      });

      setBusAlightingStop({
        id: item.end_point_id,
        name: item.end_point_nm ?? null,
      });

      if (mode === "passenger") {
        setFerryBoardingStop({
          id: item.start_point_id,
          name: item.start_point_nm ?? null,
        });
      }

      setDestStop({
        id: item.end_point_id,
        name: item.end_point_nm ?? null,
      });

      const callDateTime = formatEpochMsToCallDateTime(item.call_dtm);
      const dispatchDate = formatEpochMsToDispatchDate(
        item.schedule_ride_dtm ?? item.call_dtm
      );

      setCallValidation({
        result: "SUCCESS",
        params: {
          DISPATCH_DT: dispatchDate,
          CALL_DTM: callDateTime,
          START_POINT_ID: item.start_point_id,
          END_POINT_ID: item.end_point_id,
          DEVICE_ID: item.device_id,
          GPS_X: "0",
          GPS_Y: "0",
          PAYMENT: item.payment,
          RSV_NUM: item.rsv_num,
          CALL_DIV: inferredCallDiv,
          VEHICLE_ID: item.vehicle_id ?? undefined,
          ROUTE_ID: item.route_id ?? undefined,
          DISPATCH_SEQ: item.dispatch_seq,
          SCHEDULE_RIDE_DTM: item.schedule_ride_dtm ?? undefined,
          SCHEDULE_ALGH_DTM: item.schedule_algh_dtm ?? undefined,
        },
      });

      setCurrentCall(item.dispatch_seq ? String(item.dispatch_seq) : null);

      setActiveReservation({
        dispatchSeq: item.dispatch_seq,
        routeId: item.route_id ?? null,
        routeName: item.route_nm ?? null,
        vehicleId: item.vehicle_id ?? null,
        vehicleNo: item.vehicle_no ?? null,
        startPointId: item.start_point_id,
        startPointName: item.start_point_nm ?? null,
        endPointId: item.end_point_id,
        endPointName: item.end_point_nm ?? null,
        callTimestamp: item.call_dtm,
        scheduleRideTimestamp: item.schedule_ride_dtm ?? null,
        scheduleAlightTimestamp: item.schedule_algh_dtm ?? null,
        payment: item.payment,
        rsvNum: item.rsv_num,
        status: item.rsv_status,
        callDiv: inferredCallDiv,
      });

      setCallStatus("calling");
    },
    [
      setActiveReservation,
      setBusAlightingStop,
      setBusBoardingStop,
      setFerryBoardingStop,
      setCallStatus,
      setCallValidation,
      setCurrentCall,
      setDestStop,
      setMode,
      setPassengerCount,
      setPayment,
    ]
  );

  const clearReservationState = useCallback(() => {
    setActiveReservation(null);
    setCallStatus("idle");
    setCurrentCall(null);
    clearCallValidation();
  }, [
    clearCallValidation,
    setActiveReservation,
    setCallStatus,
    setCurrentCall,
  ]);

  const checkStatus = useCallback(async () => {
    if (!deviceId) {
      return;
    }

    setChecking(true);
    setLastError(null);
    console.log("[HomeReservationWatcher] 예약 상태 조회 시작");
    try {
      const response = await fetchVehicleCallStatus(deviceId);
      const waitingReservation = response?.find(
        (item) => item.rsv_status === "WAIT"
      );

      if (waitingReservation) {
        hydrateReservation(waitingReservation);
        setPromptVisible(true);
      } else {
        setPromptVisible(false);
        clearReservationState();
      }
    } catch (error) {
      const err =
        error instanceof Error
          ? error
          : new Error("예약 상태 조회에 실패했습니다.");
      setLastError(err);
      console.error("[HomeReservationWatcher] 예약 상태 조회 실패", err);
      Alert.alert("예약 상태 조회 실패", err.message);
    } finally {
      setChecking(false);
    }
  }, [clearReservationState, deviceId, hydrateReservation]);

  useFocusEffect(
    useCallback(() => {
      if (!deviceId) {
        return;
      }

      void checkStatus();
    }, [checkStatus, deviceId])
  );

  const dismissPrompt = useCallback(() => {
    setPromptVisible(false);
  }, []);

  const openPrompt = useCallback(() => {
    const reservation = useCallStore.getState().activeReservation;
    if (reservation?.status === "WAIT" && reservation?.callDiv) {
      setPromptVisible(true);
    }
  }, []);

  useEffect(() => {
    if (deviceId) {
      void checkStatus();
    }
  }, [deviceId, checkStatus]);

  return {
    activeReservation,
    isPromptVisible,
    dismissPrompt,
    openPrompt,
    isChecking,
    lastError,
    refetch: checkStatus,
  };
}
