import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <p>Bienvenue, {user.username}</p>
    </div>
  );
};

export default Admin;
