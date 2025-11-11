import { apiClient } from "@drt/api-client";
import {
  logApiRequest,
  logApiResponse,
  logApiError,
} from "../utils/apiLogger";

const START_OPERATION_ENDPOINT = "/startOper.do";
const REPORT_OPERATION_ENDPOINT = "/reportOper.do";

export interface StartOperationRequest {
  DISPATCH_DT: string;
  VEHICLE_ID: string;
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
  CALL_DTM_MS: number;
  ACCURACY?: number | null;
  ALTITUDE?: number | null;
  ALTITUDE_ACCURACY?: number | null;
  HEADING?: number | null;
  SPEED?: number | null;
}

export async function reportOperation(
  payload: ReportOperationRequest
): Promise<void> {
  logApiRequest(REPORT_OPERATION_ENDPOINT, payload);

  try {
    const response = await apiClient.post(REPORT_OPERATION_ENDPOINT, payload);
    logApiResponse(REPORT_OPERATION_ENDPOINT, response);
  } catch (error) {
    logApiError(REPORT_OPERATION_ENDPOINT, error);
    throw error;
  }
}
