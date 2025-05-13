// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest-setup.js'], // Exécuté avant l'environnement de test
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // Exécuté après l'initialisation de l'environnement
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Transforme les fichiers TypeScript
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$', // Motif de recherche pour les fichiers de test
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // Extensions de fichier reconnues
  moduleNameMapper: {
    // Mock des fichiers statiques (CSS, images, etc.)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts', // Exclure les fichiers de déclaration
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};