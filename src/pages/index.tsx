
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl w-full px-6 py-16 text-center">
        <img 
          src="/lovable-uploads/f3d33af0-d889-42a2-bbfb-7e82d4722926.png" 
          alt="Revify Logo" 
          className="h-16 mx-auto mb-8"
        />
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Streamline Your Client Onboarding
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Revify helps you onboard clients faster, manage their subscriptions, and provide a seamless experience.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/login">
            <Button size="lg" className="bg-accentGreen-600 hover:bg-accentGreen-700">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button size="lg" variant="outline">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
