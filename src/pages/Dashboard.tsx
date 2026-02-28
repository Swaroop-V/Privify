import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { UserDashboard } from './UserDashboard';
import { Shield } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <Shield className="w-8 h-8 animate-pulse text-indigo-600" />
          <p>Loading your secure environment...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-6 max-w-md bg-white rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Profile Not Found</h2>
          <p className="text-slate-500">We couldn't find your user profile. Please try logging in again or contact support.</p>
        </div>
      </div>
    );
  }

  return userProfile.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
};
