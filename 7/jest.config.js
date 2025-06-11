export default {
    transform: {},
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1'
    },
    testEnvironment: 'node',
    moduleDirectories: ['node_modules', 'src'],
    rootDir: '.'
  };