import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('App Component', () => {
  test('renders user management header', () => {
    render(<App />);
    const headerElement = screen.getByText(/Gestion des utilisateurs/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('allows adding a new user', () => {
    render(<App />);
    
    // Vérifier l'état initial
    expect(screen.getByText(/Aucun utilisateur/i)).toBeInTheDocument();
    
    // Saisir un nom d'utilisateur
    const input = screen.getByPlaceholderText(/Nom de l'utilisateur/i);
    fireEvent.change(input, { target: { value: 'Diane' } });
    
    // Cliquer sur le bouton Créer
    const button = screen.getByText('Créer');
    fireEvent.click(button);
    
    // Vérifier que l'utilisateur a été ajouté
    expect(screen.getByText('Diane')).toBeInTheDocument();
    
    // Vérifier que le champ a été vidé
    expect(input).toHaveValue('');
  });

  test('does not add empty user names', () => {
    render(<App />);
    
    // Vérifier l'état initial
    expect(screen.getByText(/Aucun utilisateur/i)).toBeInTheDocument();
    
    // Saisir un nom d'utilisateur vide (juste des espaces)
    const input = screen.getByPlaceholderText(/Nom de l'utilisateur/i);
    fireEvent.change(input, { target: { value: '   ' } });
    
    // Cliquer sur le bouton Créer
    const button = screen.getByText('Créer');
    fireEvent.click(button);
    
    // Vérifier qu'aucun utilisateur n'a été ajouté
    expect(screen.getByText(/Aucun utilisateur/i)).toBeInTheDocument();
  });

  test('can add multiple users', () => {
    render(<App />);
    
    const input = screen.getByPlaceholderText(/Nom de l'utilisateur/i);
    const button = screen.getByText('Créer');
    
    // Ajouter le premier utilisateur
    fireEvent.change(input, { target: { value: 'Diane' } });
    fireEvent.click(button);
    
    // Ajouter le deuxième utilisateur
    fireEvent.change(input, { target: { value: 'John' } });
    fireEvent.click(button);
    
    // Vérifier que les deux utilisateurs sont affichés
    expect(screen.getByText('Diane')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
