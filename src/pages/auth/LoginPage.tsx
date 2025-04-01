
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Info, CheckCircle2, LockKeyhole } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { AuthBackground } from "@/components/auth/AuthBackground";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, state } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [demoCred, setDemoCred] = useState<string | null>(null);
  const [showMFAInfo, setShowMFAInfo] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (state.isAuthenticated && !state.isLoading) {
      if (state.user?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [state.isAuthenticated, state.isLoading, state.user, navigate]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setLoginError(null);
    
    try {
      await login({
        email: data.email,
        password: data.password,
      });
      
      // Toast notification will be shown by the auth context after successful login
      // The redirect will happen in the useEffect above when state.isAuthenticated changes
      
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError(error.message || "Failed to login. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const fillAdminCredentials = () => {
    form.setValue("email", "admin@example.com");
    form.setValue("password", "admin123");
    setDemoCred("admin");
    toast({
      title: "Admin credentials filled",
      description: "Click 'Log in' to sign in as an admin",
    });
  };

  const fillUserCredentials = () => {
    form.setValue("email", "user@example.com");
    form.setValue("password", "user123");
    setDemoCred("user");
    toast({
      title: "User credentials filled",
      description: "Click 'Log in' to sign in as a regular user",
    });
  };

  // Toggle MFA info panel
  const toggleMFAInfo = () => setShowMFAInfo(!showMFAInfo);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black relative">
      {/* Dynamic background */}
      <AuthBackground />
      
      <div className="w-full max-w-md relative z-10">
        <Card className="w-full shadow-lg border-green-base/20 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <img
                src="/lovable-uploads/c6574cfa-11f0-4c58-8f1e-962b252ae14f.png"
                alt="Revify Logo"
                className="w-24 h-24 object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Demo Credentials Alert */}
            <Alert className="border-green-base/50 bg-green-base/10">
              <Info className="h-4 w-4 text-green-base" />
              <AlertTitle className="text-green-base">Demo Credentials</AlertTitle>
              <AlertDescription className="text-sm mt-2">
                <p>The following demo credentials are ready to use:</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className={`w-full text-xs ${demoCred === "admin" ? "bg-green-base/90 hover:bg-green-hover" : "bg-green-base hover:bg-green-hover"} text-white border-green-base`}
                    onClick={fillAdminCredentials}
                  >
                    {demoCred === "admin" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                    Admin Login
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className={`w-full text-xs ${demoCred === "user" ? "bg-green-base/90 hover:bg-green-hover" : "bg-green-base hover:bg-green-hover"} text-white border-green-base`}
                    onClick={fillUserCredentials}
                  >
                    {demoCred === "user" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                    User Login
                  </Button>
                </div>
              </AlertDescription>
            </Alert>

            {/* MFA Coming Soon Badge */}
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="bg-amber-50 text-amber-800 hover:bg-amber-100 cursor-pointer border-amber-200" onClick={toggleMFAInfo}>
                <LockKeyhole className="mr-1 h-3 w-3" />
                MFA Coming Soon
              </Badge>
              
              <Badge variant="outline" className="bg-blue-50 text-blue-800 hover:bg-blue-100 cursor-pointer border-blue-200">
                SSO Support
              </Badge>
            </div>
            
            {/* MFA Info Panel - toggles visibility */}
            {showMFAInfo && (
              <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                <Info className="h-4 w-4" />
                <AlertTitle>Multi-Factor Authentication</AlertTitle>
                <AlertDescription className="text-xs mt-1">
                  Enhanced security with MFA will be available soon. This will provide an additional layer of protection for your account.
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-green-base hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button type="submit" className="w-full bg-green-base hover:bg-green-hover" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log in"
                  )}
                </Button>
                {loginError && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription className="text-sm">
                      {loginError}
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-green-base font-semibold hover:underline">
                Register
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
