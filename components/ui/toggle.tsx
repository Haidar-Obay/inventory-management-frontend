"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ToggleProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  isRTL?: boolean;
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, description, isRTL = false, ...props }, ref) => {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            className={cn(
              "h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary",
              className
            )}
            ref={ref}
            {...props}
          />
          <span className="text-sm font-medium text-foreground">
            {props.checked ? "Yes" : "No"}
          </span>
        </div>
        {(label || description) && (
          <div
            className={`flex flex-col ${isRTL ? "text-right" : "text-left"}`}
          >
            {label && (
              <label className="text-sm font-medium text-foreground cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Toggle.displayName = "Toggle";

export { Toggle };
