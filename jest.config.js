module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/testUtils/**',
    '!src/theme.js',
    '!/node_modules/',
    '!src/**/_app.js',
    '!src/**/_document.js',
    '!/test/',
    '!**/*.d.ts',
  ],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  moduleDirectories: ['src', 'node_modules'],
};
