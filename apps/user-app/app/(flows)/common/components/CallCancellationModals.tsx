import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface CallCancellationModalsProps {
  isConfirmVisible: boolean;
  isSuccessVisible: boolean;
  onRequestCancel: () => void;
  onConfirmCancel: () => void;
  onDismissSuccess: () => void;
  isCancelling?: boolean;
}

export function CallCancellationModals({
  isConfirmVisible,
  isSuccessVisible,
  onRequestCancel,
  onConfirmCancel,
  onDismissSuccess,
  isCancelling = false,
}: CallCancellationModalsProps) {
  return (
    <>
      <Modal
        transparent
        animationType="fade"
        visible={isConfirmVisible}
        onRequestClose={onRequestCancel}>
        <View style={styles.backdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>호출을 취소하시겠습니까?</Text>
            <Text style={styles.body}>
              취소를 진행하면 현재 진행 중인 호출이 종료됩니다.
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={onRequestCancel}>
                <Text style={[styles.buttonText, styles.secondaryText]}>
                  아니오
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: isCancelling ? "#9CA3AF" : "#EF4444" },
                ]}
                disabled={isCancelling}
                onPress={onConfirmCancel}>
                <Text style={styles.buttonText}>
                  {isCancelling ? "취소 중..." : "취소할게요"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={isSuccessVisible}
        onRequestClose={onDismissSuccess}>
        <View style={styles.backdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>호출이 취소되었습니다.</Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#2563EB" }]}
              onPress={onDismissSuccess}>
              <Text style={styles.buttonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  body: {
    fontSize: 15,
    color: "#4B5563",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "#E5E7EB",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryText: {
    color: "#1F2937",
  },
});
