"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation";
import CentralApiService from "@/API/CentralApiService";
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { CustomBackground } from "@/components/ui/backgrounds"
import { Shield, Mail, Lock, ArrowRight, Check } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formTouched, setFormTouched] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [token, setToken] = useState(null);
  const router = useRouter();

  // Validate email format
  const isEmailValid = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setFormTouched(true)
    setIsLoading(true)
    try {
      const data = await CentralApiService("post", "login", { email, password });
      console.log("Login Response:", data);
      localStorage.setItem("central_token", data.access_token);
      setToken(data.token);
      setLoginSuccess(true);
      
      // Add a delay before redirecting to show the success message
      setTimeout(() => {
        router.push("/central");
      }, 2000);
    } catch (err) {
      setError("Login failed: " + err.message);
      console.error("Login Error:", err);
      setIsLoading(false);
    }
  };

  // Optimized animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4 },
    },
  }

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-gray-50">
      {/* Animated background */}
      <CustomBackground className="absolute inset-0 -z-10" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4F46E5] via-[#60A5FA] to-[#4F46E5] bg-gradient-animate"></div>

      <motion.div
        className="w-full max-w-md relative z-10 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {loginSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-background rounded-xl shadow-xl overflow-hidden p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-[#10B981]/10 mb-4"
              >
                <Check className="w-8 h-8 text-[#10B981]" />
              </motion.div>
              <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Login Successful!</h2>
              <p className="text-gray-500 mb-6">You are being redirected to your dashboard...</p>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-[#4F46E5] to-[#60A5FA]"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              className="bg-background rounded-xl shadow-xl overflow-hidden"
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Gradient header */}
              <div className="h-2 bg-gradient-to-r from-[#4F46E5] via-[#60A5FA] to-[#4F46E5] bg-gradient-animate"></div>

              <div className="p-8">
                <div className="text-center mb-8">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#4F46E5]/10 to-[#60A5FA]/10 mb-4"
                    variants={itemVariants}
                  >
                    <Shield className="h-8 w-8 text-[#4F46E5]" />
                  </motion.div>
                  <motion.h1 className="text-2xl font-bold text-[#1F2937]" variants={itemVariants}>
                    Welcome Back
                  </motion.h1>
                  <motion.p className="text-sm text-gray-500 mt-1" variants={itemVariants}>
                    Please enter your credentials to access your account
                  </motion.p>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="mb-6 p-3 rounded-lg bg-[#F43F5E]/10 text-[#F43F5E] text-sm flex items-center"
                      initial={{ opacity: 0, height: 0, y: -5 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg
                        className="w-5 h-5 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit}>
                  <motion.div className="space-y-5" variants={formVariants}>
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <label htmlFor="email" className="block text-sm font-medium text-[#1F2937]">
                        Email Address
                      </label>
                      <div className="relative group">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                          <Mail className="h-5 w-5 min-w-5 min-h-5 text-gray-400 group-focus-within:text-[#4F46E5] transition-colors duration-200" />
                        </span>
                        <Input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all duration-200 text-[#1F2937]"
                          placeholder="name@example.com"
                          required
                        />
                        {email && !isEmailValid(email) && (
                          <span className="absolute inset-y-0 right-0 pr-3 flex items-center z-20">
                            <div className="h-5 w-5 text-[#F43F5E]">⚠️</div>
                          </span>
                        )}
                      </div>
                      <AnimatePresence>
                        {email && !isEmailValid(email) && (
                          <motion.p
                            className="mt-1 text-xs text-[#F43F5E]"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            Please enter a valid email address
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <div className="flex justify-between">
                        <label htmlFor="password" className="block text-sm font-medium text-[#1F2937]">
                          Password
                        </label>
                        <Link
                          href="/forgot-password"
                          className="text-sm text-[#2563EB] hover:text-[#4F46E5] transition-colors duration-200"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative group">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                          <Lock className="h-5 w-5 min-w-5 min-h-5 text-gray-400 group-focus-within:text-[#4F46E5] transition-colors duration-200" />
                        </span>
                        <Input
                          type="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          showPassword={showPassword}
                          onTogglePassword={() => setShowPassword(!showPassword)}
                          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all duration-200 text-[#1F2937]"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div className="flex items-center" variants={itemVariants}>
                      <Checkbox
                        id="remember-me"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className="h-4 w-4 text-[#4F46E5] focus:ring-[#4F46E5] border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                        Remember me for 30 days
                      </label>
                    </motion.div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${
                        isLoading
                          ? "bg-[#4F46E5]/70 cursor-not-allowed"
                          : "bg-[#4F46E5] hover:bg-[#4338CA] shadow-md hover:shadow-lg"
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
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

                <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link
                      href="/register"  
                      className="font-medium text-[#2563EB] hover:text-[#4F46E5] transition-colors duration-200"
                    >
                      Create an account
                    </Link>
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={itemVariants} className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-[#2563EB] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#2563EB] hover:underline">
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
} 