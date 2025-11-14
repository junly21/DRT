import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import type { ActiveReservation } from "@drt/store";
import { formatTimestampToReadable } from "../../../../utils/datetime";

interface ActiveReservationModalProps {
  visible: boolean;
  reservation: ActiveReservation | null;
  onContinue: () => void;
  onDismiss?: () => void;
  isLoading?: boolean;
}

export function ActiveReservationModal({
  visible,
  reservation,
  onContinue,
  onDismiss,
  isLoading = false,
}: ActiveReservationModalProps) {
  const rideTime = formatTimestampToReadable(
    reservation?.scheduleRideTimestamp ?? undefined
  );
  const alightTime = formatTimestampToReadable(
    reservation?.scheduleAlightTimestamp ?? undefined
  );

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onDismiss}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}>
        <View
          style={{
            width: "100%",
            maxWidth: 320,
            backgroundColor: "#ffffff",
            borderRadius: 20,
            padding: 24,
            gap: 16,
          }}>
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#111827" }}>
              예약이 진행 중입니다
            </Text>
            <Text style={{ fontSize: 14, color: "#6b7280" }}>
              이전에 진행한 차량 호출이 아직 완료되지 않았습니다.
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#f9fafb",
              borderRadius: 16,
              padding: 16,
              gap: 12,
            }}>
            <View>
              <Text style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>
                승차 정류장
              </Text>
              <Text
                style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}>
                {reservation?.startPointName ??
                  reservation?.startPointId ??
                  "-"}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>
                하차 정류장
              </Text>
              <Text
                style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}>
                {reservation?.endPointName ?? reservation?.endPointId ?? "-"}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View>
                <Text
                  style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>
                  승차 예정
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: "#1f2937" }}>
                  {rideTime ?? "-"}
                </Text>
              </View>
              <View>
                <Text
                  style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>
                  하차 예정
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: "#1f2937" }}>
                  {alightTime ?? "-"}
                </Text>
              </View>
            </View>
          </View>

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
                backgroundColor: "#2563eb",
                minWidth: 120,
                alignItems: "center",
              }}
              onPress={onContinue}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text
                  style={{ fontSize: 15, fontWeight: "600", color: "#ffffff" }}>
                  상세 보기
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
