
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HexagonPattern } from "@/components/auth/AuthHexagons";
import { SecurityInfo } from "@/components/auth/SecurityInfo";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle } from "lucide-react";
import { verifyInvitationToken, registerInvitedUser } from "@/lib/client-management/client-invitations";

const formSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const RegisterInvitedUser = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [inviteData, setInviteData] = useState<any>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setVerificationError("Invalid invitation link. No token provided.");
      setIsVerifying(false);
      return;
    }
    
    const verifyToken = async () => {
      try {
        setIsVerifying(true);
        const result = await verifyInvitationToken(token);
        
        if (!result.valid) {
          setVerificationError(result.message || "Invalid or expired invitation.");
          return;
        }
        
        setInviteData(result);
      } catch (error: any) {
        console.error("Error verifying token:", error);
        setVerificationError(error.message || "Failed to verify invitation.");
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyToken();
  }, [searchParams]);
  
  const onSubmit = async (values: FormValues) => {
    if (!inviteData) return;
    
    try {
      setIsRegistering(true);
      const token = searchParams.get("token") || "";
      
      const result = await registerInvitedUser(
        inviteData.tokenId, 
        values.password,
        inviteData.email
      );
      
      if (result.success) {
        navigate("/dashboard");
      } else {
        form.setError("root", { 
          message: result.message || "Failed to register. Please try again."
        });
      }
    } catch (error: any) {
      form.setError("root", { 
        message: error.message || "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsRegistering(false);
    }
  };
  
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icons.spinner className="mx-auto h-8 w-8 animate-spin text-accentGreen-600" />
          <p className="mt-4 text-lg">Verifying your invitation...</p>
        </div>
      </div>
    );
  }
  
  if (verificationError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-2xl font-semibold">Invalid Invitation</h1>
          <p className="mt-2">{verificationError}</p>
          <Button 
            className="mt-6"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen w-full">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 lg:px-16 xl:px-24 bg-white relative overflow-hidden">
        <HexagonPattern color="#67af44" area="security" />
        
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
            <h1 className="text-3xl font-bold text-center text-neutral-900">Complete Registration</h1>
            <p className="text-center text-neutral-600 mt-2">
              Set your password to access {inviteData?.clientName || "your account"}
            </p>
          </motion.div>

          {form.formState.errors.root && (
            <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200 text-red-700">
              <XCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
            </Alert>
          )}

          <motion.div 
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="mb-2">
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">{inviteData?.email}</p>
                </div>
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Create Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter your password" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Confirm your password" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  className="w-full h-11 bg-accentGreen-600 hover:bg-accentGreen-700 mt-2"
                  disabled={isRegistering}
                >
                  {isRegistering ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Setting up your account...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </Button>
              </form>
            </Form>
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

export default RegisterInvitedUser;
