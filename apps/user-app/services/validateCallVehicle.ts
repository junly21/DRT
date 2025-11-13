import { apiClient } from "@drt/api-client";

const VALIDATE_CALL_VEHICLE_ENDPOINT = "/validateCallVehicle.do";

export type ValidateCallResult = "SUCCESS" | "FAIL_CAPA" | "FAIL_DISPATCH";

export interface ValidateCallParams {
  DISPATCH_DT: string;
  CALL_DTM: string;
  START_POINT_ID: string;
  END_POINT_ID: string;
  DEVICE_ID: string;
  GPS_X: string;
  GPS_Y: string;
  PAYMENT: "CARD" | "CASH" | "MOBILE";
  RSV_NUM: string;
  SAIL_TM?: string;
  VEHICLE_ID?: string;
  ROUTE_ID?: string;
  DISPATCH_SEQ?: number;
  SCHEDULE_RIDE_DTM?: number;
  SCHEDULE_ALGH_DTM?: number;
  NEWRSV?: number;
  CURREN_RESERVED?: number;
}

export interface ValidateCallSuccessResponse {
  RESULT: "SUCCESS";
  PARAMS: ValidateCallParams;
}

export interface ValidateCallFailureResponse {
  RESULT: "FAIL_CAPA" | "FAIL_DISPATCH";
  MESSAGE: string;
  CAPACITY?: number;
  CURREN_RESERVED?: number;
  NEWRSV?: number;
}

type ValidateCallApiResponse =
  | ValidateCallSuccessResponse
  | ValidateCallFailureResponse;

export async function validateCallVehicle(
  payload: ValidateCallParams
): Promise<ValidateCallApiResponse> {
  console.log("[ValidateCallVehicle] 요청", payload);

  const response = await apiClient.post<ValidateCallApiResponse[]>(
    VALIDATE_CALL_VEHICLE_ENDPOINT,
    payload
  );

  const [result] = response ?? [];

  if (!result) {
    throw new Error("유효성 검사 응답이 올바르지 않습니다.");
  }

  console.log("[ValidateCallVehicle] 응답", result);
  return result;
}
