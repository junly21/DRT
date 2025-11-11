import { apiClient } from "@drt/api-client";

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

  const response = await apiClient.post<SelectDetailCodeResponse>(
    SELECT_DETAIL_CODE_ENDPOINT,
    payload
  );
  console.log("디바이스 아이디로 차량 아이디 조회 응답", response);
  if (!Array.isArray(response) || response.length === 0) {
    return null;
  }

  const [first] = response;
  return first?.value ?? null;
}
