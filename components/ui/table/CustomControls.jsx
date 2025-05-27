"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

// Utility function to check if an element is a descendant of another
const isDescendant = (parent, child) => {
  let node = child;
  while (node !== null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
};

export const Button = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  onClick,
  ...props
}) => {
  const { theme } = useTheme();
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50";

  const variantStyles = {
    default: "bg-muted text-foreground hover:bg-muted/80",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-border bg-transparent hover:bg-muted",
    ghost: "bg-transparent hover:bg-muted",
    link: "bg-transparent underline-offset-4 hover:underline text-primary",
  };

  const sizeStyles = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-10 px-5 text-base",
    icon: "h-9 w-9",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({ className = "", type = "text", ...props }) => {
  const { theme } = useTheme();
  return (
    <input
      type={type}
      className={`flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

export const Select = ({ children, className = "", ...props }) => {
  const { theme } = useTheme();
  return (
    <select
      className={`flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

export const Checkbox = ({ className = "", ...props }) => {
  const { theme } = useTheme();
  return (
    <input
      type="checkbox"
      className={`h-4 w-4 rounded border-border text-primary focus:ring-primary ${className}`}
      {...props}
    />
  );
};

export const Tooltip = ({ children, content, position = "top" }) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);

  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 whitespace-nowrap rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground shadow-md ${positions[position]}`}
        >
          {content}
          <div
            className={`absolute ${
              position === "top"
                ? "top-full left-1/2 -translate-x-1/2 border-t-muted"
                : position === "bottom"
                  ? "bottom-full left-1/2 -translate-x-1/2 border-b-muted"
                  : position === "left"
                    ? "left-full top-1/2 -translate-y-1/2 border-l-muted"
                    : "right-full top-1/2 -translate-y-1/2 border-r-muted"
            } border-4 border-transparent`}
          />
        </div>
      )}
    </div>
  );
};

export const Dropdown = ({ trigger, children, align = "left" }) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const alignments = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2",
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !isDescendant(dropdownRef.current, event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute z-50 mt-1 min-w-[12rem] rounded-md border border-border bg-background p-1 shadow-md ${alignments[align]}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ children, onClick }) => {
  const { theme } = useTheme();
  return (
    <div
      className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm text-foreground hover:bg-muted"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const Badge = ({ children, variant = "default", className = "" }) => {
  const { theme } = useTheme();
  const variantStyles = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    success: "bg-success text-success-foreground",
    danger: "bg-destructive text-destructive-foreground",
    warning: "bg-warning text-warning-foreground",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const DatePicker = ({ value, onChange, className = "" }) => {
  const { theme } = useTheme();
  return (
    <input
      type="date"
      value={value || ""}
      onChange={onChange}
      className={`flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
  );
};

export const Modal = ({ isOpen, onClose, title, children }) => {
  const { theme } = useTheme();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg border border-border">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-muted text-muted-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// export {
//   Button,
//   Input,
//   Select,
//   Checkbox,
//   Tooltip,
//   Dropdown,
//   DropdownItem,
//   Badge,
//   DatePicker,
//   Modal,
// };
