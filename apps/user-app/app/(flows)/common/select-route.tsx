import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { RouteSelector, Route } from "@drt/ui-native";
import { useCallStore } from "@drt/store";
import { BUS_ROUTES, FERRY_BUS_ROUTES } from "@drt/domain";

export default function SelectRouteScreen() {
  const { flow } = useLocalSearchParams<{ flow: "bus" | "ferry" }>();
  const { busRouteId, setBusRoute, ferryRouteId, setFerryRoute } =
    useCallStore();

  // flow에 따라 다른 상태와 핸들러 사용
  const selectedRouteId = flow === "ferry" ? ferryRouteId : busRouteId;
  const setRoute = flow === "ferry" ? setFerryRoute : setBusRoute;
  const routes = flow === "ferry" ? FERRY_BUS_ROUTES : BUS_ROUTES;

  const handleRouteSelect = (route: Route) => {
    setRoute(route.id);
  };

  const handleNext = () => {
    if (selectedRouteId) {
      // 모든 flow에서 승차 정류장 선택으로 이동 (flow 파라미터 전달)
      router.push(`/(flows)/common/select-boarding-stop?flow=${flow}` as any);
    }
  };

  // flow에 따른 UI 텍스트 설정
  const getUIText = () => {
    if (flow === "ferry") {
      return {
        title: "버스 노선을 선택해주세요",
        subtitle: "선택하신 여객선 시간에 맞는 버스 노선을 선택하세요",
        nextButtonText: "다음 단계",
        infoCard: {
          title: "ℹ️ 노선 안내",
          content:
            "• 모든 노선은 녹동여객터미널에서 하차합니다\n• 교통 상황에 따라 운행 시간이 지연될 수 있습니다\n• 여객선 출발 30분 전까지 터미널 도착을 권장합니다",
          bgColor: "bg-green-50",
          textColor: "text-green-800",
        },
      };
    } else {
      return {
        title: "노선을 선택해주세요",
        subtitle: "선택한 정류장을 지나는 버스 노선입니다",
        nextButtonText: "다음 단계",
        infoCard: {
          title: "ℹ️ 노선 안내",
          content:
            "• 다음 단계에서 하차할 정류장을 선택할 수 있습니다\n• 교통 상황에 따라 운행 시간이 지연될 수 있습니다\n• 출발 5분 전까지 정류장에서 대기해주세요",
          bgColor: "bg-green-50",
          textColor: "text-green-800",
        },
      };
    }
  };

  const uiText = getUIText();

  return (
    <RouteSelector
      mode="bus"
      title={uiText.title}
      subtitle={uiText.subtitle}
      routes={routes}
      selectedRouteId={selectedRouteId}
      onRouteSelect={handleRouteSelect}
      onNext={handleNext}
      nextButtonText={uiText.nextButtonText}
      infoCard={uiText.infoCard}
    />
  );
}
