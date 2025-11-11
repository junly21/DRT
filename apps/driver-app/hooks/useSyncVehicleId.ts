import { useEffect, useRef, useState } from "react";
import { useCallStore } from "@drt/store";
import { fetchVehicleIdByDevice } from "../services/vehicle";

export function useSyncVehicleId() {
  const deviceId = useCallStore((state) => state.deviceId);
  const vehicleId = useCallStore((state) => state.vehicleId);
  const setVehicleId = useCallStore((state) => state.setVehicleId);
  const setError = useCallStore((state) => state.setError);

  const [isLoading, setIsLoading] = useState(false);
  const lastFetchedDeviceIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!deviceId) {
      if (vehicleId !== null) {
        setVehicleId(null);
      }
      lastFetchedDeviceIdRef.current = null;
      return;
    }

    if (lastFetchedDeviceIdRef.current === deviceId) {
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const fetchVehicleId = async () => {
      try {
        const fetchedVehicleId = await fetchVehicleIdByDevice(deviceId);

        if (!isMounted) {
          return;
        }

        setVehicleId(fetchedVehicleId);
        setError(null);
        lastFetchedDeviceIdRef.current = deviceId;

        if (fetchedVehicleId) {
          console.log(
            "[Driver][Vehicle] 차량 ID 동기화 완료",
            fetchedVehicleId
          );
        } else {
          console.warn(
            "[Driver][Vehicle] 차량 ID를 조회하지 못했습니다.",
            deviceId
          );
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("[Driver][Vehicle] 차량 ID 조회 실패", error);
        setError(
          error instanceof Error
            ? error.message
            : "차량 정보를 불러오지 못했습니다."
        );
        lastFetchedDeviceIdRef.current = null;
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchVehicleId();

    return () => {
      isMounted = false;
    };
  }, [deviceId, vehicleId, setVehicleId, setError]);

  return {
    deviceId,
    vehicleId,
    isLoading,
  };
}

