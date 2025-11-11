import React, { useCallback, useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { StopSelector } from "@drt/ui-native";
import { useCallStore, useCurrentLocation } from "@drt/store";
import {
  fetchAlightingStops,
  type AlightingStop,
} from "../../../services/stations";

export default function SelectAlightingStopScreen() {
  const { flow } = useLocalSearchParams<{ flow: "bus" | "ferry" }>();
  const { busAlightingStopId, setBusAlightingStop, busBoardingStopId } =
    useCallStore();
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

  const mapToSelectorStop = (stop: AlightingStop) => ({
    id: stop.id,
    name: stop.stn_nm,
    distance: stop.dist_m ?? Number.POSITIVE_INFINITY,
    address: null,
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
      console.log(coords.latitude, coords.longitude);
      console.log("[SelectAlightingStop] API 응답", data);
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

  const handleStopSelect = (stopId: string) => {
    setBusAlightingStop(stopId);
  };

  const handleNext = () => {
    if (busAlightingStopId) {
      router.push("/(flows)/common/result");
    }
  };

  return (
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
          "선택한 노선이 지나는 정류장 중에서 하차할 정류장을 선택해주세요.",
      }}
    />
  );
}
