import React from "react";
import { useCallStore } from "@drt/store";
import { CallValidationModal } from "./CallValidationModal";

interface CallValidationModalWrapperProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CallValidationModalWrapper({
  visible,
  onClose,
  onConfirm,
}: CallValidationModalWrapperProps) {
  const validation = useCallStore((state) => state.callValidation);

  if (!validation) {
    return null;
  }

  return (
    <CallValidationModal
      visible={visible}
      result={validation.result}
      params={validation.params}
      message={validation.message}
      capacity={validation.capacity}
      currentReserved={validation.currentReserved}
      newReserved={validation.newReserved}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}

