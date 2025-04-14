
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  const { state } = useAuth();
  const isAuthenticated = state.isAuthenticated;
  const userRole = state.user?.role;
  
  const dashboardLink = userRole === 'admin' ? '/admin' : '/dashboard';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600 mb-4">
            <ShieldAlert size={40} />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. 
            {isAuthenticated 
              ? " Your current role does not have sufficient privileges."
              : " Please log in to continue."
            }
          </p>
          
          {isAuthenticated ? (
            <Link 
              to={dashboardLink} 
              className="bg-accentGreen-600 text-white py-2 px-4 rounded hover:bg-accentGreen-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link 
              to="/login"
              className="bg-accentGreen-600 text-white py-2 px-4 rounded hover:bg-accentGreen-700 transition-colors"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
