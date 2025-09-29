import React from "react";
import { router } from "expo-router";
import { RouteSelector, Route } from "../../components/forms/RouteSelector";
import { useCallStore } from "../../store/call.store";

// 기사앱: 운행 노선 데이터 (필요 시 서버 연동으로 교체)
const BUS_ROUTES: Route[] = [
  {
    id: "bus-1",
    name: "1번 버스",
    description: "시청 - 중앙로 - 터미널",
    duration: "25분",
    stops: ["시청", "중앙로", "터미널"],
    frequency: "10분마다",
    color: "bg-blue-500",
  },
  {
    id: "bus-2",
    name: "2번 버스",
    description: "역사 - 대학로 - 터미널",
    duration: "30분",
    stops: ["역사", "대학로", "터미널"],
    frequency: "15분마다",
    color: "bg-green-500",
  },
  {
    id: "bus-3",
    name: "3번 버스",
    description: "공항 - 시내 - 터미널",
    duration: "35분",
    stops: ["공항", "시내", "터미널"],
    frequency: "20분마다",
    color: "bg-purple-500",
  },
  {
    id: "bus-4",
    name: "4번 버스",
    description: "해변 - 관광지 - 터미널",
    duration: "40분",
    stops: ["해변", "관광지", "터미널"],
    frequency: "30분마다",
    color: "bg-red-500",
  },
];

export default function DriverSelectRouteScreen() {
  const { driverRouteId, startDriverOperation, setBusRoute, busRouteId } =
    useCallStore();

  // 기사앱은 공통 RouteSelector를 그대로 사용하되 mode="bus"
  const selectedRouteId = driverRouteId ?? busRouteId; // 과거 값 호환

  const handleRouteSelect = (route: Route) => {
    // 내부적으로도 busRouteId를 맞춰두면 다른 컴포넌트 재사용이 쉬움
    setBusRoute(route.id);
  };

  const handleNext = () => {
    const routeId = useCallStore.getState().busRouteId;
    if (routeId) {
      startDriverOperation(routeId);
      // 운행 시작 후 홈으로 복귀
      router.replace("/" as any);
    }
  };

  return (
    <RouteSelector
      mode="bus"
      title="운행할 노선을 선택해주세요"
      subtitle="선택한 노선으로 운행을 시작합니다"
      routes={BUS_ROUTES}
      selectedRouteId={selectedRouteId}
      onRouteSelect={handleRouteSelect}
      onNext={handleNext}
      nextButtonText="운행 시작"
      infoCard={{
        title: "ℹ️ 노선 안내",
        content:
          "• 노선은 지역 상황에 따라 변경될 수 있습니다\n• 운행 시작 후에는 노선 변경이 제한될 수 있습니다",
        bgColor: "bg-green-50",
        textColor: "text-green-800",
      }}
    />
  );
}

