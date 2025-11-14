import { apiClient } from "@drt/api-client";

const CALL_VEHICLE_ENDPOINT = "/callVehicle.do";

export type PaymentMethodCode = "CARD" | "CASH" | "MOBILE";

export interface CallVehicleRequest {
  CALL_DTM: string;
  START_POINT_ID: string;
  END_POINT_ID: string;
  DEVICE_ID: string;
  GPS_X: string;
  GPS_Y: string;
  PAYMENT: PaymentMethodCode;
  RSV_NUM: string | number;
  SAIL_TM?: string;
  DISPATCH_DT?: string;
  VEHICLE_ID?: string;
  ROUTE_ID?: string;
  DISPATCH_SEQ?: number;
  SCHEDULE_RIDE_DTM?: number;
  SCHEDULE_ALGH_DTM?: number;
  NEWRSV?: number;
  CURREN_RESERVED?: number;
  CALL_DIV?: "STN" | "FERRY";
}

export interface CallVehicleResponseItem {
  MESSAGE: string;
  CAPACITY: number;
  CURREN_RESERVED: number;
  NEWRSV: number;
  RESULT: "SUCCESS" | "FAIL";
}

export type CallVehicleResponse = CallVehicleResponseItem[];

export async function callVehicle(
  request: CallVehicleRequest
): Promise<CallVehicleResponse> {
  return apiClient.post<CallVehicleResponse>(CALL_VEHICLE_ENDPOINT, request);
}
