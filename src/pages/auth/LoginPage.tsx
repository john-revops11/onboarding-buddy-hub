
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { Shield, Check, Mail, Lock, Info, AlertCircle } from "lucide-react";
import { AuthBackground } from "@/components/auth/AuthBackground";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters."
  })
});

type FormValues = z.infer<typeof formSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, state } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Get the intended destination from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  // If already authenticated, redirect to the appropriate dashboard
  useEffect(() => {
    if (state.isAuthenticated) {
      const redirectPath = state.user?.role === "admin" ? "/admin" : "/dashboard";
      navigate(redirectPath, {
        replace: true
      });
    }
  }, [state.isAuthenticated, state.user, navigate]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: FormValues) => {
    if (isLoading) return; // Prevent multiple submissions

    setIsLoading(true);
    try {
      await login({
        email: data.email,
        password: data.password
      });

      // Auth state changes will trigger the useEffect for redirect
    } catch (error: any) {
      console.error("Login error:", error);

      // Show more specific error messages based on error type
      const errorMessage = error.message || "Invalid email or password. Please try again.";
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Login form */}
      <div className="relative flex w-full md:w-1/2 flex-col items-center justify-center bg-white px-6 md:px-12 lg:px-16 py-10 md:py-12">
        <div className="absolute top-6 left-6 md:top-10 md:left-10">
          <div className="text-2xl font-bold text-[#8ab454] flex items-center">
            <span className="animate-float">Revify</span>
          </div>
        </div>
        
        <AuthBackground className="opacity-10" />
        
        <div className="mx-auto w-full max-w-md space-y-6 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Welcome back</h1>
            <p className="text-neutral-600">Login to access your Revify dashboard</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-700 font-medium">Email address</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-neutral-500">
                          <Mail size={18} />
                        </div>
                        <Input 
                          type="email" 
                          placeholder="name@example.com" 
                          autoComplete="email" 
                          className="h-12 pl-10 rounded-lg border-neutral-200 bg-white focus:ring-[#8ab454] focus:border-[#8ab454]" 
                          disabled={isLoading} 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs mt-1" />
                  </div>
                </FormItem>
              )} />
              
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center mb-1">
                    <FormLabel className="text-neutral-700 font-medium">Password</FormLabel>
                    <Link to="/forgot-password" className="text-sm font-medium text-[#8ab454] hover:text-[#75a33d] transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-neutral-500">
                          <Lock size={18} />
                        </div>
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          autoComplete="current-password" 
                          className="h-12 pl-10 rounded-lg border-neutral-200 bg-white focus:ring-[#8ab454] focus:border-[#8ab454]" 
                          disabled={isLoading} 
                          {...field} 
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-700 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs mt-1" />
                  </div>
                </FormItem>
              )} />
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-[#8ab454] hover:bg-[#75a33d] text-white font-medium rounded-lg transition-all shadow-sm hover:shadow hover:translate-y-[-2px]" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : "Login"}
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
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-8 max-w-md w-full shadow-lg transition-transform hover:translate-y-[-5px] duration-300">
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 text-white mr-3" />
              <h2 className="text-2xl font-semibold text-white">Secure Login</h2>
            </div>
            
            <p className="text-white mb-8 leading-relaxed">
              Your security is our top priority. All connections to Revify are encrypted and we
              implement industry-standard protection for your data.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start group">
                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <p className="text-white group-hover:translate-x-1 transition-transform">
                  End-to-end encryption for all your data transfers
                </p>
              </div>
              
              <div className="flex items-start group">
                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <p className="text-white group-hover:translate-x-1 transition-transform">
                  Two-factor authentication for enhanced account security
                </p>
              </div>
              
              <div className="flex items-start group">
                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <p className="text-white group-hover:translate-x-1 transition-transform">
                  Regular security audits to ensure compliance with industry standards
                </p>
              </div>
              
              <div className="mt-8 flex items-center justify-center">
                <div className="bg-white/20 rounded-full px-4 py-2 text-sm text-white flex items-center">
                  <Info size={14} className="mr-2" />
                  <span>Need help? Contact support@revify.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute right-0 top-0 h-full w-full overflow-hidden">
          <div className="absolute top-8 right-20 opacity-20">
            <div className="w-32 h-32 border-2 border-white/30 rounded-md rotate-45 animate-float"></div>
          </div>
          <div className="absolute bottom-20 right-40 opacity-20">
            <div className="w-40 h-40 border-2 border-white/30 rounded-md rotate-12 animate-float" style={{ animationDelay: "2s" }}></div>
          </div>
          <div className="absolute top-1/2 left-10 opacity-20">
            <div className="w-24 h-24 border-2 border-white/30 rounded-md -rotate-12 animate-float" style={{ animationDelay: "1s" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
