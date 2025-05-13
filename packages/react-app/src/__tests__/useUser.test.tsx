// src/__tests__/useUsers.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useUsers } from '../hooks/useUsers';

describe('useUsers Hook', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('retourne un état initial correct', () => {
    global.fetch = jest.fn();
    const { result } = renderHook(() => useUsers());
    
    expect(result.current.users).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('charge les utilisateurs avec succès', async () => {
    const mockUsers = [{ id: 1, name: 'Alice' }];
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers
    });
    
    const { result } = renderHook(() => useUsers());
    
    // Attendre que le chargement soit terminé
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    expect(result.current.users).toEqual(mockUsers);
    expect(result.current.error).toBe(null);
  });

  it('gère les erreurs réseau', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Network Error'));
    
    const { result } = renderHook(() => useUsers());
    
    // Attendre que le chargement soit terminé
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    expect(result.current.users).toEqual([]);
    expect(result.current.error).toBe('Network Error');
  });
});