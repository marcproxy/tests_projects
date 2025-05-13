module.exports = {
preset: 'ts-jest', testEnvironment: 'node', collectCoverage: true, coverageDirectory: 'coverage'
,
coverageThreshold: {
global: { // seuils minimaux
lines: 90,
statements: 90,
branches: 45,
functions: 90
}
},
testMatch: ["**/__tests__/**/*.test.ts"], // où trouver les tests
};