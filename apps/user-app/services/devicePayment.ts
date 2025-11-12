import { apiClient } from "@drt/api-client";

const DEVICE_PAYMENT_ENDPOINT = "/selectDeviceList.do";

export type DevicePaymentMethodCode = "CARD" | "CASH" | "MOBILE";

export interface DevicePaymentResponseItem {
  DEVICE_ID: string;
  payment: DevicePaymentMethodCode | null;
}

export type DevicePaymentResponse = DevicePaymentResponseItem[];

export async function fetchDevicePayment(
  deviceId: string
): Promise<DevicePaymentResponse> {
  const payload = { DEVICE_ID: deviceId };
  console.log("[DevicePayment] 요청", {
    endpoint: DEVICE_PAYMENT_ENDPOINT,
    payload,
  });

  const response = await apiClient.post<DevicePaymentResponse>(
    DEVICE_PAYMENT_ENDPOINT,
    payload
  );
  console.log("[DevicePayment] 응답", response);
  return response;
}
