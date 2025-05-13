import React from 'react';
import { useUsers } from '../hooks/useUsers';

export const UserList: React.FC = () => {
  const { users, loading, error } = useUsers();

  if (loading) {
    return <div role="status">Chargement...</div>;
  }

  if (error) {
    return <div role="alert">Erreur : {error}</div>;
  }

  if (users.length === 0) {
    return <div>Aucun utilisateur trouvé</div>;
  }

  return (
    <div>
      <h2>Liste des utilisateurs</h2>
      <ul>
        {users.map(user => (
          <li key={user.id} role="listitem">
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
