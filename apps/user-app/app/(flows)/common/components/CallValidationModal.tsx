import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { formatTimestampToReadable } from "../../../../utils/datetime";
import type {
  ValidateCallParams,
  ValidateCallResult,
} from "../../../../services/validateCallVehicle";

interface CallValidationModalProps {
  visible: boolean;
  result: ValidateCallResult;
  params?: ValidateCallParams;
  message?: string;
  capacity?: number;
  currentReserved?: number;
  newReserved?: number;
  onConfirm: () => void;
  onClose: () => void;
}

export function CallValidationModal({
  visible,
  result,
  params,
  message,
  capacity,
  currentReserved,
  newReserved,
  onConfirm,
  onClose,
}: CallValidationModalProps) {
  const rideTime = formatTimestampToReadable(params?.SCHEDULE_RIDE_DTM);
  const alightTime = formatTimestampToReadable(params?.SCHEDULE_ALGH_DTM);

  const isSuccess = result === "SUCCESS";
  const title = isSuccess
    ? "예약을 진행할까요?"
    : result === "FAIL_CAPA"
      ? "수용 인원 초과"
      : "배차 불가";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}>
        <View
          style={{
            width: "100%",
            maxWidth: 340,
            borderRadius: 20,
            backgroundColor: "#FFFFFF",
            padding: 24,
          }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 16,
              textAlign: "center",
            }}>
            {title}
          </Text>

          {isSuccess ? (
            <View style={{ gap: 12, marginBottom: 24 }}>
              <InfoRow label="승차 예정 시간" value={rideTime ?? "-"} />
              <InfoRow label="하차 예정 시간" value={alightTime ?? "-"} />
              {params?.ROUTE_ID && (
                <InfoRow label="배차 노선" value={params.ROUTE_ID} />
              )}
              {params?.VEHICLE_ID && (
                <InfoRow label="배정 차량" value={params.VEHICLE_ID} />
              )}
              {typeof params?.NEWRSV !== "undefined" && (
                <InfoRow
                  label="예약 인원"
                  value={`${params.NEWRSV?.toLocaleString()}명`}
                />
              )}
              {typeof params?.CURREN_RESERVED !== "undefined" && (
                <InfoRow
                  label="현재 예약된 인원"
                  value={`${params.CURREN_RESERVED?.toLocaleString()}명`}
                />
              )}
              {typeof params?.CAPACITY !== "undefined" && (
                <InfoRow
                  label="최대 수용 인원"
                  value={`${params.CAPACITY?.toLocaleString()}명`}
                />
              )}
            </View>
          ) : (
            <View style={{ gap: 12, marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 16,
                  color: "#4B5563",
                  textAlign: "center",
                }}>
                {message || "호출이 불가능합니다."}
              </Text>
              {result === "FAIL_CAPA" && (
                <View style={{ gap: 4 }}>
                  <InfoRow
                    label="최대 수용 인원"
                    value={
                      typeof capacity !== "undefined"
                        ? `${capacity.toLocaleString()}명`
                        : "-"
                    }
                  />
                  <InfoRow
                    label="현재 예약된 인원"
                    value={
                      typeof currentReserved !== "undefined"
                        ? `${currentReserved.toLocaleString()}명`
                        : "-"
                    }
                  />
                  <InfoRow
                    label="요청 예약 인원"
                    value={
                      typeof newReserved !== "undefined"
                        ? `${newReserved.toLocaleString()}명`
                        : "-"
                    }
                  />
                </View>
              )}
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 12,
            }}>
            <TouchableOpacity
              style={{
                paddingHorizontal: 18,
                paddingVertical: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#E5E7EB",
                minWidth: 80,
                alignItems: "center",
              }}
              onPress={onClose}>
              <Text
                style={{ fontSize: 16, color: "#6B7280", fontWeight: "600" }}>
                닫기
              </Text>
            </TouchableOpacity>
            {isSuccess && (
              <TouchableOpacity
                style={{
                  paddingHorizontal: 18,
                  paddingVertical: 12,
                  borderRadius: 12,
                  backgroundColor: "#2563EB",
                  minWidth: 100,
                  alignItems: "center",
                }}
                onPress={onConfirm}>
                <Text
                  style={{ fontSize: 16, color: "#FFFFFF", fontWeight: "600" }}>
                  예약 진행
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
      <Text style={{ fontSize: 14, color: "#6B7280" }}>{label}</Text>
      <Text style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}>
        {value}
      </Text>
    </View>
  );
}
