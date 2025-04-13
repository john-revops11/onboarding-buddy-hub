
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Registration Unavailable",
      description: "Direct registration is not available. Please contact your administrator for an invitation.",
      variant: "destructive",
    });
    
    // Redirect to login page
    navigate("/login", { replace: true });
  }, [navigate, toast]);

  return null;
};

export default RegisterPage;
