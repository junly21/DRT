module.exports = {
  extends: ["@expo/tsconfig-base"],
  compilerOptions: {
    strict: true,
    baseUrl: ".",
    paths: {
      "@/*": ["./src/*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/store/*": ["./store/*"],
    },
  },
  exclude: [
    "node_modules",
    "babel.config.js",
    "metro.config.js",
    "jest.config.js",
  ],
};

