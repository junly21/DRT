import { apiClient } from "@drt/api-client";

const CANCEL_VEHICLE_ENDPOINT = "/callVehicleCancel.do";

export interface CancelVehicleRequest {
  CALL_DTM: string;
  DEVICE_ID: string;
  VEHICLE_ID: string;
  START_POINT_ID: string;
  RSV_NUM: number;
}

export interface CancelVehicleResponse {
  status: string;
}

export async function cancelVehicleCall(
  payload: CancelVehicleRequest
): Promise<CancelVehicleResponse> {
  console.log("[CancelVehicle] 요청", payload);
  const response = await apiClient.post<CancelVehicleResponse>(
    CANCEL_VEHICLE_ENDPOINT,
    payload
  );
  console.log("[CancelVehicle] 응답", response);
  return response;
}
