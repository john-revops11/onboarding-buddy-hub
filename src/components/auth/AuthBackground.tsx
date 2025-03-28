
import React from "react";

interface AuthBackgroundProps {
  className?: string;
}

export const AuthBackground: React.FC<AuthBackgroundProps> = ({ className }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden -z-10 ${className}`}>
      {/* Left side hexagon pattern */}
      <div className="absolute left-0 top-0 w-1/3 h-full">
        <img 
          src="/lovable-uploads/b0f7e926-4ec1-43fa-99df-79c7892e92e3.png" 
          alt="Hexagon Pattern Left" 
          className="object-cover h-full opacity-50"
        />
      </div>
      
      {/* Right side hexagon pattern */}
      <div className="absolute right-0 top-0 w-1/3 h-full">
        <img 
          src="/lovable-uploads/b0f7e926-4ec1-43fa-99df-79c7892e92e3.png" 
          alt="Hexagon Pattern Right" 
          className="object-cover h-full opacity-50 transform scale-x-[-1]"
        />
      </div>
      
      {/* Dashboard illustration at the bottom left */}
      <div className="absolute bottom-8 left-8 w-64 h-64 opacity-80 hidden lg:block">
        <img 
          src="/lovable-uploads/f3709e1e-a1eb-422c-918b-5bccd0e3d8ce.png" 
          alt="Dashboard Stats" 
          className="object-contain"
        />
      </div>
      
      {/* Analytics illustration at the bottom right */}
      <div className="absolute bottom-8 right-8 w-64 h-64 opacity-80 hidden lg:block">
        <img 
          src="/lovable-uploads/3116e253-cd0e-45d5-a261-2a3b5a3f0ac1.png" 
          alt="Analytics" 
          className="object-contain"
        />
      </div>
      
      {/* People collaboration illustration at the top */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-64 h-64 opacity-80 hidden lg:block">
        <img 
          src="/lovable-uploads/09269027-4b5c-4e21-9c9c-0082a44222e5.png" 
          alt="Collaboration" 
          className="object-contain"
        />
      </div>
    </div>
  );
};
