import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useCallStore } from "@drt/store";
import {
  validateCallVehicle,
  type ValidateCallParams,
} from "../services/validateCallVehicle";

interface UseCallValidationModalOptions {
  onSuccess?: () => void;
  onFailure?: () => void;
}

export function useCallValidationModal({
  onSuccess,
  onFailure,
}: UseCallValidationModalOptions = {}) {
  const [isValidating, setIsValidating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const setCallValidation = useCallStore((state) => state.setCallValidation);
  const clearCallValidation = useCallStore(
    (state) => state.clearCallValidation
  );

  const validate = useCallback(
    async (payload: ValidateCallParams) => {
      if (isValidating) {
        return;
      }

      setIsValidating(true);
      clearCallValidation();

      try {
        const result = await validateCallVehicle(payload);

        if (result.RESULT === "SUCCESS") {
          setCallValidation({
            result: result.RESULT,
            params: { ...result.PARAMS },
          });
        } else {
          setCallValidation({
            result: result.RESULT,
            message: result.MESSAGE,
            capacity: result.CAPACITY,
            currentReserved: result.CURREN_RESERVED,
            newReserved: result.NEWRSV,
          });
        }

        setModalVisible(true);
        return result.RESULT;
      } catch (err) {
        console.error("[useCallValidationModal] 검증 실패", err);
        Alert.alert(
          "호출 검증 실패",
          err instanceof Error ? err.message : "호출 검증에 실패했습니다."
        );
      } finally {
        setIsValidating(false);
      }
    },
    [isValidating, setCallValidation, clearCallValidation]
  );

  const handleClose = useCallback(() => {
    setModalVisible(false);
    const validation = useCallStore.getState().callValidation;
    if (validation?.result && validation.result !== "SUCCESS") {
      clearCallValidation();
      onFailure?.();
    }
  }, [clearCallValidation, onFailure]);

  const handleConfirm = useCallback(() => {
    setModalVisible(false);
    onSuccess?.();
  }, [onSuccess]);

  return {
    isValidating,
    modalVisible,
    validate,
    handleModalClose: handleClose,
    handleModalConfirm: handleConfirm,
  };
}

