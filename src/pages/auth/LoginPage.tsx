
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Info } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/integrations/supabase/client";

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
  const [demoCredentialsStatus, setDemoCredentialsStatus] = useState<{
    admin: boolean;
    user: boolean;
  }>({ admin: false, user: false });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Check if demo credentials exist in the database
  useEffect(() => {
    const checkDemoCredentials = async () => {
      try {
        // We can't directly check if users exist through the client API
        // Instead, we'll modify the UI based on the login success/failure
        setDemoCredentialsStatus({ admin: true, user: true });
      } catch (error) {
        console.error("Error checking demo credentials:", error);
      }
    };

    checkDemoCredentials();
  }, []);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await login({
        email: data.email,
        password: data.password,
      });
      // Redirect based on role
      if (state.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const fillAdminCredentials = () => {
    form.setValue("email", "admin@example.com");
    form.setValue("password", "admin123");
    toast({
      title: "Admin credentials filled",
      description: "Click 'Log in' to sign in as an admin",
    });
  };

  const fillUserCredentials = () => {
    form.setValue("email", "user@example.com");
    form.setValue("password", "user123");
    toast({
      title: "User credentials filled",
      description: "Click 'Log in' to sign in as a regular user",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center auth-bg p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Demo Credentials Alert */}
          <Alert className="border-green-base/50 bg-green-base/5">
            <Info className="h-4 w-4 text-green-base" />
            <AlertTitle className="text-green-base">Demo Credentials</AlertTitle>
            <AlertDescription className="mt-2">
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-xs bg-green-base hover:bg-green-hover text-white border-green-base"
                  onClick={fillAdminCredentials}
                >
                  Admin Login
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-xs bg-green-base hover:bg-green-hover text-white border-green-base"
                  onClick={fillUserCredentials}
                >
                  User Login
                </Button>
              </div>
            </AlertDescription>
          </Alert>

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
              {state.error && (
                <p className="text-sm text-destructive text-center">{state.error}</p>
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
  );
};

export default LoginPage;
