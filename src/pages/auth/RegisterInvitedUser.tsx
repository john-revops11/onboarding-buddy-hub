
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { HexagonPattern } from "@/components/auth/AuthHexagons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle, CheckCircle } from "lucide-react";
import { verifyInvitationToken, registerInvitedUser } from "@/lib/client-management/client-invitations";
import { useAuth } from "@/contexts/auth-context";
import { Icons } from "@/components/icons";

const RegisterInvitedUser = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const token = searchParams.get("token");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    async function validateToken() {
      if (!token) {
        setError("No invitation token provided");
        setIsLoading(false);
        return;
      }

      const result = await verifyInvitationToken(token);
      if (result.valid) {
        setTokenValid(true);
        setTokenInfo(result);
      } else {
        setError(result.message || "Invalid invitation");
      }
      setIsLoading(false);
    }

    validateToken();
  }, [token]);

  const validatePassword = () => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }

    setPasswordError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await registerInvitedUser(
        tokenInfo.tokenId, 
        password, 
        tokenInfo.email
      );
      
      if (result.success) {
        // Login with the new credentials
        await login({
          email: tokenInfo.email,
          password: password
        });
        navigate("/dashboard");
      } else {
        setError(result.message || "Failed to complete registration");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
            
            {!tokenValid ? (
              <>
                <h1 className="text-3xl font-bold text-center text-neutral-900">Invalid Invitation</h1>
                <p className="text-center text-neutral-600 mt-2">
                  This invitation is invalid or has expired.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-center text-neutral-900">Complete Registration</h1>
                <p className="text-center text-neutral-600 mt-2">
                  You've been invited to join {tokenInfo.clientName || "Revify"}.
                </p>
              </>
            )}
          </motion.div>

          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200 text-red-700">
              <XCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {tokenValid ? (
            <motion.div 
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    value={tokenInfo.email}
                    disabled
                    className="h-11 bg-gray-100"
                  />
                  <p className="text-xs text-muted-foreground">
                    You'll use this email to log in
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11"
                  />
                  
                  {passwordError && (
                    <p className="text-xs text-red-600">
                      {passwordError}
                    </p>
                  )}
                </div>
                
                <Button
                  type="submit"
                  className="w-full h-11 bg-accentGreen-600 hover:bg-accentGreen-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
              
              <p className="text-center text-neutral-600 text-sm mt-4">
                By completing registration, you agree to our Terms of Service and Privacy Policy.
              </p>
            </motion.div>
          ) : (
            <div className="text-center">
              <Button 
                onClick={() => navigate("/login")} 
                className="mt-4"
              >
                Return to Login
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-accentGreen-600 to-accentGreen-700 text-white relative flex-col justify-center items-center p-12">
        <HexagonPattern color="#ffffff" area="invitation" />
        
        <div className="z-10 max-w-md space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-4">Welcome to Revify</h2>
            <p className="text-lg opacity-90 mb-6">
              Revify helps businesses optimize their operations through data-driven insights and tailored analytics.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-white shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Data-Driven Insights</h3>
                  <p className="opacity-80">Access advanced analytics and visualizations to guide decision making.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-white shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Team Collaboration</h3>
                  <p className="opacity-80">Work together seamlessly with role-based access and shared workspaces.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-white shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Support & Training</h3>
                  <p className="opacity-80">Get dedicated assistance to maximize your experience with Revify.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterInvitedUser;
