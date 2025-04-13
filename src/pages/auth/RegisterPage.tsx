
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Registration Information",
      description: "Registration requires an invitation from an administrator. Please contact your admin if you need access.",
      variant: "default",
    });
    
    // Redirect to login page after a short delay
    const redirectTimer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 3000); // 3 second delay to allow user to read the message
    
    return () => clearTimeout(redirectTimer);
  }, [navigate, toast]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-r from-slate-100 to-slate-200">
      <div className="mx-auto grid w-full max-w-md gap-6 px-8 md:px-0">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold">Registration Information</h1>
          <p className="text-slate-500">
            Direct registration is not available. Please contact your administrator for an invitation.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            Redirecting you to the login page...
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
