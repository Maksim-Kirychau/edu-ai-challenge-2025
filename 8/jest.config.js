module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'validator.js',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
}; 