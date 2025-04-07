
import React, { useEffect, useState } from "react";
import { Hexagon } from "lucide-react";

interface AuthBackgroundProps {
  className?: string;
}

export const AuthBackground: React.FC<AuthBackgroundProps> = ({ className }) => {
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    setInitialized(true);
  }, []);

  // Generate hexagons with various sizes and positions
  const hexagons = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.floor(Math.random() * 30) + 10,
    x: Math.floor(Math.random() * 100),
    y: Math.floor(Math.random() * 100),
    delay: Math.random() * 5,
    duration: Math.random() * 20 + 10,
    opacity: Math.random() * 0.5 + 0.1,
    color: i % 5 === 0 ? '#1E40AF' : i % 3 === 0 ? '#243949' : '#517fa4',
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden -z-10 ${className}`}>
      {/* Gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"></div>

      {/* Animated hexagon pattern */}
      <div className="absolute inset-0">
        {hexagons.map(hex => (
          <div 
            key={hex.id}
            className={`absolute transition-all duration-1000 ${initialized ? 'opacity-100' : 'opacity-0'}`}
            style={{
              left: `${hex.x}%`,
              top: `${hex.y}%`,
              opacity: hex.opacity,
              transform: `scale(${initialized ? 1 : 0})`,
              transition: `all ${hex.duration}s ease-in-out ${hex.delay}s, opacity 1s ease-in-out ${hex.delay}s`,
              animation: `float ${hex.duration}s ease-in-out ${hex.delay}s infinite alternate`
            }}
          >
            <Hexagon 
              size={hex.size} 
              color={hex.color}
              fill={Math.random() > 0.7 ? hex.color : 'transparent'}
              strokeWidth={1} 
              className="transition-transform duration-300"
            />
          </div>
        ))}
      </div>
      
      {/* Left side hexagon pattern */}
      <div className="absolute left-0 top-0 w-1/3 h-full opacity-10">
        <img 
          src="/lovable-uploads/b0f7e926-4ec1-43fa-99df-79c7892e92e3.png" 
          alt="Hexagon Pattern Left" 
          className="object-cover h-full opacity-50"
        />
      </div>
      
      {/* Right side hexagon pattern */}
      <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
        <img 
          src="/lovable-uploads/b0f7e926-4ec1-43fa-99df-79c7892e92e3.png" 
          alt="Hexagon Pattern Right" 
          className="object-cover h-full opacity-50 transform scale-x-[-1]"
        />
      </div>
      
      {/* Dashboard illustration at the bottom left */}
      <div className="absolute bottom-8 left-8 w-64 h-64 opacity-70 hidden lg:block animate-fade-in">
        <img 
          src="/lovable-uploads/f3709e1e-a1eb-422c-918b-5bccd0e3d8ce.png" 
          alt="Dashboard Stats" 
          className="object-contain"
        />
      </div>
      
      {/* Analytics illustration at the bottom right */}
      <div className="absolute bottom-8 right-8 w-64 h-64 opacity-70 hidden lg:block animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <img 
          src="/lovable-uploads/3116e253-cd0e-45d5-a261-2a3b5a3f0ac1.png" 
          alt="Analytics" 
          className="object-contain"
        />
      </div>
      
      {/* People collaboration illustration at the top */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-64 h-64 opacity-70 hidden lg:block animate-fade-in" style={{ animationDelay: "0.6s" }}>
        <img 
          src="/lovable-uploads/09269027-4b5c-4e21-9c9c-0082a44222e5.png" 
          alt="Collaboration" 
          className="object-contain"
        />
      </div>
    </div>
  );
};
