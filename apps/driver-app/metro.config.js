const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// 모노레포에서 워크스페이스 패키지들을 해결할 수 있도록 설정
config.watchFolders = [
  path.resolve(__dirname, "../../packages"),
  path.resolve(__dirname, "../../node_modules"),
];

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "../../node_modules"),
  path.resolve(__dirname, "node_modules"),
];

// projectRoot 명시
config.projectRoot = __dirname;

// 앱별 고유 식별자 설정
config.resolver.platforms = ["ios", "android", "native", "web"];
config.resolver.sourceExts = ["js", "json", "ts", "tsx", "jsx"];

module.exports = withNativeWind(config, { input: "./global.css" });
