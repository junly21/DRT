import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { StopSelector } from "@drt/ui-native";
import { useCallStore } from "@drt/store";

export default function SelectAlightingStopScreen() {
  const { flow } = useLocalSearchParams<{ flow: "bus" | "ferry" }>();
  const { busAlightingStopId, setBusAlightingStop, busBoardingStopId } =
    useCallStore();

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
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-800",
      }}
    />
  );
}
