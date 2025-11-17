import { apiClient } from "@drt/api-client";
import { logApiRequest, logApiResponse, logApiError } from "../utils/apiLogger";

const START_OPERATION_ENDPOINT = "/startOper.do";
const REPORT_OPERATION_ENDPOINT = "/reportOper.do";

export interface StartOperationRequest {
  DISPATCH_DT: string;
  VEHICLE_ID: string;
  ROUTE_ID?: string;
}

export interface StartOperationResponse {
  status: string;
  [key: string]: unknown;
}

export async function startOperation(
  payload: StartOperationRequest
): Promise<StartOperationResponse> {
  logApiRequest(START_OPERATION_ENDPOINT, payload);

  try {
    const response = await apiClient.post<StartOperationResponse>(
      START_OPERATION_ENDPOINT,
      payload
    );

    logApiResponse(START_OPERATION_ENDPOINT, response);
    return response;
  } catch (error) {
    logApiError(START_OPERATION_ENDPOINT, error);
    throw error;
  }
}

export interface ReportOperationRequest {
  VEHICLE_ID: string;
  ROUTE_ID: string;
  LAT: number;
  LON: number;
  CALL_DTM_MS?: number;
  DISPATCH_DT: string;
  ACCURACY?: number | null;
  ALTITUDE?: number | null;
  ALTITUDE_ACCURACY?: number | null;
  HEADING?: number | null;
  SPEED?: number | null;
}

export interface ReportOperationStopInfo {
  dispatch_seq?: number;
  dist_m?: number;
  gps_x?: number;
  gps_y?: number;
  rsv_num?: number;
  stn_id: string;
  stn_nm: string;
  vehicle_id?: string;
}

export interface ReportOperationResponse {
  ACCURACY?: number;
  ALTITUDE?: number;
  ALTITUDE_ACCURACY?: number;
  ARRIVAL_EVENT: boolean;
  CALL_DTM_MS: number;
  HEADING?: number;
  LAT: number;
  LON: number;
  NEAR_DIST?: number;
  NEAR_STOP?: ReportOperationStopInfo | null;
  NEXT_STOP?: ReportOperationStopInfo | null;
  ROUTE_ID: string;
  SPEED?: number;
  VEHICLE_ID: string;
}

export async function reportOperation(
  payload: ReportOperationRequest
): Promise<ReportOperationResponse> {
  logApiRequest(REPORT_OPERATION_ENDPOINT, payload);

  try {
    const response = await apiClient.post<ReportOperationResponse>(
      REPORT_OPERATION_ENDPOINT,
      payload
    );
    logApiResponse(REPORT_OPERATION_ENDPOINT, response);
    return response;
  } catch (error) {
    logApiError(REPORT_OPERATION_ENDPOINT, error);
    throw error;
  }
}

export interface EndOperationRequest {
  VEHICLE_ID: string;
}

export interface EndOperationResponse {
  status: string;
  [key: string]: unknown;
}

const END_OPERATION_ENDPOINT = "/endOper.do";

export async function endOperation(
  payload: EndOperationRequest
): Promise<EndOperationResponse> {
  logApiRequest(END_OPERATION_ENDPOINT, payload);

  try {
    const response = await apiClient.post<EndOperationResponse>(
      END_OPERATION_ENDPOINT,
      payload
    );
    logApiResponse(END_OPERATION_ENDPOINT, response);
    return response;
  } catch (error) {
    logApiError(END_OPERATION_ENDPOINT, error);
    throw error;
  }
}
