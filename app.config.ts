import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "DRT User",
  slug: "drt-user",
  version: "1.0.0",
  main: "expo-router/entry",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  scheme: "drt-user",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.drt.user",
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "현재 위치를 기반으로 가장 가까운 정류장을 찾기 위해 위치 권한이 필요합니다.",
      NSLocationAlwaysAndWhenInUseUsageDescription:
        "현재 위치를 기반으로 가장 가까운 정류장을 찾기 위해 위치 권한이 필요합니다.",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.drt.user",
    permissions: ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"],
  },
  web: {
    favicon: "./assets/favicon.png",
    bundler: "metro",
    name: "DRT User",
  },
  plugins: [
    "expo-router",
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "현재 위치를 기반으로 가장 가까운 정류장을 찾기 위해 위치 권한이 필요합니다.",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
});
