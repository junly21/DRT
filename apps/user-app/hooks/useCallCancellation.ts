import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useCallStore } from "@drt/store";
import {
  cancelVehicleCall,
  type CancelVehicleRequest,
  type CancelVehicleResponse,
} from "../services/cancelVehicleCall";

export function useCallCancellation() {
  const router = useRouter();
  const {
    deviceId,
    setCallStatus,
    clearCallValidation,
    setCurrentCall,
    callValidation,
  } = useCallStore((state) => ({
    deviceId: state.deviceId,
    setCallStatus: state.setCallStatus,
    clearCallValidation: state.clearCallValidation,
    setCurrentCall: state.setCurrentCall,
    callValidation: state.callValidation,
  }));

  const [isConfirmVisible, setConfirmVisible] = useState(false);
  const [isSuccessVisible, setSuccessVisible] = useState(false);

  const { mutate, isPending } = useMutation<
    CancelVehicleResponse,
    Error,
    CancelVehicleRequest
  >({
    mutationFn: (payload) => cancelVehicleCall(payload),
    onSuccess: (response) => {
      console.log("[CallCancellation] 응답", response);
      if (response.status === "ok") {
        setCallStatus("cancelled");
        clearCallValidation();
        setCurrentCall(null);
        setSuccessVisible(true);
      } else {
        Alert.alert(
          "호출 취소 실패",
          "호출 취소에 실패했습니다. 다시 시도해주세요."
        );
      }
    },
    onError: (error: Error) => {
      console.error("[CallCancellation] 호출 취소 실패", error);
      Alert.alert(
        "호출 취소 실패",
        error.message || "호출 취소 중 오류가 발생했습니다."
      );
    },
  });

  const handleCancelConfirm = useCallback(() => {
    const params = callValidation?.params;

    const callDtm = params?.CALL_DTM;
    const vehicleId = params?.VEHICLE_ID;
    const startPointId = params?.START_POINT_ID;
    const rsvNum = params?.RSV_NUM;

    if (!callDtm || !vehicleId || !startPointId || rsvNum == null) {
      Alert.alert(
        "호출 취소 실패",
        "호출 정보가 올바르지 않습니다. 다시 시도해주세요."
      );
      return;
    }

    const parsedRsvNum =
      typeof rsvNum === "string" ? Number(rsvNum) : Number(rsvNum);

    if (!Number.isFinite(parsedRsvNum)) {
      Alert.alert(
        "호출 취소 실패",
        "예약 인원 정보가 올바르지 않습니다. 다시 시도해주세요."
      );
      return;
    }

    const payload: CancelVehicleRequest = {
      CALL_DTM: callDtm,
      DEVICE_ID: deviceId || "SIMULATOR_DEVICE",
      VEHICLE_ID: vehicleId,
      START_POINT_ID: startPointId,
      RSV_NUM: parsedRsvNum,
    };

    console.log("[CallCancellation] 요청 payload", payload);
    setConfirmVisible(false);
    mutate(payload);
  }, [callValidation?.params, deviceId, mutate]);

  const handleCancelButtonPress = useCallback(() => {
    setConfirmVisible(true);
  }, []);

  const handleConfirmClose = useCallback(() => {
    setConfirmVisible(false);
  }, []);

  const handleSuccessClose = useCallback(() => {
    setSuccessVisible(false);
    router.replace("/");
  }, [router]);

  return {
    isCancelPending: isPending,
    isConfirmVisible,
    isSuccessVisible,
    openConfirmModal: handleCancelButtonPress,
    closeConfirmModal: handleConfirmClose,
    confirmCancellation: handleCancelConfirm,
    closeSuccessModal: handleSuccessClose,
  };
}
