module.exports = {
  testEnvironment: "node",
  verbose: true,
  coveragePathIgnorePatterns: ["/node_modules/"],
  projects: [{
    "displayName": "Dappy Cadence Tests",
    // "testMatch": ["<rootDir>/**/*.test.js"],
    "testMatch": ["<rootDir>/**/Storefront.test.js"]
  }]
};