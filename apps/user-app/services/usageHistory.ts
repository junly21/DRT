import { apiClient } from "@drt/api-client";

const USAGE_HISTORY_ENDPOINT = "/selectVehicleCallLogList.do";

export interface VehicleCallLogApiItem {
  dispatch_seq: number;
  route_id: string;
  gps_x: number;
  rsv_num: number;
  device_id: string;
  gps_y: number;
  call_dtm: string; // "2025-11-14 10:29:59"
  end_point_id: string;
  payment: "CARD" | "CASH" | "MOBILE";
  start_point_id: string;
  dispatch_dt: number;
}

export type VehicleCallLogResponse = VehicleCallLogApiItem[];

export async function fetchUsageHistory(
  deviceId: string
): Promise<VehicleCallLogResponse> {
  const payload = { DEVICE_ID: deviceId };
  console.log("[UsageHistory] API 요청", {
    endpoint: USAGE_HISTORY_ENDPOINT,
    payload,
  });

  const response = await apiClient.post<VehicleCallLogResponse>(
    USAGE_HISTORY_ENDPOINT,
    payload
  );

  console.log("[UsageHistory] API 응답", response);
  return response;
}

