import React, { useState } from 'react';

interface UserFormProps {
  onCreated: (name: string) => void;
}

export const UserForm: React.FC<UserFormProps> = ({ onCreated }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ne pas appeler onCreated si le nom est vide
    if (name.trim()) {
      onCreated(name);
      setName(''); // Réinitialiser le champ après la soumission
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Nom:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <button type="submit">Créer</button>
    </form>
  );
};