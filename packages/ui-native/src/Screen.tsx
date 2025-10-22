import React from "react";
import { View, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
  safeArea?: boolean;
  edges?: ("top" | "bottom" | "left" | "right")[];
  screenTitle?: string; // 접근성을 위한 화면 제목
}

export function Screen({
  children,
  safeArea = true,
  edges = ["top", "bottom"],
  className,
  screenTitle,
  ...props
}: ScreenProps) {
  const content = (
    <View
      className={`flex-1 bg-gray-50 ${className || ""}`}
      accessibilityLabel={screenTitle}
      {...props}>
      {children}
    </View>
  );

  if (safeArea) {
    return (
      <SafeAreaView className="flex-1" edges={edges}>
        {content}
      </SafeAreaView>
    );
  }

  return content;
}
