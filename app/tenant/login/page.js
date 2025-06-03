"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import tenantApiService from "@/API/TenantApiService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomBackground } from "@/components/ui/backgrounds";
import { Building2, Mail, Lock, ArrowRight, Check, Eye, EyeOff } from "lucide-react";
import Cookies from 'js-cookie';

const TENANT_TOKEN_KEY = "tenant_token";

// Animation variants moved outside component to prevent recreation on each render
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } }
};

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }
};

export default function TenantLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [tenantName, setTenantName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Extract tenant name from subdomain
  useEffect(() => {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    setTenantName(subdomain === 'localhost' ? 'Your' : subdomain.charAt(0).toUpperCase() + subdomain.slice(1));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await tenantApiService("POST", "login", { email, password });
      // Store token in cookie instead of localStorage
      Cookies.set('tenant_token', response.access_token, { 
        expires: 7, // Cookie expires in 7 days
        secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
        sameSite: 'strict' // Protect against CSRF
      });
      Cookies.set('userRole', response.role, { 
        expires: 7, // Cookie expires in 7 days
        secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
        sameSite: 'strict' // Protect against CSRF
      });
      setLoginSuccess(true);
      setTimeout(() => router.push("/main"), 2000);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  // Memoize the loading spinner to prevent unnecessary re-renders
  const loadingSpinner = useMemo(() => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ), []);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <CustomBackground className="absolute inset-0 -z-10 opacity-50" />
      <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <motion.div className="hidden md:block" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="space-y-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#60A5FA] flex items-center justify-center shadow-lg">
              <Building2 className="w-10 h-10 text-white" />
            </motion.div>
            <motion.h1 className="text-4xl font-bold text-gray-900" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              Welcome {" "}
              <span className="text-[#4F46E5]">{tenantName}</span> {" "}
              to
            </motion.h1>
            <motion.p className="text-xl text-gray-600" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              Streamline your inventory management with our powerful platform
            </motion.p>
            <motion.div className="pt-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#4F46E5] mr-2"></div>
                  <span>Real-time tracking</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#4F46E5] mr-2"></div>
                  <span>Smart analytics</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div className="relative z-10" variants={containerVariants} initial="hidden" animate="visible">
          <AnimatePresence mode="wait">
            {loginSuccess ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }} className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-[#10B981]/10 mb-4">
                  <Check className="w-8 h-8 text-[#10B981]" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Successful!</h2>
                <p className="text-gray-600 mb-6">You are being redirected to your main page...</p>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-[#4F46E5] to-[#60A5FA]" />
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" className="bg-white rounded-2xl shadow-xl overflow-hidden" variants={formVariants} initial="hidden" animate="visible">
                <div className="p-8">
                  <div className="text-center mb-8">
                    <motion.h2 className="text-2xl font-bold text-gray-900" variants={itemVariants}>Sign in to your account</motion.h2>
                    <motion.p className="text-sm text-gray-600 mt-1" variants={itemVariants}>Enter your credentials to access your dashboard</motion.p>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div className="mb-6 p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center"
                        initial={{ opacity: 0, height: 0, y: -5 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -5 }}
                        transition={{ duration: 0.2 }}>
                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleLogin}>
                    <motion.div className="space-y-5" variants={formVariants}>
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <div className="relative group">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                            <Mail className="h-5 w-5 min-w-5 min-h-5 text-gray-400 group-focus-within:text-[#4F46E5] transition-colors duration-200" />
                          </span>
                          <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all duration-200 text-gray-900"
                            placeholder="name@example.com" required />
                        </div>
                      </motion.div>

                      <motion.div className="space-y-2" variants={itemVariants}>
                        <div className="flex justify-between">
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                          <a href="/forgot-password" className="text-sm text-[#4F46E5] hover:text-[#4338CA] transition-colors duration-200">Forgot password?</a>
                        </div>
                        <div className="relative group">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                            <Lock className="h-5 w-5 min-w-5 min-h-5 text-gray-400 group-focus-within:text-[#4F46E5] transition-colors duration-200" />
                          </span>
                          <Input type={showPassword ? "text" : "password"} id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all duration-200 text-gray-900"
                            placeholder="••••••••" required />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#4F46E5] transition-colors duration-200"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </motion.div>

                      <Button type="submit" disabled={isLoading}
                        className={`w-full flex items-center justify-center py-3 px-4 rounded-xl text-white font-medium transition-all duration-200 ${
                          isLoading ? "bg-[#4F46E5]/70 cursor-not-allowed" : "bg-gradient-to-r from-[#4F46E5] to-[#60A5FA] hover:from-[#4338CA] hover:to-[#4F46E5] shadow-md hover:shadow-lg"
                        }`}>
                        {isLoading ? (
                          <div className="flex items-center">
                            {loadingSpinner}
                            <span>Signing in...</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span>Sign in</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
