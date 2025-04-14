
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { Shield, Check } from "lucide-react";
import { AuthBackground } from "@/components/auth/AuthBackground";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, state } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Get the intended destination from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  // If already authenticated, redirect to the appropriate dashboard
  useEffect(() => {
    if (state.isAuthenticated) {
      const redirectPath = state.user?.role === "admin" ? "/admin" : "/dashboard";
      navigate(redirectPath, { replace: true });
    }
  }, [state.isAuthenticated, state.user, navigate]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (isLoading) return; // Prevent multiple submissions
    
    setIsLoading(true);
    
    try {
      await login({
        email: data.email,
        password: data.password,
      });
      
      // Auth state changes will trigger the useEffect for redirect
      
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Show more specific error messages based on error type
      const errorMessage = error.message || "Invalid email or password. Please try again.";
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Login form */}
      <div className="relative flex w-full md:w-1/2 flex-col items-center justify-center bg-white px-8 md:px-16 py-12">
        <div className="absolute top-10 left-10">
          <div className="w-12 h-12 rounded-full bg-[#8ab454]/90">
            <img 
              src="/public/lovable-uploads/112cb5c5-b290-4f65-9db1-daa1d1242758.png" 
              alt="Revify Logo" 
              className="w-14 h-14 scale-90"
            />
          </div>
        </div>
        
        <AuthBackground className="opacity-10" />
        
        <div className="mx-auto w-full max-w-md space-y-8 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral-900">Welcome back</h1>
            <p className="mt-2 text-neutral-600">Login to access your Revify dashboard</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-700">Email address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        autoComplete="email"
                        className="h-12 rounded-md border-neutral-200 bg-white"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-neutral-700">Password</FormLabel>
                      <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-[#8ab454] hover:text-[#75a33d]"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="h-12 rounded-md border-neutral-200 bg-white"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full h-14 bg-[#8ab454] hover:bg-[#75a33d] text-white font-medium rounded-md" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center text-sm text-neutral-600">
            <p>
              Don't have an account? Please contact your administrator
              to receive an invitation.
            </p>
          </div>
        </div>
      </div>
      
      {/* Right side - Security info */}
      <div className="hidden md:flex md:w-1/2 bg-[#8ab454] relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8ab454]/90 to-[#75a33d]/90"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-8 max-w-md w-full">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-white mr-3" />
              <h2 className="text-2xl font-semibold text-white">Secure Login</h2>
            </div>
            
            <p className="text-white mb-8">
              Your security is our top priority. All connections to Revify are encrypted and we
              implement industry-standard protection for your data.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <p className="ml-3 text-white">
                  End-to-end encryption for all your data transfers
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <p className="ml-3 text-white">
                  Two-factor authentication for enhanced account security
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <p className="ml-3 text-white">
                  Regular security audits to ensure compliance with industry standards
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute right-0 top-0 h-full w-full overflow-hidden">
          <div className="absolute top-8 right-20 opacity-20">
            <div className="w-32 h-32 border-2 border-white/30 rounded-md rotate-45"></div>
          </div>
          <div className="absolute bottom-20 right-40 opacity-20">
            <div className="w-40 h-40 border-2 border-white/30 rounded-md rotate-12"></div>
          </div>
          <div className="absolute top-1/2 left-10 opacity-20">
            <div className="w-24 h-24 border-2 border-white/30 rounded-md -rotate-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
