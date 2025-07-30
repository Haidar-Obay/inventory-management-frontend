"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, pressed, ...props }, ref) => {
  return (
    <TogglePrimitive.Root
      ref={ref}
      className={cn(
        toggleVariants({ variant, size, className }),
        "relative w-12 h-6 p-0 bg-gray-200 dark:bg-gray-700 transition-colors duration-200 rounded-full",
        pressed ? "bg-primary/80 dark:bg-primary" : "bg-gray-200 dark:bg-gray-700"
      )}
      pressed={pressed}
      {...props}
    >
      <span
        className={cn(
          "absolute left-0 top-0 w-full h-full rounded-full transition-colors duration-200",
          pressed ? "bg-primary/20 dark:bg-primary/30" : "bg-gray-200 dark:bg-gray-700"
        )}
      />
      <span
        className={cn(
          "absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-200",
          pressed ? "bg-primary" : "bg-white"
        )}
        style={{ transform: pressed ? 'translateX(24px)' : 'translateX(0)' }}
      />
    </TogglePrimitive.Root>
  );
})

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
