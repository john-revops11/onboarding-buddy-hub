
import React from "react";
import { Hexagon } from "lucide-react";
import { motion } from "framer-motion";

interface HexagonShapeProps {
  size: number;
  position: { 
    top?: string; 
    bottom?: string; 
    left?: string; 
    right?: string; 
  };
  delay: number;
  color: string;
  opacity?: number;
}

export const HexagonShape: React.FC<HexagonShapeProps> = ({ 
  size, 
  position, 
  delay, 
  color,
  opacity = 0.2
}) => (
  <motion.div
    className="absolute"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity, scale: 1, rotate: 360 }}
    transition={{
      type: "spring",
      stiffness: 50,
      damping: 15,
      delay,
      duration: 2
    }}
    style={{
      ...position,
      zIndex: 0
    }}
  >
    <Hexagon size={size} color={color} />
  </motion.div>
);

interface HexagonPatternProps {
  color: string;
  area: "login" | "security";
}

export const HexagonPattern: React.FC<HexagonPatternProps> = ({ color, area }) => {
  if (area === "login") {
    return (
      <>
        <HexagonShape size={80} position={{ top: "5%", right: "10%" }} delay={0.2} color={color} />
        <HexagonShape size={60} position={{ bottom: "10%", left: "5%" }} delay={0.4} color={color} />
        <HexagonShape size={40} position={{ top: "40%", left: "15%" }} delay={0.6} color={color} />
      </>
    );
  }
  
  return (
    <>
      <HexagonShape size={120} position={{ top: "15%", right: "15%" }} delay={0.6} color={color} />
      <HexagonShape size={90} position={{ bottom: "20%", left: "10%" }} delay={0.8} color={color} />
      <HexagonShape size={60} position={{ top: "35%", left: "25%" }} delay={1.0} color={color} />
      <HexagonShape size={40} position={{ bottom: "35%", right: "20%" }} delay={1.2} color={color} />
    </>
  );
};
