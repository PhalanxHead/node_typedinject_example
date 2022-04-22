module.exports = {
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    modulePathIgnorePatterns: ['<rootDir>/.*/__mocks__'],
};
