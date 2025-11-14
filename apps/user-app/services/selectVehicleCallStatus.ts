import { apiClient } from "@drt/api-client";

const SELECT_VEHICLE_CALL_STATUS_ENDPOINT = "/selectVehicleCallStatus.do";

export type ReservationStatus = "WAIT" | "DONE" | "CANCEL";

export interface VehicleCallStatusItem {
  dispatch_seq: number;
  route_id: string | null;
  schedule_algh_dtm: number | null;
  device_id: string;
  call_dtm: number;
  rsv_status: ReservationStatus;
  route_nm: string | null;
  vehicle_no: string | null;
  end_point_nm: string | null;
  rsv_num: number;
  end_point_id: string;
  start_point_nm: string | null;
  schedule_ride_dtm: number | null;
  payment: "CARD" | "CASH" | "MOBILE";
  start_point_id: string;
  vehicle_id: string | null;
  call_div?: "STN" | "FERRY";
  CALL_DIV?: "STN" | "FERRY";
}

export type VehicleCallStatusResponse = VehicleCallStatusItem[];

export async function fetchVehicleCallStatus(
  deviceId: string
): Promise<VehicleCallStatusResponse> {
  console.log("[VehicleCallStatus] 요청", { DEVICE_ID: deviceId });

  const response = await apiClient.post<VehicleCallStatusResponse>(
    SELECT_VEHICLE_CALL_STATUS_ENDPOINT,
    {
      DEVICE_ID: deviceId,
    }
  );

  console.log("[VehicleCallStatus] 응답", response);
  return response ?? [];
}
