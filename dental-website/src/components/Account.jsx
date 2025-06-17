import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Account = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl mb-4">Mon Compte</h1>
      <p>Nom d'utilisateur: {user.username}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default Account;
