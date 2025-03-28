
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Lock } from "lucide-react";

const LoginPage = () => {
  const { state, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await login({ email, password });
    setIsSubmitting(false);
  };

  // If already authenticated, redirect to appropriate dashboard
  if (state.isAuthenticated) {
    return <Navigate to={state.user?.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center auth-bg p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="border-border/40 shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center">
                <User className="text-primary-foreground h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center font-bold">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              {state.error && <p className="text-sm text-destructive text-center">{state.error}</p>}
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Create account
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Demo accounts:</p>
          <p>Admin: admin@example.com / admin123</p>
          <p>User: user@example.com / user123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
