import React, { useState } from 'react';
import './App.css';

function App() {
  const [userName, setUserName] = useState('');
  const [users, setUsers] = useState([]);

  const handleCreateUser = () => {
    if (userName.trim()) {
      setUsers([...users, userName]);
      setUserName('');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gestion des utilisateurs</h1>
      </header>
      <main>
        <div className="user-form">
          <input
            type="text"
            name="userName"
            placeholder="Nom de l'utilisateur"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button onClick={handleCreateUser}>Créer</button>
        </div>
        
        <div className="user-list">
          <h2>Liste des utilisateurs</h2>
          {users.length === 0 ? (
            <p>Aucun utilisateur</p>
          ) : (
            <ul>
              {users.map((user, index) => (
                <li key={index}>{user}</li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;