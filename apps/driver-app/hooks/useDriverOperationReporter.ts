import { useEffect, useRef } from "react";
import { useCallStore, useLocationStore } from "@drt/store";
import { reportOperation } from "../services/operations";

interface UseDriverOperationReporterOptions {
  enabled?: boolean;
  intervalMs?: number;
}

export function useDriverOperationReporter({
  enabled = true,
  intervalMs = 1000,
}: UseDriverOperationReporterOptions = {}) {
  const vehicleId = useCallStore((state) => state.vehicleId);
  const routeId = useCallStore((state) => state.driverRouteId);
  const driverIsOperating = useCallStore((state) => state.driverIsOperating);
  const setError = useCallStore((state) => state.setError);

  const location = useLocationStore((state) => state.lastKnownLocation);

  const latestLocationRef = useRef(location);
  const isReportingRef = useRef(false);

  useEffect(() => {
    latestLocationRef.current = location;
  }, [location]);

  useEffect(() => {
    if (!enabled || !driverIsOperating) {
      return;
    }

    if (!vehicleId || !routeId) {
      console.warn(
        "[Driver][Operation] 차량 혹은 노선 정보가 없어 위치 보고를 시작하지 않습니다."
      );
      return;
    }

    let isCancelled = false;
    const intervalId = setInterval(async () => {
      if (isCancelled || isReportingRef.current) {
        return;
      }

      const latestLocation = latestLocationRef.current;

      if (!latestLocation) {
        return;
      }

      isReportingRef.current = true;

      const { coords, timestamp } = latestLocation;

      try {
        await reportOperation({
          VEHICLE_ID: vehicleId,
          ROUTE_ID: routeId,
          LAT: coords.latitude,
          LON: coords.longitude,
          CALL_DTM_MS: timestamp,
          ACCURACY: coords.accuracy ?? null,
          ALTITUDE: coords.altitude ?? null,
          ALTITUDE_ACCURACY: coords.altitudeAccuracy ?? null,
          HEADING: coords.heading ?? null,
          SPEED: coords.speed ?? null,
        });
      } catch (error) {
        console.error("[Driver][Operation] 위치 보고 실패", error);
        setError(
          error instanceof Error
            ? error.message
            : "위치 보고 중 오류가 발생했습니다."
        );
      } finally {
        isReportingRef.current = false;
      }
    }, intervalMs);

    return () => {
      isCancelled = true;
      clearInterval(intervalId);
      isReportingRef.current = false;
    };
  }, [enabled, driverIsOperating, vehicleId, routeId, intervalMs, setError]);
}
