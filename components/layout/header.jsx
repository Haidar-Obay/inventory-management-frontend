"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Bell,
  Check,
  Globe,
  Moon,
  Search,
  Settings,
  Sun,
  Trash,
  User,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/simple-toast";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

// Sub-components
const SearchBar = ({ searchQuery, setSearchQuery, handleSearch, t }) => {
  const currentLocale = useLocale();
  const isRTL = currentLocale === "ar";

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-lg mx-auto">
      <div className="relative">
        <Search
          className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground ${isRTL ? "right-3" : "left-3"}`}
        />
        <Input
          type="search"
          placeholder={t("searchPlaceholder")}
          className={`w-full h-10 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg ${isRTL ? "pr-14 pl-8" : "pl-10 pr-4"}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          type="submit"
          size="sm"
          className={`absolute top-1/2 transform -translate-y-1/2 h-8 px-3 text-xs ${isRTL ? "left-1" : "right-1"}`}
          disabled={!searchQuery.trim()}
        >
          {t("search")}
        </Button>
      </div>
    </form>
  );
};

const NotificationCenter = ({
  notifications,
  unreadCount,
  markAllAsRead,
  clearNotifications,
  t,
}) => {
  const currentLocale = useLocale();
  const isRTL = currentLocale === "ar";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px] bg-background">
        <DropdownMenuLabel
          className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <span>{t("notifications")}</span>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={markAllAsRead}
                title={t("markAllAsRead")}
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearNotifications}
                title={t("clearAll")}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex flex-col items-start py-2"
            >
              <div
                className={`flex items-start gap-2 w-full ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 ${notification.read ? "bg-muted-foreground" : "bg-primary"}`}
                />
                <div className="flex-1">
                  <p
                    className={`text-sm ${notification.read ? "font-normal" : "font-medium"}`}
                  >
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {notification.time}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            {t("noNotifications")}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const LanguageSelector = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const t = useTranslations("header");
  const isRTL = currentLocale === "ar";

  const languages = [
    { code: "en", name: "English", direction: "ltr" },
    { code: "ar", name: "العربية", direction: "rtl" },
  ];

  const changeLanguage = (language) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${language.code}`);
    document.documentElement.dir = language.direction;
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] bg-background">
        <DropdownMenuLabel className={isRTL ? "text-right" : ""}>
          {t("selectLanguage")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language)}
            className={`flex items-center gap-2 ${currentLocale === language.code ? "bg-muted" : ""} ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span>{language.name}</span>
            {currentLocale === language.code && (
              <Check className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ThemeToggle = ({ theme, setTheme }) => (
  <Button
    variant="outline"
    size="icon"
    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    className="relative"
  >
    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    <span className="sr-only">Toggle theme</span>
  </Button>
);

const UserMenu = ({ t }) => {
  const currentLocale = useLocale();
  const isRTL = currentLocale === "ar";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full p-0 hover:bg-muted"
        >
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background">
        <DropdownMenuLabel
          className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <span>{t("myAccount")}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <User className="h-4 w-4" />
          <span>{t("profile")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <LogOut className="h-4 w-4" />
          <span>{t("logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export function Header({ toggleSidebar }) {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const t = useTranslations("header");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info({
        title: "searchInitiated",
        description: "searchingFor",
        duration: 3000,
        isTranslated: true,
      });
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success({
      title: "notificationsRead",
      duration: 3000,
      isTranslated: true,
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    toast.info({
      title: "notificationsCleared",
      duration: 3000,
      isTranslated: true,
    });
  };

  return (
    <header className="w-full h-16 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div
        className="flex h-full items-center px-4 gap-4"
        style={{ transition: "all 0.3s ease-in-out" }}
      >
        {/* Left Section - Breadcrumbs */}
        <div className="flex items-center gap-4 flex-shrink-0 w-96">
          <Breadcrumbs className="font-medium" />
        </div>

        {/* Center Section - Search Bar */}
        <div className="flex-1 flex justify-center px-4 min-w-0">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            t={t}
          />
        </div>

        {/* Right Section - User Controls */}
        <div className="flex items-center gap-2 flex-shrink-0 w-48">
          <LanguageSelector />
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <NotificationCenter
            notifications={notifications}
            unreadCount={unreadCount}
            markAllAsRead={markAllAsRead}
            clearNotifications={clearNotifications}
            t={t}
          />
          <UserMenu t={t} />
        </div>
      </div>
    </header>
  );
}
