// src/__tests__/UserForm.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserForm } from '../src/components/UserForm';

describe('UserForm Component', () => {
  it('appel onCreated avec le bon nom au submit', async () => {
    const onCreated = jest.fn();
    render(<UserForm onCreated={onCreated} />);
    
    // Saisir un nom dans l'input
    const input = screen.getByLabelText(/nom/i);
    await userEvent.type(input, 'Charlie');
    
    // Soumettre le formulaire
    const button = screen.getByRole('button', { name: /créer/i });
    await userEvent.click(button);
    
    // Vérifier que onCreated a été appelé avec le bon argument
    expect(onCreated).toHaveBeenCalledTimes(1);
    expect(onCreated).toHaveBeenCalledWith('Charlie');
  });
  
  it('ne doit pas appeler onCreated si input vide', async () => {
    const onCreated = jest.fn();
    render(<UserForm onCreated={onCreated} />);
    
    // Cliquer sur le bouton sans entrer de texte
    const button = screen.getByRole('button', { name: /créer/i });
    await userEvent.click(button);
    
    // Vérifier que onCreated n'a pas été appelé
    expect(onCreated).not.toHaveBeenCalled();
  });
});