import React from "react";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import "../global.css";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#3b82f6",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}>
        <Stack.Screen
          name="index"
          options={{
            title: "DRT 기사",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="common/select-route"
          options={{
            title: "노선 선택",
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
