/// <reference types="jest" />

// Ajoute la déclaration globale pour test et expect
declare global {
  const test: typeof jest.test;
  const expect: jest.Expect;
}

export {};