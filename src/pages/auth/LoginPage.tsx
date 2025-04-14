
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { ChevronRight, ShieldCheck, Hexagon } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  rememberMe: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SecurityItem = ({ children }: { children: React.ReactNode }) => (
  <motion.div 
    className="flex items-start"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex-shrink-0 h-5 w-5 mt-1">
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <p className="ml-3 text-sm text-accentGreen-50 text-left">
      {children}
    </p>
  </motion.div>
);

const HexagonShape = ({ 
  size, 
  position, 
  delay, 
  color 
}: { 
  size: number; 
  position: { top?: string; bottom?: string; left?: string; right?: string }; 
  delay: number;
  color: string;
}) => (
  <motion.div
    className="absolute opacity-20"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 0.2, scale: 1, rotate: 360 }}
    transition={{
      type: "spring",
      stiffness: 50,
      damping: 15,
      delay,
      duration: 2
    }}
    style={{
      ...position,
      zIndex: 0
    }}
  >
    <Hexagon size={size} color={color} />
  </motion.div>
);

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
      rememberMe: false,
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
      {/* Left Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 lg:px-16 xl:px-24 bg-white relative overflow-hidden">
        {/* Decorative Hexagons */}
        <HexagonShape 
          size={80} 
          position={{ top: "5%", right: "10%" }} 
          delay={0.2} 
          color="#67af44" 
        />
        <HexagonShape 
          size={60} 
          position={{ bottom: "10%", left: "5%" }} 
          delay={0.4} 
          color="#67af44" 
        />
        
        <div className="w-full max-w-md z-10">
          {/* Logo and Title */}
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

          {/* Login Form */}
          <Form {...form}>
            <motion.form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@company.com"
                        autoComplete="email"
                        disabled={isLoading}
                        className="h-11 rounded-lg border-neutral-200 focus:border-accentGreen-600"
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
                        className="text-xs text-accentGreen-600 hover:text-accentGreen-700 font-medium"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        disabled={isLoading}
                        className="h-11 rounded-lg border-neutral-200 focus:border-accentGreen-600"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Remember Me Checkbox */}
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-accentGreen-600 data-[state=checked]:border-accentGreen-600"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm text-neutral-600 font-normal">
                        Remember me for 30 days
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full h-11 bg-accentGreen-600 hover:bg-accentGreen-700" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.form>
          </Form>

          <p className="text-center text-neutral-600 text-sm mt-8">
            Don't have an account? Please contact your administrator
            to receive an invitation.
          </p>
        </div>
      </div>

      {/* Right Panel - Security Info */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-accentGreen-600 to-accentGreen-700 text-white relative">
        {/* Decorative Hexagons */}
        <HexagonShape 
          size={120} 
          position={{ top: "15%", right: "15%" }} 
          delay={0.6} 
          color="#ffffff" 
        />
        <HexagonShape 
          size={90} 
          position={{ bottom: "20%", left: "10%" }} 
          delay={0.8} 
          color="#ffffff" 
        />
        <HexagonShape 
          size={60} 
          position={{ top: "35%", left: "25%" }} 
          delay={1.0} 
          color="#ffffff" 
        />
        
        <div className="flex flex-col justify-center p-12 w-full max-w-lg mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-accentGreen-700/30 backdrop-blur-sm p-8 rounded-xl border border-accentGreen-400/20"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-accentGreen-400/20 mr-4">
                <ShieldCheck size={28} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-left">Secure Login</h2>
            </div>
            
            <p className="mb-6 text-accentGreen-50 leading-relaxed text-left">
              Your security is our top priority. All connections to Revify are encrypted
              and we implement industry-standard protection for your data.
            </p>
            
            <div className="space-y-4">
              <SecurityItem>
                <span className="font-medium text-white">End-to-end encryption</span> for all your data transfers
              </SecurityItem>
              <SecurityItem>
                <span className="font-medium text-white">Two-factor authentication</span> for enhanced account security
              </SecurityItem>
              <SecurityItem>
                <span className="font-medium text-white">Regular security audits</span> to ensure compliance with industry standards
              </SecurityItem>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
