"use client"

import { useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Bell, Check, Globe, Moon, Search, Settings, Sun, Trash, User } from "lucide-react"
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
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"

export function Header({ toggleSidebar }) {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New user registered", time: "2 hours ago", read: false },
    { id: 2, message: "New order received", time: "5 hours ago", read: false },
    { id: 3, message: "Server update completed", time: "1 day ago", read: true },
    { id: 4, message: "Weekly report available", time: "2 days ago", read: true },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      toast({
        title: "Search initiated",
        description: `Searching for: ${searchQuery}`,
        className: "toast-info",
      })
    }
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
    toast({
      title: "Notifications",
      description: "All notifications marked as read",
      className: "toast-success",
    })
  }

  const clearNotifications = () => {
    setNotifications([])
    toast({
      title: "Notifications",
      description: "All notifications cleared",
      className: "toast-info",
    })
  }

  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "French" },
    { code: "es", name: "Spanish" },
    { code: "de", name: "German" },
    { code: "ar", name: "Arabic" },
  ]

  const [currentLanguage, setCurrentLanguage] = useState(languages[0])

  const changeLanguage = (language) => {
    setCurrentLanguage(language)
    toast({
      title: "Language Changed",
      description: `Language set to ${language.name}`,
      className: "toast-info",
    })
  }

  // Function to show different types of toast notifications
  const showToast = (type) => {
    const toastConfig = {
      success: {
        title: "Success",
        description: "Operation completed successfully",
        className: "toast-success",
      },
      error: {
        title: "Error",
        description: "An error occurred during the operation",
        className: "toast-error",
      },
      warning: {
        title: "Warning",
        description: "Please be cautious with this action",
        className: "toast-warning",
      },
      info: {
        title: "Information",
        description: "Here's some information you might find useful",
        className: "toast-info",
      },
    }

    toast(toastConfig[type])
  }

  return (
    <header className="h-[var(--header-height)] border-b bg-background flex items-center px-4 sticky top-0 z-10">
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center gap-2">
          <SidebarTrigger />

          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
              D
            </div>
            <span className="font-bold text-lg hidden md:inline-block">Dashboard</span>
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-[200px] lg:w-[300px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

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
            <DropdownMenuContent align="end" className="w-[300px]">
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Globe className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuItem>Notifications</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Help & Support</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  localStorage.setItem("userRole", localStorage.getItem("userRole") === "admin" ? "user" : "admin")
                  window.location.reload()
                }}
              >
                <span>Switch Role</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
