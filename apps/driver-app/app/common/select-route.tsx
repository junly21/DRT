import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useCallStore } from "@drt/store";
import { fetchDriverRoutes, type DriverRoute } from "../../services/routes";
import {
  startOperation,
  type StartOperationRequest,
} from "../../services/operations";
import {
  formatDate,
  formatDispatchDate,
  getDirectionLabel,
} from "../../utils/format";

export default function DriverSelectRouteScreen() {
  const {
    driverRouteId,
    setDriverRouteId,
    startDriverOperation,
    vehicleId,
    setError,
  } = useCallStore();

  const { data, isLoading, isPending, isRefetching, isError, refetch } =
    useQuery({
      queryKey: ["driverRoutes"],
      queryFn: fetchDriverRoutes,
    });

  const routes = useMemo<DriverRoute[]>(() => data ?? [], [data]);

  const startMutation = useMutation({
    mutationFn: (payload: StartOperationRequest) => startOperation(payload),
    onSuccess: (_, variables) => {
      if (!driverRouteId) {
        return;
      }
      setError(null);
      startDriverOperation(driverRouteId);
      router.replace("/operating" as const);
      console.log(
        "[Driver][Operation] 운행 시작",
        variables.VEHICLE_ID,
        driverRouteId
      );
    },
    onError: (error) => {
      console.error("[Driver][Operation] 운행 시작 실패", error);
      const message =
        error instanceof Error
          ? error.message
          : "운행을 시작하지 못했습니다. 다시 시도해주세요.";
      setError(message);
      Alert.alert("운행 시작 실패", message);
    },
  });

  const handleRouteSelect = useCallback(
    (routeId: string) => {
      setDriverRouteId(routeId);
    },
    [setDriverRouteId]
  );

  const handleStartOperation = useCallback(() => {
    if (!driverRouteId) {
      Alert.alert("노선을 선택해주세요.");
      return;
    }

    if (!vehicleId) {
      Alert.alert(
        "차량 정보를 불러오는 중입니다.",
        "잠시 후 다시 시도해주세요."
      );
      return;
    }

    const payload: StartOperationRequest = {
      DISPATCH_DT: formatDispatchDate(new Date()),
      VEHICLE_ID: vehicleId,
    };

    startMutation.mutate(payload);
  }, [driverRouteId, vehicleId, startMutation]);

  const isSubmitDisabled =
    !driverRouteId || !vehicleId || startMutation.isPending;

  const renderRouteCard = (route: DriverRoute) => {
    const isSelected = driverRouteId === route.routeId;
    const borderColor = isSelected ? "#1648C8" : "#DBDBDB";
    const backgroundColor = isSelected ? "#EEF3FF" : "#FFFFFF";

    return (
      <TouchableOpacity
        key={route.routeId}
        activeOpacity={0.9}
        onPress={() => handleRouteSelect(route.routeId)}
        style={{
          backgroundColor,
          borderColor,
          borderWidth: 1.5,
          borderRadius: 16,
          paddingVertical: 24,
          paddingHorizontal: 20,
          marginBottom: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}>
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-lg font-semibold text-gray-900">
            {route.routeName}
          </Text>
          <View
            style={{
              backgroundColor: isSelected ? "#1648C8" : "#E5E7EB",
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 999,
            }}>
            <Text
              style={{
                color: isSelected ? "#FFFFFF" : "#374151",
                fontWeight: "600",
                fontSize: 12,
              }}>
              {getDirectionLabel(route.directionCode)}
            </Text>
          </View>
        </View>

        {route.remark ? (
          <Text className="text-base text-gray-700 mb-4">{route.remark}</Text>
        ) : null}

        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm text-gray-500">운행 구간</Text>
          <Text className="text-sm text-gray-900 font-semibold">
            {route.originStopId} → {route.destinationStopId}
          </Text>
        </View>
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm text-gray-500">운행 기간</Text>
          <Text className="text-sm text-gray-900 font-medium">
            {formatDate(route.startDate)} ~ {formatDate(route.endDate)}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-gray-500">사용 여부</Text>
          <Text
            className={`text-sm font-semibold ${
              route.isActive ? "text-emerald-600" : "text-gray-400"
            }`}>
            {route.isActive ? "운행 중" : "미사용"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <View className="px-5 pt-14 pb-6">
        <Text className="text-xl font-bold text-gray-900 mb-1">
          운행할 노선을 선택해주세요
        </Text>
        <Text className="text-base text-gray-600">
          선택한 노선으로 운행을 시작합니다
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}>
        {isLoading || isPending ? (
          <View className="py-16 items-center justify-center">
            <ActivityIndicator size="large" color="#1648C8" />
            <Text className="mt-4 text-gray-600">
              노선 정보를 불러오는 중...
            </Text>
          </View>
        ) : isError ? (
          <View className="py-16 items-center justify-center">
            <Text className="text-red-500 font-medium mb-4">
              노선 정보를 불러오지 못했습니다.
            </Text>
            <TouchableOpacity
              onPress={() => refetch()}
              style={{
                backgroundColor: "#1648C8",
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 12,
              }}>
              <Text className="text-white font-semibold">다시 시도하기</Text>
            </TouchableOpacity>
          </View>
        ) : routes.length === 0 ? (
          <View className="py-16 items-center justify-center">
            <Text className="text-gray-500 font-medium">
              운행 가능한 노선이 없습니다.
            </Text>
          </View>
        ) : (
          routes.map(renderRouteCard)
        )}

        <View className="bg-green-50 rounded-2xl p-6 mt-6 border border-green-200">
          <Text className="text-green-800 font-semibold text-base mb-3">
            ℹ️ 노선 안내
          </Text>
          <Text className="text-green-800 text-sm leading-6">
            • 노선은 운영 정책에 따라 변경될 수 있습니다{"\n"}• 운행 시작 후에는
            노선 변경이 제한될 수 있습니다
          </Text>
        </View>
      </ScrollView>

      <View className="px-5 pb-8 bg-white border-t border-gray-100">
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={isSubmitDisabled}
          onPress={handleStartOperation}
          style={{
            backgroundColor: isSubmitDisabled ? "#DBDBDB" : "#1648C8",
            borderRadius: 12,
            paddingVertical: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}>
          <Text className="text-center text-white font-semibold text-lg">
            {startMutation.isPending ? "운행 시작 중..." : "운행 시작"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
