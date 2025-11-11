import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as ExpoLocation from "expo-location";
import { useLocationStore, type LocationPermissionStatus } from "@drt/store";

function mapPermissionStatus(
  status: ExpoLocation.PermissionStatus,
  canAskAgain: boolean
): LocationPermissionStatus {
  switch (status) {
    case ExpoLocation.PermissionStatus.GRANTED:
      return "granted";
    case ExpoLocation.PermissionStatus.DENIED:
      return canAskAgain ? "denied" : "restricted";
    default:
      return "unknown";
  }
}

export function useInitializeDriverLocation() {
  const hasRequestedRef = useRef(false);

  const setPermissionStatus = useLocationStore(
    (state) => state.setPermissionStatus
  );
  const updateLocation = useLocationStore((state) => state.updateLocation);
  const setError = useLocationStore((state) => state.setError);

  useEffect(() => {
    if (hasRequestedRef.current) {
      return;
    }
    hasRequestedRef.current = true;

    let isMounted = true;

    const requestLocation = async () => {
      try {
        const permissionResponse =
          await ExpoLocation.requestForegroundPermissionsAsync();

        if (!isMounted) {
          return;
        }

        const permissionStatus = mapPermissionStatus(
          permissionResponse.status,
          permissionResponse.canAskAgain
        );

        setPermissionStatus(permissionStatus);

        if (
          permissionResponse.status !== ExpoLocation.PermissionStatus.GRANTED
        ) {
          setError("위치 권한이 허용되지 않았습니다.");
          return;
        }

        const currentPosition = await ExpoLocation.getCurrentPositionAsync({
          accuracy: ExpoLocation.Accuracy.Highest,
        });

        if (!isMounted) {
          return;
        }

        updateLocation({
          coords: {
            latitude: currentPosition.coords.latitude,
            longitude: currentPosition.coords.longitude,
            accuracy: currentPosition.coords.accuracy ?? null,
            altitude: currentPosition.coords.altitude ?? null,
            altitudeAccuracy: currentPosition.coords.altitudeAccuracy ?? null,
            heading: currentPosition.coords.heading ?? null,
            speed: currentPosition.coords.speed ?? null,
          },
          timestamp: currentPosition.timestamp,
          source: Platform.OS === "web" ? "manual" : "gps",
        });

        setError(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "위치 정보를 가져오는 중 오류가 발생했습니다.";

        setError(message);
        console.error("[Driver][Location] 위치 초기화 실패", error);
      }
    };

    void requestLocation();

    return () => {
      isMounted = false;
    };
  }, [setPermissionStatus, setError, updateLocation]);
}
