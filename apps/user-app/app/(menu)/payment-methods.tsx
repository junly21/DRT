import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Screen } from "../../components/ui/Screen";
import { MATERIAL_ICONS } from "@drt/utils";

interface PaymentMethod {
  id: string;
  type: "card" | "cash";
  name: string;
  description: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "card",
    type: "card",
    name: "카드 결제",
    description: "신용카드 또는 체크카드로 결제",
  },
  {
    id: "cash",
    type: "cash",
    name: "현금 결제",
    description: "운전자에게 직접 현금으로 지불",
  },
];

export default function PaymentMethodsScreen() {
  const [selectedMethod, setSelectedMethod] = useState<string>("card");

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case "card":
        return "💳";
      case "cash":
        return "💵";
      default:
        return "💳";
    }
  };

  return (
    <Screen>
      <View style={{ flex: 1, padding: 24 }}>
        {/* Header */}
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

        {/* Payment Methods */}
        <View style={{ gap: 16 }}>
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={{
                borderRadius: 12,
                padding: 24,
                borderWidth: 2,
                borderColor:
                  selectedMethod === method.id ? "#2563EB" : "#E5E7EB",
                backgroundColor:
                  selectedMethod === method.id ? "#EFF6FF" : "#FFFFFF",
              }}
              onPress={() => handleMethodSelect(method.id)}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 36, marginRight: 16 }}>
                  {getMethodIcon(method.type)}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: "#111827",
                      marginBottom: 4,
                    }}>
                    {method.name}
                  </Text>
                  <Text style={{ fontSize: 14, color: "#6B7280" }}>
                    {method.description}
                  </Text>
                </View>
                {selectedMethod === method.id && (
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

        {/* Simple Info */}
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
