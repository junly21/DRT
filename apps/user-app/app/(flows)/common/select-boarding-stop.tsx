import React, { useCallback, useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { StopSelector } from "@drt/ui-native";
import type { StopPickerItem } from "@drt/ui-native/StopPicker";
import { useCallStore, useCurrentLocation } from "@drt/store";
import { useInitializeCurrentLocation } from "../../../hooks/useInitializeCurrentLocation";
import { useCallValidationModal } from "../../../hooks/useCallValidationModal";
import {
  fetchNearbyStops,
  fetchFerryBoardingStops,
  type NearbyStop,
  type FerryBoardingStop,
} from "../../../services/stations";
import { buildValidateCallPayload } from "../../../utils/callPayload";
import { CallValidationModalWrapper } from "./components/CallValidationModalWrapper";
import { NoStopsModal } from "./components/NoStopsModal";
import { FERRY_DEST_STOP } from "../../../constants/ferry";

export default function SelectBoardingStopScreen() {
  const { flow } = useLocalSearchParams<{ flow: "bus" | "ferry" }>();
  const {
    busBoardingStopId,
    setBusBoardingStop,
    ferryBoardingStopId,
    setFerryBoardingStop,
    busAlightingStopId,
    passengerCount,
    payment,
    deviceId,
    ferrySelectedSchedule,
  } = useCallStore();

  useInitializeCurrentLocation();
  const currentLocation = useCurrentLocation();
  const coords = currentLocation?.coords;

  const [nearbyStops, setNearbyStops] = useState<
    (NearbyStop | FerryBoardingStop)[]
  >([]);
  const [isFetchingStops, setIsFetchingStops] = useState(false);
  const [hasFetchedStops, setHasFetchedStops] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [noStopsModalVisible, setNoStopsModalVisible] = useState(false);
  const [noStopsMessage, setNoStopsMessage] = useState<string>("");
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

  const loadNearbyStops = useCallback(async () => {
    if (!coords) {
      return;
    }

    setError(null);
    setIsFetchingStops(true);
    try {
      if (flow === "ferry") {
        // Ferry flow: 새로운 API 사용
        const stops = await fetchFerryBoardingStops({
          latitude: coords.latitude,
          longitude: coords.longitude,
          endPointId: FERRY_DEST_STOP.id,
        });
        setNearbyStops(stops);
      } else {
        // Bus flow: 기존 API 사용
        const stops = await fetchNearbyStops({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        setNearbyStops(stops);
      }
    } catch (err) {
      // Ferry 모드에서 승차 가능한 정류장이 없을 때만 모달 표시
      if (flow === "ferry" && err instanceof Error) {
        setNoStopsMessage(err.message);
        setNoStopsModalVisible(true);
      } else {
        // Bus 모드는 기존 에러 처리 방식 유지
        setError(
          err instanceof Error
            ? err
            : new Error("정류장 정보를 불러오지 못했습니다.")
        );
      }
    } finally {
      setIsFetchingStops(false);
      setHasFetchedStops(true);
    }
  }, [coords, flow]);

  useEffect(() => {
    if (!coords) {
      return;
    }

    if (hasFetchedStops || isFetchingStops) {
      return;
    }

    loadNearbyStops();
  }, [coords, hasFetchedStops, isFetchingStops, loadNearbyStops]);

  // flow에 따라 다른 상태와 핸들러 사용
  const selectedStopId =
    flow === "ferry" ? ferryBoardingStopId : busBoardingStopId;
  const setStop = flow === "ferry" ? setFerryBoardingStop : setBusBoardingStop;

  const handleStopSelect = (stop: StopPickerItem) => {
    const matched = nearbyStops.find((item) => item.id === stop.id);
    setStop({ id: stop.id, name: matched?.name ?? stop.name });
  };

  const handleNext = () => {
    if (selectedStopId) {
      if (flow === "ferry") {
        handleFerryValidation();
      } else {
        // Bus flow: 승차 정류장 선택 후 하차 정류장 선택 (flow 파라미터 전달)
        router.push(
          `/(flows)/common/select-alighting-stop?flow=${flow}` as any
        );
      }
    }
  };

  const handleFerryValidation = async () => {
    if (!ferryBoardingStopId || !busAlightingStopId) {
      console.warn("[SelectBoardingStop] 정류장 정보가 충분하지 않습니다.");
      return;
    }

    if (!coords) {
      console.warn("[SelectBoardingStop] 위치 정보를 가져오는 중입니다.");
      return;
    }

    try {
      const payload = buildValidateCallPayload({
        startPointId: ferryBoardingStopId,
        endPointId: busAlightingStopId,
        deviceId,
        latitude: coords.latitude,
        longitude: coords.longitude,
        paymentMethod: payment?.method,
        passengerCount,
        sailTime: ferrySelectedSchedule?.sailTime,
        callDiv: "FERRY",
      });

      await validate(payload);
    } catch (err) {
      console.error("[SelectBoardingStop] 검증 처리 중 오류", err);
    }
  };

  return (
    <>
      <StopSelector
        mode={flow || "bus"}
        stops={nearbyStops}
        isLoading={!hasFetchedStops && (!coords || isFetchingStops)}
        isFetching={hasFetchedStops && isFetchingStops}
        error={error}
        onRetry={() => {
          void loadNearbyStops();
        }}
        title="승차 정류장을 선택해주세요"
        subtitle={
          flow === "ferry"
            ? "여객선 승선지로 가는 버스를 탑승할 정류장을 선택하세요"
            : "버스에 탑승할 정류장을 선택하세요"
        }
        selectedStopId={selectedStopId}
        onStopSelect={handleStopSelect}
        onNext={handleNext}
        nextButtonText={flow === "ferry" ? "버스 호출" : "다음 단계"}
        sortBy="distance"
        selectedStopLabel="선택된 승차 정류장"
        emptyStateText="승차 정류장을 선택해주세요"
        infoCard={
          flow === "ferry"
            ? {
                title: "이용안내",
                content: "하차 정류장은 여객선 터미널로 자동 설정됩니다.",
              }
            : undefined
        }
      />
      <CallValidationModalWrapper
        visible={modalVisible}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
      />

      <NoStopsModal
        visible={noStopsModalVisible}
        message={noStopsMessage}
        onConfirm={() => {
          setNoStopsModalVisible(false);
          router.replace("/");
        }}
      />
    </>
  );
}
