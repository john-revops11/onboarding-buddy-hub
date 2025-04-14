
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Auth0Button } from "@/components/auth/Auth0Button";
import { HexagonPattern } from "@/components/auth/AuthHexagons";
import { SecurityInfo } from "@/components/auth/SecurityInfo";
import { useAuth0Bridge } from "@/contexts/auth0-context";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, user, error } = useAuth0Bridge();
  const [loginError, setLoginError] = useState<string | null>(null);

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    // Clear any previous errors on component mount
    setLoginError(null);
    
    if (isAuthenticated) {
      console.log("User is authenticated, redirecting to dashboard");
      console.log("User role:", user?.role);
      const redirectPath = user?.role === "admin" ? "/admin" : "/dashboard";
      navigate(redirectPath, { replace: true });
    }
    
    // Set login error if Auth0 reports an error
    if (error) {
      setLoginError(error);
    }
  }, [isAuthenticated, user, navigate, error]);

  return (
    <div className="flex min-h-screen w-full">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 lg:px-16 xl:px-24 bg-white relative overflow-hidden">
        <HexagonPattern color="#67af44" area="login" />
        
        <div className="w-full max-w-md z-10">
          <motion.div 
            className="flex flex-col items-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="/lovable-uploads/f3d33af0-d889-42a2-bbfb-7e82d4722926.png" 
              alt="Revify Logo" 
              className="h-12 mb-4"
            />
            <h1 className="text-3xl font-bold text-center text-neutral-900">Welcome back</h1>
            <p className="text-center text-neutral-600 mt-2">
              Login to access your Revify dashboard
            </p>
          </motion.div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {loginError}
            </div>
          )}

          <motion.div 
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Auth0Button />
            
            <p className="text-center text-neutral-600 text-sm mt-4">
              Don't have an account? Please contact your administrator
              to receive an invitation.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-accentGreen-600 to-accentGreen-700 text-white relative">
        <HexagonPattern color="#ffffff" area="security" />
        
        <div className="flex flex-col justify-center p-12 w-full max-w-lg mx-auto z-10">
          <SecurityInfo />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
