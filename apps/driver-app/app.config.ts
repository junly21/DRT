import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "DRT Driver",
  slug: "drt-driver",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  scheme: "drt-driver",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.drt.driver",
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "기사 위치 추적 및 승객 픽업을 위해 위치 권한이 필요합니다.",
      NSLocationAlwaysAndWhenInUseUsageDescription:
        "기사 위치 추적 및 승객 픽업을 위해 위치 권한이 필요합니다.",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.drt.driver",
    permissions: ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"],
  },
  web: {
    favicon: "./assets/favicon.png",
    bundler: "metro",
  },
  plugins: [
    "expo-router",
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "기사 위치 추적 및 승객 픽업을 위해 위치 권한이 필요합니다.",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
});
