import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    // Redirect non-admins to home page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
