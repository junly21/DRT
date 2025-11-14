import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { useCallStore } from "@drt/store";
import type { CallStore } from "@drt/store";
import {
  fetchFerrySchedules,
  type FerrySchedule,
} from "../../services/ferrySchedule";

const DEFAULT_DEST_STOP = {
  id: "ST00000006",
  name: "테스트상행정류장4",
};

function formatSailTime(time: string) {
  const padded = time.padStart(4, "0");
  const hours = padded.slice(0, 2);
  const minutes = padded.slice(2, 4);
  return `${hours}:${minutes}`;
}

export default function FerryScheduleScreen() {
  const [schedules, setSchedules] = useState<FerrySchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { setFerrySelectedSchedule, setDestStop, setBusAlightingStop } =
    useCallStore(
    (state: CallStore) => ({
      setFerrySelectedSchedule: state.setFerrySelectedSchedule,
      setDestStop: state.setDestStop,
      setBusAlightingStop: state.setBusAlightingStop,
    })
  );

  useEffect(() => {
    const loadSchedules = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchFerrySchedules();
        setSchedules(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("운항 정보를 불러오지 못했습니다.")
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSchedules();
  }, []);

  const groupedSchedules = useMemo(
    () =>
      schedules.reduce<Record<string, FerrySchedule[]>>((acc, schedule) => {
        if (!acc[schedule.vesselName]) {
          acc[schedule.vesselName] = [];
        }
        acc[schedule.vesselName].push(schedule);
        return acc;
      }, {}),
    [schedules]
  );

  const handleScheduleSelect = (schedule: FerrySchedule) => {
    setFerrySelectedSchedule(schedule);
    setDestStop(DEFAULT_DEST_STOP);
    setBusAlightingStop(DEFAULT_DEST_STOP);
    router.push("/(flows)/common/select-boarding-stop?flow=ferry");
  };

  return (
    <View className="flex-1 bg-drt-background">
      <StatusBar barStyle="dark-content" backgroundColor="#ececec" />

      <ScrollView
        className="flex-1 px-6 mt-6"
        showsVerticalScrollIndicator={false}>
        <View className="w-full items-center mt-4 mb-8">
          <Text className="text-drt-text text-base font-medium text-center opacity-50">
            원하는 운항 시간을 선택해주세요.
          </Text>
        </View>

        {isLoading && (
          <View className="w-full items-center justify-center py-16">
            <Text className="text-drt-text text-base font-medium opacity-50">
              운항 정보를 불러오는 중입니다...
            </Text>
          </View>
        )}

        {error && (
          <View className="w-full items-center justify-center py-16">
            <Text className="text-red-500 text-base font-medium text-center">
              운항 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
            </Text>
          </View>
        )}

        {!isLoading && !error && schedules.length === 0 && (
          <View className="w-full items-center justify-center py-16">
            <Text className="text-drt-text text-base font-medium opacity-50">
              표시할 운항 정보가 없습니다.
            </Text>
          </View>
        )}

        <View className="space-y-4">
          {schedules.map((schedule) => (
              <TouchableOpacity
              key={`${schedule.vesselName}-${schedule.sailTime}`}
              className="w-full rounded-2xl p-5 bg-white mb-4"
                onPress={() => handleScheduleSelect(schedule)}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 3, height: 3 },
                  shadowOpacity: 0.16,
                  shadowRadius: 3,
                  elevation: 3,
                borderLeftWidth: 6,
                borderLeftColor: "#2ED2A3",
              }}>
              <View className="flex-row items-center justify-between mb-8">
                <View>
                    <Text className="text-3xl font-bold text-drt-text">
                    {formatSailTime(schedule.sailTime)}
                    </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    {schedule.routeName}
                      </Text>
                    </View>
                <View className="items-end">
                  <Text className="text-sm font-medium text-gray-600">
                    정원 {schedule.passengerCapacity.toLocaleString()}명
                      </Text>
                </View>
        </View>
              <View className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 mt-4">
                <Text className="text-blue-700 text-sm font-medium">
                  {schedule.vesselName}
                </Text>
            </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
