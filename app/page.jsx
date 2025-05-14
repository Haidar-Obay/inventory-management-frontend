"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome to your dashboard. Here's an overview of your activity.</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>User growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">2,345</div>
            <p className="text-sm text-green-500">+12% from last month</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Monthly revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">$34,567</div>
            <p className="text-sm text-green-500">+8% from last month</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>Current active projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">12</div>
            <p className="text-sm text-amber-500">Same as last month</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Toast Notifications</span>
          </CardTitle>
          <CardDescription>Test different types of toast notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <ToastButton type="success" />
            <ToastButton type="error" />
            <ToastButton type="warning" />
            <ToastButton type="info" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent actions and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center gap-4 p-3 rounded-lg border">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div>
                  <p className="font-medium">Activity {item}</p>
                  <p className="text-sm text-muted-foreground">This is a sample activity description</p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">2h ago</div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">View All Activity</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Client component for toast buttons
function ToastButton({ type }) {
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
