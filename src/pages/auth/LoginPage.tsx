
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Icons } from "@/components/icons";
import { ChevronRight, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Auth0Button } from "@/components/auth/Auth0Button";
import { HexagonPattern } from "@/components/auth/AuthHexagons";
import { SecurityInfo } from "@/components/auth/SecurityInfo";
import { useAuth0Bridge } from "@/contexts/auth0-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, user, error, loginWithAuth0 } = useAuth0Bridge();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Track if we should show the direct login form
  const [showDirectLogin, setShowDirectLogin] = useState(false);

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

  const handleDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // This is a placeholder for future implementation
    // Currently, only Auth0 login is supported
    setLoginError("Direct login is not yet implemented. Please use Auth0 login.");
  };

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
              Enter your credentials to access your account
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
            {showDirectLogin ? (
              <form onSubmit={handleDirectLogin} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                      required
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 
                        <EyeOff className="h-4 w-4 text-gray-400" /> : 
                        <Eye className="h-4 w-4 text-gray-400" />
                      }
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-accentGreen-600 hover:bg-accentGreen-700"
                >
                  Sign in
                </Button>
                
                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="mx-4 text-sm text-gray-400">or</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>
                
                <Auth0Button />
                
                <p className="text-center">
                  <button 
                    type="button" 
                    className="text-accentGreen-600 text-sm hover:underline"
                    onClick={() => setShowDirectLogin(false)}
                  >
                    Use SSO login only
                  </button>
                </p>
              </form>
            ) : (
              <>
                <Auth0Button />
                
                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="mx-4 text-sm text-gray-400">or</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>
                
                <p className="text-center">
                  <button 
                    type="button" 
                    className="text-accentGreen-600 text-sm hover:underline"
                    onClick={() => setShowDirectLogin(true)}
                  >
                    Sign in with email and password
                  </button>
                </p>
              </>
            )}
            
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
