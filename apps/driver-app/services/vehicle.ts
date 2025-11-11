import { apiClient } from "@drt/api-client";
import {
  logApiRequest,
  logApiResponse,
  logApiError,
} from "../utils/apiLogger";

interface SelectDetailCodeRequest {
  COMMON_CODE: string;
  VALUE_1: string;
}

interface SelectDetailCodeResponseItem {
  label: string;
  detail_code: string;
  value: string;
  common_code: string;
}

type SelectDetailCodeResponse = SelectDetailCodeResponseItem[];

const SELECT_DETAIL_CODE_ENDPOINT = "/selectDetailCode.do";

export async function fetchVehicleIdByDevice(
  deviceId: string
): Promise<string | null> {
  const payload: SelectDetailCodeRequest = {
    COMMON_CODE: "DRIVE_ID",
    VALUE_1: deviceId,
  };

  logApiRequest(SELECT_DETAIL_CODE_ENDPOINT, payload);

  try {
    const response = await apiClient.post<SelectDetailCodeResponse>(
      SELECT_DETAIL_CODE_ENDPOINT,
      payload
    );
    logApiResponse(SELECT_DETAIL_CODE_ENDPOINT, response);

    if (!Array.isArray(response) || response.length === 0) {
      return null;
    }

    const [first] = response;
    return first?.value ?? null;
  } catch (error) {
    logApiError(SELECT_DETAIL_CODE_ENDPOINT, error);
    throw error;
  }
}
