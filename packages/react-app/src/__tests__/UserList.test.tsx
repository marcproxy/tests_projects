import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { UserList } from '../components/UserList';

describe('UserList Component', () => {
  // Avant chaque test, on réinitialise le mock de fetch
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('affiche le loader puis la liste d\'utilisateurs', async () => {
    // Mock direct de fetch sans utiliser MSW
    global.fetch = jest.fn().mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' }
        ])
      } as Response)
    );
    
    render(<UserList />);
    
    // Vérifier que le loader apparaît
    expect(screen.getByRole('status')).toHaveTextContent('Chargement...');
    
    // Attendre que le loader disparaisse
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Vérifier que la liste apparaît et contient les bons éléments
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Alice');
    expect(items[1]).toHaveTextContent('Bob');
  });

  test('affiche une erreur si l\'API échoue', async () => {
    // Mock d'échec de fetch
    global.fetch = jest.fn().mockImplementationOnce(() => 
      Promise.reject(new Error('Network request failed'))
    );
    
    render(<UserList />);
    
    // Vérifier que le loader apparaît initialement
    expect(screen.getByRole('status')).toHaveTextContent('Chargement...');
    
    // Attendre que le message d'erreur apparaisse
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Erreur : Network request failed');
  });
});
