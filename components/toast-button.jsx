"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function ToastButton({ type }) {
  const { toast } = useToast()

  const showToast = () => {
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

  const getButtonStyle = () => {
    switch (type) {
      case "success":
        return "bg-success hover:bg-success/90 text-success-foreground"
      case "error":
        return "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
      case "warning":
        return "bg-amber-500 hover:bg-amber-500/90 text-white"
      case "info":
        return "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
      default:
        return ""
    }
  }

  return (
    <Button className={getButtonStyle()} onClick={showToast}>
      {type.charAt(0).toUpperCase() + type.slice(1)} Toast
    </Button>
  )
}
