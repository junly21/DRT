import { useEffect, useRef } from "react";
import {
  useCallStore,
  useLocationStore,
  type CallStore,
  type LocationStore,
} from "@drt/store";
import { reportOperation } from "../services/operations";
import { formatDispatchDate } from "../utils/format";

interface UseDriverOperationReporterOptions {
  enabled?: boolean;
  intervalMs?: number;
}

export function useDriverOperationReporter({
  enabled = true,
  intervalMs = 1000,
}: UseDriverOperationReporterOptions = {}) {
  const vehicleId = useCallStore((state: CallStore) => state.vehicleId);
  const routeId = useCallStore((state: CallStore) => state.driverRouteId);
  const driverIsOperating = useCallStore(
    (state: CallStore) => state.driverIsOperating
  );
  const setError = useCallStore((state: CallStore) => state.setError);
  const setDriverStopInfo = useCallStore(
    (state: CallStore) => state.setDriverStopInfo
  );

  const location = useLocationStore(
    (state: LocationStore) => state.lastKnownLocation
  );

  const latestLocationRef = useRef(location);
  const isReportingRef = useRef(false);

  useEffect(() => {
    latestLocationRef.current = location;
  }, [location]);

  useEffect(() => {
    if (!enabled || !driverIsOperating) {
      setDriverStopInfo(null);
      return;
    }

    if (!vehicleId || !routeId) {
      console.warn(
        "[Driver][Operation] 차량 혹은 노선 정보가 없어 위치 보고를 시작하지 않습니다."
      );
      setDriverStopInfo(null);
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
        const dispatchDate = formatDispatchDate(new Date(timestamp));

        const response = await reportOperation({
          VEHICLE_ID: vehicleId,
          ROUTE_ID: routeId,
          LAT: coords.latitude,
          LON: coords.longitude,
          // CALL_DTM_MS: timestamp,
          DISPATCH_DT: dispatchDate,
          ACCURACY: coords.accuracy ?? null,
          ALTITUDE: coords.altitude ?? null,
          ALTITUDE_ACCURACY: coords.altitudeAccuracy ?? null,
          HEADING: coords.heading ?? null,
          SPEED: coords.speed ?? null,
        });

        const stop = response.ARRIVAL_EVENT
          ? response.NEXT_STOP
          : response.NEAR_STOP;

        const passengerCount =
          stop && typeof stop.rsv_num === "number" ? stop.rsv_num : null;

        setDriverStopInfo({
          stopName: stop?.stn_nm ?? null,
          passengerCount,
          isArrivalEvent: response.ARRIVAL_EVENT,
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
  }, [
    enabled,
    driverIsOperating,
    vehicleId,
    routeId,
    intervalMs,
    setError,
    setDriverStopInfo,
  ]);
}
