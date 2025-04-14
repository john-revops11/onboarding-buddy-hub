
import React from "react";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface SecurityItemProps {
  children: React.ReactNode;
  delay?: number;
}

export const SecurityItem: React.FC<SecurityItemProps> = ({ children, delay = 0 }) => (
  <motion.div 
    className="flex items-start"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="flex-shrink-0 h-5 w-5 mt-1">
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <p className="ml-3 text-sm text-accentGreen-50 text-left">
      {children}
    </p>
  </motion.div>
);

export const SecurityInfo: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-accentGreen-700/30 backdrop-blur-sm p-8 rounded-xl border border-accentGreen-400/20"
    >
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-full bg-accentGreen-400/20 mr-4">
          <ShieldCheck size={28} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-left">Secure Login</h2>
      </div>
      
      <p className="mb-6 text-accentGreen-50 leading-relaxed text-left">
        Your security is our top priority. All connections to Revify are encrypted
        and we implement industry-standard protection for your data.
      </p>
      
      <div className="space-y-4">
        <SecurityItem delay={0.3}>
          <span className="font-medium text-white">End-to-end encryption</span> for all your data transfers
        </SecurityItem>
        <SecurityItem delay={0.4}>
          <span className="font-medium text-white">Two-factor authentication</span> for enhanced account security
        </SecurityItem>
        <SecurityItem delay={0.5}>
          <span className="font-medium text-white">Regular security audits</span> to ensure compliance with industry standards
        </SecurityItem>
      </div>
    </motion.div>
  );
};
