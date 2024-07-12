export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
