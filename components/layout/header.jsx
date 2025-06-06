"use client"

import { useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Bell, Check, Globe, Moon, Search, Settings, Sun, Trash, User, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/simple-toast"

// Sub-components
const SearchBar = ({ searchQuery, setSearchQuery, handleSearch }) => (
  <form onSubmit={handleSearch} className="relative hidden md:block">
    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
    <Input
      type="search"
      placeholder="Search..."
      className="w-[300px] lg:w-[400px] pl-8"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </form>
)

const NotificationCenter = ({ notifications, unreadCount, markAllAsRead, clearNotifications }) => (
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
      <DropdownMenuLabel className="flex items-center justify-between">
        <span>Notifications</span>
        <div className="flex gap-1">
          {unreadCount > 0 && (
            <Button variant="ghost" size="icon" onClick={markAllAsRead} title="Mark all as read">
              <Check className="h-4 w-4" />
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="ghost" size="icon" onClick={clearNotifications} title="Clear all">
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <DropdownMenuItem key={notification.id} className="flex flex-col items-start py-2">
            <div className="flex items-start gap-2 w-full">
              <div
                className={`w-2 h-2 rounded-full mt-1.5 ${notification.read ? "bg-muted-foreground" : "bg-primary"}`}
              />
              <div className="flex-1">
                <p className={`text-sm ${notification.read ? "font-normal" : "font-medium"}`}>
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
            </div>
          </DropdownMenuItem>
        ))
      ) : (
        <div className="py-4 text-center text-muted-foreground">No notifications</div>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
)

const LanguageSelector = ({ languages, currentLanguage, changeLanguage }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="icon">
        <Globe className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="bg-background">
      <DropdownMenuLabel>Select Language</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {languages.map((language) => (
        <DropdownMenuItem
          key={language.code}
          onClick={() => changeLanguage(language)}
          className={currentLanguage.code === language.code ? "bg-muted" : ""}
        >
          {language.name}
          {currentLanguage.code === language.code && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
)

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
)

const UserMenu = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="bg-background">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <User className="mr-2 h-4 w-4" />
        <span>Profile</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>  
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

export function Header({ toggleSidebar }) {
  const { theme, setTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState([])
  const unreadCount = notifications.filter((n) => !n.read).length

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      toast.info({
        title: "Search initiated",
        description: `Searching for: ${searchQuery}`,
        duration: 3000,
      })
    }
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
    toast.success({
      title: "Notifications",
      description: "All notifications marked as read",
      duration: 3000,
    })
  }

  const clearNotifications = () => {
    setNotifications([])
    toast.info({
      title: "Notifications",
      description: "All notifications cleared",
      duration: 3000,
    })
  }

  const languages = [
    { code: "en", name: "English" },
    { code: "ar", name: "Arabic" },
  ]

  const [currentLanguage, setCurrentLanguage] = useState(languages[0])

  const changeLanguage = (language) => {
    setCurrentLanguage(language)
    toast.info({
      title: "Language Changed",
      description: `Language set to ${language.name}`,
      duration: 3000,
    })
  }

  return (
    <header className="h-[var(--header-height)] border-b bg-background flex items-center px-4 sticky top-0 z-10 shadow-md">
      <div className="flex items-center justify-between w-full max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 hover:text-primary transition-all duration-300">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
              I
            </div>
            <span className="font-bold text-lg hidden md:inline-block">Inventory Management</span>
          </Link>
        </div>

        <div className="flex-1 flex justify-center px-4">
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
          />
        </div>

        <div className="flex items-center">
          <div className="flex items-center gap-5 border-r pr-4 mr-5">
            <NotificationCenter
              notifications={notifications}
              unreadCount={unreadCount}
              markAllAsRead={markAllAsRead}
              clearNotifications={clearNotifications}
            />
            
            <LanguageSelector
              languages={languages}
              currentLanguage={currentLanguage}
              changeLanguage={changeLanguage}
            />
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>

          <div className="flex items-center gap">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
