import { formatCallDateTime, formatDispatchDate } from "./datetime";
import type { ValidateCallParams } from "../services/validateCallVehicle";

interface BuildCallPayloadOptions {
  startPointId: string;
  endPointId: string;
  deviceId?: string | null;
  latitude?: number;
  longitude?: number;
  paymentMethod?: "card" | "cash" | "mobile" | null;
  passengerCount: number;
  sailTime?: string;
}

export function buildValidateCallPayload({
  startPointId,
  endPointId,
  deviceId,
  latitude,
  longitude,
  paymentMethod,
  passengerCount,
  sailTime,
}: BuildCallPayloadOptions): ValidateCallParams {
  if (latitude == null || longitude == null) {
    throw new Error(
      "위치 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요."
    );
  }

  const payment = (
    paymentMethod ? paymentMethod.toUpperCase() : "CARD"
  ) as ValidateCallParams["PAYMENT"];

  return {
    DISPATCH_DT: formatDispatchDate(),
    CALL_DTM: formatCallDateTime(),
    START_POINT_ID: startPointId,
    END_POINT_ID: endPointId,
    DEVICE_ID: deviceId ?? "SIMULATOR_DEVICE",
    GPS_X: longitude.toString(),
    GPS_Y: latitude.toString(),
    PAYMENT: payment,
    RSV_NUM: passengerCount.toString(),
    ...(sailTime ? { SAIL_TM: sailTime } : {}),
  };
}
