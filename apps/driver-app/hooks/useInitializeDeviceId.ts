import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Application from "expo-application";
import { useCallStore } from "@drt/store";

async function getDeviceId(): Promise<string | null> {
  try {
    if (Platform.OS === "android") {
      const androidId = Application.getAndroidId();
      if (androidId) {
        return androidId;
      }
    }

    if (Platform.OS === "ios") {
      const iosId = await Application.getIosIdForVendorAsync();
      if (iosId) {
        return iosId;
      }
    }
  } catch (error) {
    console.error("[Driver][DeviceId] 디바이스 ID 조회 실패", error);
  }

  return null;
}

export function useInitializeDeviceId() {
  const hasRequestedRef = useRef(false);
  const setDeviceId = useCallStore((state) => state.setDeviceId);

  useEffect(() => {
    if (hasRequestedRef.current) {
      return;
    }
    hasRequestedRef.current = true;

    let isMounted = true;

    const initialize = async () => {
      const deviceId = await getDeviceId();

      if (!isMounted) {
        return;
      }

      setDeviceId(deviceId);

      if (deviceId) {
        console.log("[Driver][DeviceId] 디바이스 ID 저장", deviceId);
      } else {
        console.warn("[Driver][DeviceId] 디바이스 ID를 가져오지 못했습니다.");
      }
    };

    void initialize();

    return () => {
      isMounted = false;
    };
  }, [setDeviceId]);
}
