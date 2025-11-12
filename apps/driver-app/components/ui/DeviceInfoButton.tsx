import React, { useState, useCallback } from "react";
import {
  Modal,
  Pressable,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useCallStore } from "@drt/store";

const styles = StyleSheet.create({
  trigger: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "rgba(22, 72, 200, 0.1)",
  },
  triggerText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1648C8",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 320,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  row: {
    marginTop: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  closeButton: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: "#1648C8",
    paddingVertical: 10,
  },
  closeButtonText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
});

export function DeviceInfoButton() {
  const deviceId = useCallStore((state) => state.deviceId);
  const vehicleId = useCallStore((state) => state.vehicleId);
  const driverRouteId = useCallStore((state) => state.driverRouteId);
  const driverIsOperating = useCallStore((state) => state.driverIsOperating);

  const [visible, setVisible] = useState(false);

  const handleOpen = useCallback(() => setVisible(true), []);
  const handleClose = useCallback(() => setVisible(false), []);

  return (
    <>
      <TouchableOpacity
        onPress={handleOpen}
        style={styles.trigger}
        accessibilityRole="button"
        accessibilityLabel="장치 및 차량 정보 보기"
        accessibilityHint="장치 ID와 차량 ID를 확인합니다">
        <Text style={styles.triggerText}>
          {driverIsOperating ? "운행정보" : "장치정보"}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={handleClose}>
        <Pressable style={styles.modalOverlay} onPress={handleClose}>
          <Pressable style={styles.modalContent}>
            <Text style={styles.modalTitle}>장치 · 차량 정보</Text>

            <View style={styles.row}>
              <Text style={styles.label}>DEVICE ID</Text>
              <Text style={styles.value}>{deviceId ?? "-"}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>VEHICLE ID</Text>
              <Text style={styles.value}>{vehicleId ?? "-"}</Text>
            </View>

            {/* <View style={styles.row}>
              <Text style={styles.label}>ROUTE ID</Text>
              <Text style={styles.value}>{driverRouteId ?? "-"}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>운행 상태</Text>
              <Text style={styles.value}>
                {driverIsOperating ? "운행 중" : "대기"}
              </Text>
            </View> */}

            <TouchableOpacity
              onPress={handleClose}
              accessibilityRole="button"
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
