import React, { useCallback, useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { StopSelector } from "@drt/ui-native";
import type { StopPickerItem } from "@drt/ui-native/StopPicker";
import { useCallStore, useCurrentLocation } from "@drt/store";
import {
  fetchAlightingStops,
  type AlightingStop,
} from "../../../services/stations";
import { buildValidateCallPayload } from "../../../utils/callPayload";
import { useCallValidationModal } from "../../../hooks/useCallValidationModal";
import { CallValidationModalWrapper } from "./components/CallValidationModalWrapper";

export default function SelectAlightingStopScreen() {
  const { flow } = useLocalSearchParams<{ flow: "bus" | "ferry" }>();
  const {
    busAlightingStopId,
    setBusAlightingStop,
    busBoardingStopId,
    passengerCount,
    payment,
    deviceId,
    ferrySelectedSchedule,
  } = useCallStore();
  const currentLocation = useCurrentLocation();
  const coords = currentLocation?.coords;

  const [stops, setStops] = useState<
    Array<{
      id: string;
      name: string;
      distance: number;
      address?: string | null;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const {
    isValidating,
    modalVisible,
    validate,
    handleModalClose,
    handleModalConfirm,
  } = useCallValidationModal({
    onSuccess: () => router.push("/(flows)/common/result"),
    onFailure: () => router.replace("/"),
  });

  const mapToSelectorStop = (stop: AlightingStop) => ({
    id: stop.stn_id ?? stop.stn_no ?? stop.stn_nm,
    name: stop.stn_nm,
    distance: stop.dist_m ?? Number.POSITIVE_INFINITY,
    address: null,
    direction: stop.direction || "방향정보없음",
  });

  const loadAlightingStops = useCallback(async () => {
    if (!coords) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchAlightingStops({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      setStops(data.map(mapToSelectorStop));
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("하차 정류장 정보를 불러오지 못했습니다.")
      );
    } finally {
      setIsLoading(false);
    }
  }, [coords]);

  useEffect(() => {
    void loadAlightingStops();
  }, [loadAlightingStops]);

  // Ferry flow는 하차 정류장 선택이 없으므로 Bus flow만 처리
  if (flow === "ferry") {
    router.replace("/(flows)/common/result");
    return null;
  }

  const handleStopSelect = (stop: StopPickerItem) => {
    setBusAlightingStop({ id: stop.id, name: stop.name });
  };

  const handleNext = () => {
    if (busAlightingStopId) {
      handleValidation();
    }
  };

  const handleValidation = async () => {
    if (!busBoardingStopId || !busAlightingStopId) {
      console.warn("[SelectAlightingStop] 정류장 정보가 부족합니다.");
      return;
    }

    if (!coords) {
      console.warn("[SelectAlightingStop] 위치 정보를 가져오는 중입니다.");
      return;
    }

    try {
      const payload = buildValidateCallPayload({
        startPointId: busBoardingStopId,
        endPointId: busAlightingStopId,
        deviceId,
        latitude: coords.latitude,
        longitude: coords.longitude,
        paymentMethod: payment?.method,
        passengerCount,
        sailTime: ferrySelectedSchedule?.sailTime,
        callDiv: "STN",
      });

      await validate(payload);
    } catch (err) {
      console.error("[SelectAlightingStop] 검증 처리 중 오류", err);
    }
  };

  return (
    <>
      <StopSelector
        mode="bus"
        title="하차 정류장을 선택해주세요"
        subtitle="버스에서 내릴 정류장을 선택하세요"
        stops={stops}
        isLoading={isLoading || !coords}
        isFetching={false}
        error={error}
        onRetry={() => {
          void loadAlightingStops();
        }}
        selectedStopId={busAlightingStopId}
        onStopSelect={handleStopSelect}
        onNext={handleNext}
        nextButtonText="버스 호출"
        excludeStopId={busBoardingStopId}
        sortBy="name"
        selectedStopLabel="선택된 하차 정류장"
        emptyStateText="하차 정류장을 선택해주세요"
        infoCard={{
          title: "💡 하차 안내",
          content:
            "승차 정류장이 지나는 노선 중에서 하차할 정류장을 선택해주세요.",
        }}
      />
      <CallValidationModalWrapper
        visible={modalVisible}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
      />
    </>
  );
}
