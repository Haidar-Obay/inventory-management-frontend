"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import tenantApiService from "@/API/TenantApiService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomBackground } from "@/components/ui/backgrounds";
import {
  Building2,
  Mail,
  Lock,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Globe,
  Moon,
  Sun,
} from "lucide-react";
import Cookies from "js-cookie";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

const TENANT_TOKEN_KEY = "tenant_token";

// Animation variants moved outside component to prevent recreation on each render
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function TenantLogin() {
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const t = useTranslations("login");
  const [currentLanguage, setCurrentLanguage] = useState({
    code: locale,
    name: locale === "en" ? "English" : "Arabic",
  });
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
    const subdomain = hostname.split(".")[0];
    setTenantName(
      subdomain === "localhost"
        ? "Your"
        : subdomain.charAt(0).toUpperCase() + subdomain.slice(1)
    );
  }, []);

  const languages = [
    { code: "en", name: "English" },
    { code: "ar", name: "Arabic" },
  ];

  const changeLanguage = (language) => {
    setCurrentLanguage(language);
    const newPath = window.location.pathname.replace(
      `/${locale}`,
      `/${language.code}`
    );
    window.location.href = newPath;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await tenantApiService("POST", "login", {
        email,
        password,
      });
      if (response.access_token) {
        Cookies.set(TENANT_TOKEN_KEY, response.access_token, { expires: 7 });
        setLoginSuccess(true);
        setTimeout(() => {
          router.push("/main/dashboard/overview");
        }, 2000);
      }
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize the loading spinner
  const loadingSpinner = useMemo(
    () => (
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
    ),
    []
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-background">
      <CustomBackground className="absolute inset-0 -z-10 opacity-50" />

      {/* Add toolbar */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Globe className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background">
            <DropdownMenuLabel>{t("selectLanguage")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {languages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => changeLanguage(language)}
                className={
                  currentLanguage.code === language.code ? "bg-muted" : ""
                }
              >
                {language.name}
                {currentLanguage.code === language.code && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{t("toggleTheme")}</span>
        </Button>
      </div>

      <motion.div
        className="w-full max-w-md px-4"
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
              className="bg-card rounded-2xl shadow-xl overflow-hidden p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.1,
                }}
                className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-[#10B981]/10 mb-4"
              >
                <Check className="w-8 h-8 text-[#10B981]" />
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {t("loginSuccess")}
              </h2>
              <p className="text-muted-foreground mb-6">{t("redirecting")}</p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
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
              className="bg-card rounded-2xl shadow-xl overflow-hidden"
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="p-8">
                <div className="text-center mb-8">
                  <motion.h2
                    className="text-2xl font-bold text-foreground"
                    variants={itemVariants}
                  >
                    {t("title")}
                  </motion.h2>
                  <motion.p
                    className="text-sm text-muted-foreground mt-1"
                    variants={itemVariants}
                  >
                    {t("subtitle")}
                  </motion.p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <motion.div
                      className="mb-6 p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center"
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

                  <motion.div className="space-y-5" variants={formVariants}>
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-foreground"
                      >
                        {t("email")}
                      </label>
                      <div className="relative group">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                          <Mail className="h-5 w-5 min-w-5 min-h-5 text-muted-foreground group-focus-within:text-[#4F46E5] transition-colors duration-200" />
                        </span>
                        <Input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full pl-10 pr-3 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all duration-200 text-foreground bg-background"
                          placeholder={t("emailPlaceholder")}
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <div className="flex justify-between">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-foreground"
                        >
                          {t("password")}
                        </label>
                        <a
                          href="/forgot-password"
                          className="text-sm text-[#4F46E5] hover:text-[#4338CA] transition-colors duration-200"
                        >
                          {t("forgotPassword")}
                        </a>
                      </div>
                      <div className="relative group">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                          <Lock className="h-5 w-5 min-w-5 min-h-5 text-muted-foreground group-focus-within:text-[#4F46E5] transition-colors duration-200" />
                        </span>
                        <Input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="block w-full pl-10 pr-10 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all duration-200 text-foreground bg-background"
                          placeholder={t("passwordPlaceholder")}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-[#4F46E5] transition-colors duration-200"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </motion.div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full flex items-center justify-center py-3 px-4 rounded-xl text-white font-medium transition-all duration-200 ${
                        isLoading
                          ? "bg-[#4F46E5]/70 cursor-not-allowed"
                          : "bg-gradient-to-r from-[#4F46E5] to-[#60A5FA] hover:from-[#4338CA] hover:to-[#4F46E5] shadow-md hover:shadow-lg"
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          {loadingSpinner}
                          <span>{t("signingIn")}</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span>{t("signIn")}</span>
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
  );
}
