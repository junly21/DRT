import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Screen } from "../../components/ui/Screen";
import { getButtonClasses, MATERIAL_ICONS } from "@drt/utils";

interface PaymentMethod {
  id: string;
  type: "card" | "cash" | "mobile";
  name: string;
  details: string;
  isDefault: boolean;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "1",
    type: "card",
    name: "신용카드",
    details: "**** **** **** 1234",
    isDefault: true,
  },
  {
    id: "2",
    type: "mobile",
    name: "삼성페이",
    details: "010-****-1234",
    isDefault: false,
  },
  {
    id: "3",
    type: "cash",
    name: "현금 결제",
    details: "운전자에게 직접 지불",
    isDefault: false,
  },
];

export default function PaymentMethodsScreen() {
  const [paymentMethods, setPaymentMethods] =
    useState<PaymentMethod[]>(PAYMENT_METHODS);
  const [selectedMethod, setSelectedMethod] = useState<string>("1");

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === methodId,
      }))
    );
    Alert.alert("알림", "기본 결제 수단으로 설정되었습니다.");
  };

  const handleAddMethod = () => {
    Alert.alert("알림", "새로운 결제 수단 추가 기능은 준비중입니다.");
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case "card":
        return "💳";
      case "mobile":
        return "📱";
      case "cash":
        return "💵";
      default:
        return "💳";
    }
  };

  const getMethodColor = (type: string) => {
    switch (type) {
      case "card":
        return "bg-blue-50 border-blue-200";
      case "mobile":
        return "bg-green-50 border-green-200";
      case "cash":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <Screen>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <View className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-200">
          <View className="flex-row items-center mb-3">
            <Text className="text-xl mr-3">{MATERIAL_ICONS.info}</Text>
            <Text className="text-blue-900 font-bold text-lg">
              결제 수단 관리
            </Text>
          </View>
          <Text className="text-blue-800 text-sm leading-6 font-medium">
            • 기본 결제 수단은 호출 시 자동으로 선택됩니다{"\n"}• 새로운 결제
            수단을 추가하거나 기존 수단을 관리할 수 있습니다{"\n"}• 현금 결제는
            운전자에게 직접 지불하는 방식입니다
          </Text>
        </View>

        {/* Payment Methods List */}
        <View className="space-y-4 mb-6">
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              className={`${getMethodColor(method.type)} rounded-xl p-6 border-2 ${
                selectedMethod === method.id
                  ? "border-blue-600 bg-blue-100"
                  : ""
              }`}
              onPress={() => handleMethodSelect(method.id)}>
              {/* Method Header */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <Text className="text-3xl mr-4">
                    {getMethodIcon(method.type)}
                  </Text>
                  <View>
                    <Text className="text-lg font-bold text-gray-900">
                      {method.name}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {method.details}
                    </Text>
                  </View>
                </View>

                {method.isDefault && (
                  <View className="bg-blue-600 px-3 py-1 rounded-lg">
                    <Text className="text-white text-xs font-bold">기본</Text>
                  </View>
                )}
              </View>

              {/* Method Actions */}
              <View className="flex-row space-x-3">
                {!method.isDefault && (
                  <TouchableOpacity
                    className="flex-1 bg-blue-600 py-3 rounded-lg"
                    onPress={() => handleSetDefault(method.id)}>
                    <Text className="text-white text-center font-bold">
                      기본으로 설정
                    </Text>
                  </TouchableOpacity>
                )}

                {method.type !== "cash" && (
                  <TouchableOpacity
                    className="bg-gray-200 py-3 px-4 rounded-lg"
                    onPress={() =>
                      Alert.alert("알림", "수정 기능은 준비중입니다.")
                    }>
                    <Text className="text-gray-700 font-bold">수정</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add New Method */}
        <TouchableOpacity
          className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-6 mb-6"
          onPress={handleAddMethod}>
          <View className="items-center">
            <Text className="text-4xl mb-3">{MATERIAL_ICONS.plus}</Text>
            <Text className="text-lg font-bold text-gray-700 mb-2">
              새로운 결제 수단 추가
            </Text>
            <Text className="text-sm text-gray-500 text-center">
              신용카드, 체크카드, 모바일 결제 등을 추가할 수 있습니다
            </Text>
          </View>
        </TouchableOpacity>

        {/* Payment Info */}
        <View className="bg-green-50 rounded-xl p-6 mb-8 border border-green-200">
          <View className="flex-row items-center mb-3">
            <Text className="text-lg mr-2">{MATERIAL_ICONS.check}</Text>
            <Text className="text-green-900 font-bold">결제 안내</Text>
          </View>
          <Text className="text-green-800 text-sm leading-6 font-medium">
            • 결제는 서비스 이용 후 자동으로 처리됩니다{"\n"}• 카드 결제 시
            영수증이 자동으로 발급됩니다{"\n"}• 결제 관련 문의는 고객센터로
            연락해주세요
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}
