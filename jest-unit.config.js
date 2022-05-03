import config from './jest.config'

module.exports = {
  ...config,
  testMatch: ['<rootDir>/src/**/**.test.ts']
// eslint-disable-next-line eol-last
}