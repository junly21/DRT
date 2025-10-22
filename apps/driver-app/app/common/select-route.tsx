import React from "react";
import { router } from "expo-router";
import { RouteSelector, Route } from "@drt/ui-native";
import { useCallStore } from "@drt/store";
import { BUS_ROUTES } from "@drt/domain";

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
      // 운행 시작 후 운행 중 화면으로 이동
      router.replace("/operating" as any);
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
