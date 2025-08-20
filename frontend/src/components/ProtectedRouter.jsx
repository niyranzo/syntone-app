import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/Auth/useAuth';import Spinner from './Spinner';

const ProtectedRoute = ({children, admin}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner/>; 
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (admin && user.type !== "admin") {
    return <Navigate to="/user" replace />;
  }
  
  return (
    <>
        {children}
    </>
  )
}

export default ProtectedRoute