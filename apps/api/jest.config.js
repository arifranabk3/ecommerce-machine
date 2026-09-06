module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleNameMapper: {
    '^@sellzy/shared$': '<rootDir>/../../packages/shared/src',
    '^@sellzy/validation$': '<rootDir>/../../packages/validation/src',
    '^@sellzy/config$': '<rootDir>/../../packages/config/src'
  }
};
