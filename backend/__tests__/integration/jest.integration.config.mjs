// jest.integration.config.mjs
export default {
  testMatch: ['**/__tests__/integration/**/*.test.js'],
  setupFilesAfterEnv: ['./setup.int.js']
}