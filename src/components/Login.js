import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = e => {
    e.preventDefault();

    axios.post('http://localhost:3001/auth/login', {
      username: username,
      password: password
    })
      .then(response => {
        console.log(response);
        if (response.data.token) {
          setToken(response.data.token);
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
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;