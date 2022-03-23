/* eslint-disable */

const { resolve } = require('path')

const root = resolve(__dirname)

module.exports = {
  rootDir: root,
  displayName: 'root-test',
  testMatch: ['<rootDir>/src/**/**.test.ts'],
  testEnvironment: 'node',
  clearMocks: true,
  preset: 'ts-jest',
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1'
  },
  // displayName: 'functional-test',
  // testMatch: ['<rootDir>/src/**/*.spec.ts'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**'
  ],
  coverageDirectory: 'coverage',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
  
  
}



