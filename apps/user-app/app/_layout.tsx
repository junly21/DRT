import React from "react";
import { Stack } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import "../global.css";
import { Menu } from "../components/ui/Menu";
import { useMenuStore } from "@drt/store";

export default function RootLayout() {
  const { isMenuOpen, toggleMenu, closeMenu } = useMenuStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#ececec", // StatusBar는 하드코딩 유지
          },
          headerTintColor: "#222222", // StatusBar는 하드코딩 유지
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}>
        <Stack.Screen
          name="index"
          options={{
            title: "DRT 호출",
            headerShown: true,
            headerLeft: () => (
              <TouchableOpacity onPress={toggleMenu} style={{ padding: 8 }}>
                <Text style={{ color: "#222222", fontSize: 24 }}>☰</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="(main)/ferry-schedule"
          options={{
            title: "여객선 시간표",
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="(menu)/payment-methods"
          options={{
            title: "지불 수단",
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="(menu)/usage-history"
          options={{
            title: "이용 내역",
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="(flows)/common/result"
          options={{
            title: "호출 결과",
            presentation: "card",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="(flows)/common/select-route"
          options={{
            title: "노선 선택",
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="(flows)/common/select-boarding-stop"
          options={{
            title: "승차 정류장 선택",
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="(flows)/common/select-alighting-stop"
          options={{
            title: "하차 정류장 선택",
            presentation: "card",
          }}
        />
      </Stack>
      <Menu isOpen={isMenuOpen} onClose={closeMenu} />
    </QueryClientProvider>
  );
}
