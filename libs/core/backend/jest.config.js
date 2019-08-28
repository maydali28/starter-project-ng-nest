module.exports = {
  name: 'core-backend',
  preset: '../../../jest.config.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../../coverage/libs/core/backend',
  testPathIgnorePatterns: ['libs/core/backend/src/configuration']
};
