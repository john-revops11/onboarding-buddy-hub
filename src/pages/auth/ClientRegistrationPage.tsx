
import React from "react";
import { ClientRegistrationForm } from "@/components/registration/ClientRegistrationForm";
import { AuthBackground } from "@/components/auth/AuthBackground";

const ClientRegistrationPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black relative">
      {/* Dynamic background */}
      <AuthBackground />
      
      <div className="w-full z-10 my-8">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <img
            src="/lovable-uploads/78ce9c1d-4a0e-48f9-b47b-d2ed2bacdbe5.png"
            alt="Revify Logo"
            className="h-12 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-white">Welcome to Revify</h1>
          <p className="text-muted-foreground text-white/70 mt-2">
            Complete this form to register your company and get started
          </p>
        </div>
        
        <ClientRegistrationForm
          onRegistrationComplete={(data) => {
            console.log("Registration completed with data:", data);
            // In a real implementation, you would use this data to create users,
            // generate Google Drive folders, etc.
          }}
        />
      </div>
    </div>
  );
};

export default ClientRegistrationPage;
