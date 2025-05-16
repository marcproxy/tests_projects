import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Utiliser la fonction test au lieu de it
test('renders user management header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Gestion des utilisateurs/i);
  expect(headerElement).toBeInTheDocument();
});
