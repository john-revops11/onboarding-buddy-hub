
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

enum VerificationStatus {
  LOADING,
  SUCCESS,
  EXPIRED,
  INVALID,
  ERROR
}

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<VerificationStatus>(VerificationStatus.LOADING);
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus(VerificationStatus.INVALID);
        return;
      }

      try {
        // In a real implementation, this would call an API to verify the token
        // Mock verification for demo purposes
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

        // Randomly pick success or expired for demo purposes
        const verificationResult = Math.random() > 0.3;

        if (verificationResult) {
          setEmail("user@example.com"); // This would come from the API response
          setStatus(VerificationStatus.SUCCESS);
          
          // Auto-login after a delay
          setTimeout(async () => {
            try {
              // In a real implementation, this would use the actual auth flow
              // For demo purposes, we're just redirecting
              // await login({ email: "user@example.com", password: "tempPassword" });
              toast({
                title: "Account Verified",
                description: "You have been logged in and will be redirected to the onboarding page."
              });
              navigate("/onboarding");
            } catch (error) {
              console.error("Error logging in:", error);
              setStatus(VerificationStatus.ERROR);
            }
          }, 3000);
        } else {
          setStatus(VerificationStatus.EXPIRED);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        setStatus(VerificationStatus.ERROR);
      }
    };

    verifyToken();
  }, [token, navigate, login]);

  const handleResendInvite = async () => {
    setStatus(VerificationStatus.LOADING);
    try {
      // In a real implementation, this would call an API to resend the invite
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      toast({
        title: "Invite Resent",
        description: "A new invitation has been sent to your email address."
      });
      
      setStatus(VerificationStatus.SUCCESS);
    } catch (error) {
      console.error("Error resending invite:", error);
      toast({
        title: "Error",
        description: "Failed to resend invitation. Please try again.",
        variant: "destructive"
      });
      setStatus(VerificationStatus.ERROR);
    }
  };

  const renderContent = () => {
    switch (status) {
      case VerificationStatus.LOADING:
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Verifying your account...</p>
            <p className="text-muted-foreground">This will just take a moment.</p>
          </div>
        );
      
      case VerificationStatus.SUCCESS:
        return (
          <>
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <p className="text-lg font-medium">Account Verified Successfully!</p>
              <p className="text-muted-foreground">
                You'll be redirected to the onboarding page in a few seconds...
              </p>
            </div>
            <CardFooter className="flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </CardFooter>
          </>
        );
      
      case VerificationStatus.EXPIRED:
        return (
          <>
            <div className="flex flex-col items-center justify-center py-8">
              <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
              <p className="text-lg font-medium">Invitation Expired</p>
              <p className="text-muted-foreground text-center max-w-md">
                This invitation link has expired. Please request a new invitation
                from your administrator or click below to resend.
              </p>
            </div>
            <CardFooter className="flex justify-center">
              <Button onClick={handleResendInvite}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Request New Invitation
              </Button>
            </CardFooter>
          </>
        );
      
      case VerificationStatus.INVALID:
        return (
          <>
            <div className="flex flex-col items-center justify-center py-8">
              <XCircle className="h-12 w-12 text-destructive mb-4" />
              <p className="text-lg font-medium">Invalid Invitation</p>
              <p className="text-muted-foreground text-center max-w-md">
                This invitation link is invalid. Please check that you have the correct link
                or contact your administrator.
              </p>
            </div>
            <CardFooter className="flex justify-center">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Go to Login
              </Button>
            </CardFooter>
          </>
        );
      
      case VerificationStatus.ERROR:
        return (
          <>
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                There was a problem verifying your account. Please try again or contact support.
              </AlertDescription>
            </Alert>
            <div className="flex flex-col items-center justify-center py-4">
              <XCircle className="h-12 w-12 text-destructive mb-4" />
              <p className="text-lg font-medium">Verification Failed</p>
              <p className="text-muted-foreground text-center max-w-md">
                We encountered an error while verifying your account. Please try again
                or contact your administrator.
              </p>
            </div>
            <CardFooter className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Go to Login
              </Button>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </CardFooter>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Verify Your Account</CardTitle>
          <CardDescription>
            Complete your account activation to get started with Revify
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
