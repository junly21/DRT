import React from "react";
import { View, Text, TouchableOpacity, Modal, Animated } from "react-native";
import { router } from "expo-router";
import { useMenuStore } from "@drt/store";
import { MATERIAL_ICONS } from "@drt/utils";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Menu({ isOpen, onClose }: MenuProps) {
  const handleMenuPress = (screen: string) => {
    onClose();
    router.push(screen as any);
  };

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View className="flex-1 bg-black bg-opacity-50">
        {/* Overlay to close menu */}
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Menu Panel */}
        <View className="bg-white rounded-t-3xl shadow-2xl">
          {/* Menu Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-gray-200">
            <Text className="text-2xl font-bold text-gray-900">메뉴</Text>
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
              onPress={onClose}>
              <Text className="text-xl text-gray-600">
                {MATERIAL_ICONS.close}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View className="p-6">
            {/* Payment Methods */}
            <TouchableOpacity
              className="flex-row items-center p-4 rounded-xl bg-blue-50 mb-4 border border-blue-200"
              onPress={() => handleMenuPress("/(menu)/payment-methods")}>
              <View className="w-12 h-12 bg-blue-600 rounded-xl items-center justify-center mr-4">
                <Text className="text-2xl text-white">
                  {MATERIAL_ICONS.card}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">
                  지불 수단
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  카드, 현금, 모바일 결제 관리
                </Text>
              </View>
              <Text className="text-xl text-gray-400">
                {MATERIAL_ICONS.forward}
              </Text>
            </TouchableOpacity>

            {/* Usage History */}
            <TouchableOpacity
              className="flex-row items-center p-4 rounded-xl bg-green-50 mb-4 border border-green-200"
              onPress={() => handleMenuPress("/(menu)/usage-history")}>
              <View className="w-12 h-12 bg-green-600 rounded-xl items-center justify-center mr-4">
                <Text className="text-2xl text-white">
                  {MATERIAL_ICONS.history}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">
                  이용 내역
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  과거 호출 기록 및 결제 내역
                </Text>
              </View>
              <Text className="text-xl text-gray-400">
                {MATERIAL_ICONS.forward}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Safe Area */}
          <View className="h-8 bg-white" />
        </View>
      </View>
    </Modal>
  );
}
