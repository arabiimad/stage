import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(username, password);
    if (ok) navigate('/');
    else alert('Login failed');
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-2xl mb-4">Connexion</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="border p-2 w-full" placeholder="Nom d'utilisateur" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" className="border p-2 w-full" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2" type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
