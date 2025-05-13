// jest-dom adds custom jest matchers for asserting on DOM nodes
import '@testing-library/jest-dom';

// Mock global de fetch pour tous les tests
global.fetch = jest.fn();

// Réinitialiser les mocks entre les tests
beforeEach(() => {
  jest.resetAllMocks();
});
