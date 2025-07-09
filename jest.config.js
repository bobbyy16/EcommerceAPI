module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: [
    "controllers/**/*.js",
    "middleware/**/*.js",
    "models/**/*.js",
    "routes/**/*.js",
    "!models/index.js",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
  testTimeout: 30000,
};
