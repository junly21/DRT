import React, { useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "../../components/ui/Screen";
import { useCallStore } from "@drt/store";
import type { CallStore } from "@drt/store";
import { fetchDevicePayment } from "../../services/devicePayment";

type PaymentMethodId = "card" | "cash" | "mobile";

interface PaymentMethodOption {
  id: PaymentMethodId;
  name: string;
  description: string;
  icon: string;
}

const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: "card",
    name: "카드 결제",
    description: "신용카드 또는 체크카드로 결제",
    icon: "💳",
  },
  {
    id: "cash",
    name: "현금 결제",
    description: "운전자에게 직접 현금으로 지불",
    icon: "💵",
  },
];

const FALLBACK_METHOD: PaymentMethodId = "card";

function normalizeMethod(
  method: string | null | undefined
): PaymentMethodId | null {
  if (!method) {
    return null;
  }

  const upperMethod = method.toUpperCase();
  if (upperMethod === "CARD") return "card";
  if (upperMethod === "CASH") return "cash";
  if (upperMethod === "MOBILE") return "mobile";
  return null;
}

export default function PaymentMethodsScreen() {
  const deviceId = useCallStore((state: CallStore) => state.deviceId);
  const payment = useCallStore((state: CallStore) => state.payment);
  const setPayment = useCallStore((state: CallStore) => state.setPayment);

  const selectedMethod = useMemo<PaymentMethodId>(() => {
    const method = payment?.method as PaymentMethodId | null | undefined;
    if (method && PAYMENT_METHODS.some((option) => option.id === method)) {
      return method;
    }
    return FALLBACK_METHOD;
  }, [payment?.method]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["device-payment", deviceId],
    queryFn: () => fetchDevicePayment(deviceId!),
    enabled: !!deviceId,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!deviceId) {
      return;
    }

    if (payment?.method) {
      return;
    }

    if (isLoading) {
      return;
    }

    const methodFromApi = normalizeMethod(data?.[0]?.payment);
    const nextMethod =
      methodFromApi &&
      PAYMENT_METHODS.some((option) => option.id === methodFromApi)
        ? methodFromApi
        : FALLBACK_METHOD;

    setPayment({ method: nextMethod, amount: payment?.amount ?? null });
  }, [deviceId, data, isLoading, payment?.amount, payment?.method, setPayment]);

  const handleMethodSelect = (methodId: PaymentMethodId) => {
    if (selectedMethod === methodId) {
      return;
    }

    setPayment({
      method: methodId,
      amount: payment?.amount ?? null,
    });
  };

  return (
    <Screen>
      <View style={{ flex: 1, padding: 24 }}>
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 8,
            }}>
            결제 수단 선택
          </Text>
          <Text style={{ fontSize: 16, color: "#6B7280" }}>
            서비스 이용 시 사용할 결제 수단을 선택해주세요
          </Text>
        </View>

        <View style={{ gap: 16 }}>
          {PAYMENT_METHODS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={{
                borderRadius: 12,
                padding: 24,
                borderWidth: 2,
                borderColor:
                  selectedMethod === option.id ? "#2563EB" : "#E5E7EB",
                backgroundColor:
                  selectedMethod === option.id ? "#EFF6FF" : "#FFFFFF",
              }}
              onPress={() => handleMethodSelect(option.id)}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 36, marginRight: 16 }}>
                  {option.icon}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: "#111827",
                      marginBottom: 4,
                    }}>
                    {option.name}
                  </Text>
                  <Text style={{ fontSize: 14, color: "#6B7280" }}>
                    {option.description}
                  </Text>
                </View>
                {selectedMethod === option.id && (
                  <View
                    style={{
                      backgroundColor: "#2563EB",
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    <Text style={{ color: "#FFFFFF", fontSize: 14 }}>✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {isLoading && (
          <View style={{ marginTop: 24 }}>
            <Text
              style={{ fontSize: 14, color: "#6B7280", textAlign: "center" }}>
              결제 수단을 불러오는 중입니다...
            </Text>
          </View>
        )}
        {isError && (
          <View style={{ marginTop: 24 }}>
            <Text
              style={{ fontSize: 14, color: "#EF4444", textAlign: "center" }}>
              결제 수단을 불러오지 못했습니다. 기본값(카드)을 사용합니다.
            </Text>
          </View>
        )}
        <View
          style={{
            marginTop: 32,
            backgroundColor: "#F9FAFB",
            borderRadius: 12,
            padding: 16,
          }}>
          <Text style={{ fontSize: 14, color: "#6B7280", textAlign: "center" }}>
            선택한 결제 수단은 다음 호출 시에도 유지됩니다
          </Text>
        </View>
      </View>
    </Screen>
  );
}
