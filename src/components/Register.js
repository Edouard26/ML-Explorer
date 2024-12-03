import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const handleSubmit = e => {
    e.preventDefault();

    axios.post('http://localhost:3001/auth/register', {
      username: username,
      password: password
    })
      .then(response => {
        console.log(response);
        // Si l'enregistrement est réussi, redirigez vers la page de connexion
        if (response.data.success) {
          history.push('/login');
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nom d'utilisateur:
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </label>
      <label>
        Mot de passe:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <button type="submit">S'inscrire</button>
    </form>
  );
};

export default Register;