import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/Auth/useAuth';

const PublicRouter = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    if (user.type === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.type === 'user') {
      return <Navigate to="/user" replace />;
    }
  }

  return children;
};

export default PublicRouter;
