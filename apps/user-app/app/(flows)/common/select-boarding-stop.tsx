import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { StopSelector } from "@drt/ui-native";
import { useCallStore } from "@drt/store";

export default function SelectBoardingStopScreen() {
  const { flow } = useLocalSearchParams<{ flow: "bus" | "ferry" }>();
  const {
    busBoardingStopId,
    setBusBoardingStop,
    ferryBoardingStopId,
    setFerryBoardingStop,
  } = useCallStore();

  // flow에 따라 다른 상태와 핸들러 사용
  const selectedStopId =
    flow === "ferry" ? ferryBoardingStopId : busBoardingStopId;
  const setStop = flow === "ferry" ? setFerryBoardingStop : setBusBoardingStop;

  const handleStopSelect = (stopId: string) => {
    setStop(stopId);
  };

  const handleNext = () => {
    if (selectedStopId) {
      if (flow === "ferry") {
        // Ferry flow: 승차 정류장 선택 후 바로 결과 화면
        router.push("/(flows)/common/result");
      } else {
        // Bus flow: 승차 정류장 선택 후 하차 정류장 선택 (flow 파라미터 전달)
        router.push(
          `/(flows)/common/select-alighting-stop?flow=${flow}` as any
        );
      }
    }
  };

  return (
    <StopSelector
      mode={flow || "bus"}
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
  );
}
