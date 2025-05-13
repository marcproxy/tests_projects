// src/__tests__/UserList.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { UserList } from '../src/components/UserList';

// Désactivez complètement MSW pour ces tests
describe('UserList Component', () => {
  // Mock global de fetch avant chaque test
  beforeEach(() => {
    jest.resetAllMocks();
    // Restaurer le fetch original pour éviter les interférences
    global.fetch = jest.fn();
  });

  it('affiche le loader puis la liste d\'utilisateurs', async () => {
    // Configurer le mock de fetch pour ce test
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ]
    });
    
    render(<UserList />);
    
    // Vérifier que le loader apparaît
    expect(screen.getByRole('status')).toHaveTextContent('Chargement...');
    
    // Attendre que les éléments de liste apparaissent
    await waitFor(() => {
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveTextContent('Alice');
      expect(items[1]).toHaveTextContent('Bob');
    }, { timeout: 3000 }); // Augmenter le timeout pour s'assurer que la requête a le temps de se terminer
  });

  it('affiche une erreur si l\'API échoue', async () => {
    // Configurer le mock de fetch pour simuler une erreur
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network request failed'));
    
    render(<UserList />);
    
    // Attendre que l'alerte d'erreur apparaisse
    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent('Erreur : Network request failed');
    });
  });
});