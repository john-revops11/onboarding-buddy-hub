
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { HexagonPattern } from "@/components/auth/AuthHexagons";
import { SecurityInfo } from "@/components/auth/SecurityInfo";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, login, clearError } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    // Clear any previous errors on component mount
    clearError();
    setLoginError(null);
    
    if (state.isAuthenticated) {
      console.log("User is authenticated, redirecting to dashboard");
      console.log("User role:", state.user?.role);
      const redirectPath = state.user?.role === "admin" ? "/admin" : "/dashboard";
      navigate(redirectPath, { replace: true });
    }
    
    // Set login error if auth reports an error
    if (state.error) {
      setLoginError(state.error);
    }
  }, [state.isAuthenticated, state.user, state.error, navigate, clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    
    // Clear validation errors when user starts typing
    if (submitAttempted) {
      setLoginError(null);
    }
  };

  const validateForm = (): boolean => {
    if (!credentials.email.trim()) {
      setLoginError("Email is required");
      return false;
    }
    
    if (!credentials.password) {
      setLoginError("Password is required");
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      setLoginError("Please enter a valid email address");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    
    if (!validateForm()) {
      return;
    }
    
    setLoginError(null);
    
    try {
      await login(credentials);
    } catch (error: any) {
      // Handle specific error types
      if (error.code === "invalid_credentials") {
        setLoginError("Invalid email or password. Please try again.");
      } else if (error.code === "user_not_found") {
        setLoginError("No account found with this email address.");
      } else if (error.code === "too_many_attempts") {
        setLoginError("Too many login attempts. Please try again later.");
      } else if (error.message?.includes("network")) {
        setLoginError("Network error. Please check your connection and try again.");
      } else {
        setLoginError(error.message || "Login failed. Please try again.");
      }
      console.error("Login error:", error);
    }
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
              Login to access your Revify dashboard
            </p>
          </motion.div>

          {loginError && (
            <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200 text-red-700">
              <XCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          <motion.div 
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={credentials.email}
                  onChange={handleInputChange}
                  className={`h-11 ${submitAttempted && !credentials.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                  aria-invalid={submitAttempted && !credentials.email ? "true" : "false"}
                />
              </div>
              
              <div className="space-y-2">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  className={`h-11 ${submitAttempted && !credentials.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  aria-invalid={submitAttempted && !credentials.password ? "true" : "false"}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full h-11 bg-accentGreen-600 hover:bg-accentGreen-700"
                disabled={state.isLoading}
              >
                {state.isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
            
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
