import { useEffect } from "react";
import * as ExpoLocation from "expo-location";
import { useLocationStore } from "@drt/store";

interface UseDriverLocationWatcherOptions {
  enabled?: boolean;
  distanceInterval?: number;
  timeInterval?: number;
}

/**
 * 운행 중 위치를 주기적으로 업데이트합니다.
 * `enabled`가 true일 때만 watch를 시작하며, 컴포넌트 언마운트시 자동 해제됩니다.
 */
export function useDriverLocationWatcher({
  enabled = true,
  distanceInterval = 0,
  timeInterval = 1000,
}: UseDriverLocationWatcherOptions = {}) {
  const updateLocation = useLocationStore((state) => state.updateLocation);
  const setError = useLocationStore((state) => state.setError);
  const startWatching = useLocationStore((state) => state.startWatching);
  const stopWatching = useLocationStore((state) => state.stopWatching);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let subscription: ExpoLocation.LocationSubscription | null = null;
    let cancelled = false;

    const startWatchAsync = async () => {
      try {
        startWatching();
        subscription = await ExpoLocation.watchPositionAsync(
          {
            accuracy: ExpoLocation.Accuracy.Highest,
            distanceInterval,
            timeInterval,
          },
          (position) => {
            if (cancelled) {
              return;
            }
            updateLocation({
              coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy ?? null,
                altitude: position.coords.altitude ?? null,
                altitudeAccuracy: position.coords.altitudeAccuracy ?? null,
                heading: position.coords.heading ?? null,
                speed: position.coords.speed ?? null,
              },
              timestamp: position.timestamp,
            });
          }
        );
        setError(null);
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : "위치 정보를 업데이트하는 중 오류가 발생했습니다.";
          setError(message);
          console.error("[Driver][Location] 위치 업데이트 실패", error);
        }
      }
    };

    void startWatchAsync();

    return () => {
      cancelled = true;
      stopWatching();
      if (subscription) {
        subscription.remove();
      }
    };
  }, [
    enabled,
    distanceInterval,
    timeInterval,
    updateLocation,
    startWatching,
    stopWatching,
    setError,
  ]);
}
