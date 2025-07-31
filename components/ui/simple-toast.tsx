"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

// Define toast types and interface
type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
  remainingTime?: number;
  isPaused?: boolean;
  isExiting?: boolean;
  isTranslated?: boolean;
}

// Create a toast context
interface ToastContextProps {
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  pauseToast: (id: string) => void;
  resumeToast: (id: string) => void;
  startRemoveToast: (id: string) => void;
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

// Toast provider component
export function SimpleToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutsRef = useRef<
    Map<string, { timeoutId: NodeJS.Timeout; startTime: number }>
  >(new Map());

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id, isPaused: false, isExiting: false };

    setToasts((prev) => [...prev, newToast]);

    if (toast.duration && toast.duration > 0) {
      const timeoutId = setTimeout(() => {
        startRemoveToast(id);
      }, toast.duration);

      timeoutsRef.current.set(id, {
        timeoutId,
        startTime: Date.now(),
      });
    }
  };

  const startRemoveToast = (id: string) => {
    // Mark the toast as exiting to trigger animation
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, isExiting: true } : toast
      )
    );

    // Actually remove after animation completes
    setTimeout(() => {
      removeToast(id);
    }, 300); // Match animation duration
  };

  const removeToast = (id: string) => {
    // Clear any existing timeout
    const timeoutData = timeoutsRef.current.get(id);
    if (timeoutData) {
      clearTimeout(timeoutData.timeoutId);
      timeoutsRef.current.delete(id);
    }

    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const pauseToast = (id: string) => {
    const timeoutData = timeoutsRef.current.get(id);

    if (timeoutData) {
      // Clear the current timeout
      clearTimeout(timeoutData.timeoutId);

      // Calculate the remaining time
      const elapsedTime = Date.now() - timeoutData.startTime;
      const toast = toasts.find((t) => t.id === id);

      if (toast && toast.duration) {
        const remainingTime = Math.max(0, toast.duration - elapsedTime);

        // Update the toast with remaining time and paused state
        setToasts((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, remainingTime, isPaused: true } : t
          )
        );

        // Keep the updated timeout data without an active timeout
        timeoutsRef.current.set(id, {
          timeoutId: undefined as unknown as NodeJS.Timeout,
          startTime: timeoutData.startTime,
        });
      }
    }
  };

  const resumeToast = (id: string) => {
    const toast = toasts.find((t) => t.id === id);

    if (toast && toast.isPaused && toast.remainingTime) {
      // Create a new timeout with the remaining time
      const timeoutId = setTimeout(() => {
        startRemoveToast(id);
      }, toast.remainingTime);

      // Update the timeout reference
      timeoutsRef.current.set(id, {
        timeoutId,
        startTime: Date.now() - (toast.duration! - toast.remainingTime),
      });

      // Update the toast to unpause it
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isPaused: false } : t))
      );
    }
  };

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(({ timeoutId }) => {
        clearTimeout(timeoutId);
      });
    };
  }, []);

  return (
    <ToastContext.Provider
      value={{
        addToast,
        removeToast,
        pauseToast,
        resumeToast,
        toasts,
        startRemoveToast,
      }}
    >
      {children}
      <SimpleToastContainer />
    </ToastContext.Provider>
  );
}

// Hook to use toast
export function useSimpleToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useSimpleToast must be used within a SimpleToastProvider");
  }
  return context;
}

// Toast icon component
const ToastIcon = ({ type }: { type: ToastType }) => {
  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <Info size={20} />,
  };

  return <div className="mr-2.5 flex-shrink-0 mt-0.5">{icons[type]}</div>;
};

// Toast component
function SimpleToastItem({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: () => void;
}) {
  const [progress, setProgress] = useState(100);
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { pauseToast, resumeToast } = useSimpleToast();
  const t = useTranslations("toast");

  useEffect(() => {
    // Add a tiny delay to trigger the animation properly
    const timer = setTimeout(() => {
      setVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      if (!isHovered) {
        intervalRef.current = setInterval(() => {
          setProgress((prev) => {
            const newProgress = prev - (100 / (toast.duration || 5000)) * 100;
            return newProgress <= 0 ? 0 : newProgress;
          });
        }, 100);
      }

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [toast.duration, isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    pauseToast(toast.id);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    resumeToast(toast.id);
  };

  // Define toast CSS classes
  const toastTypeClass = `toast-${toast.type}`;

  const animationStyles = {
    opacity: toast.isExiting ? 0 : visible ? 1 : 0,
    transform: toast.isExiting
      ? "translateY(16px)"
      : visible
        ? "translateY(0)"
        : "translateY(16px)",
    transition:
      "opacity 250ms cubic-bezier(0.16, 1, 0.3, 1), transform 250ms cubic-bezier(0.16, 1, 0.3, 1)",
  };

  // Get the title and description text
  const getTitle = () => {
    return toast.title;
  };

  const getDescription = () => {
    return toast.description || "";
  };

  return (
    <div
      style={animationStyles}
      className={cn("toast-item", toastTypeClass)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex w-full items-start">
        <ToastIcon type={toast.type} />

        <div className="flex-1 mr-2">
          <div className="font-semibold text-sm leading-tight">
            {getTitle()}
          </div>
          {toast.description && (
            <div className="text-sm mt-0.5 opacity-90 font-normal leading-snug">
              {getDescription()}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="toast-close-button flex-shrink-0 self-start ml-1"
          aria-label={t("close")}
        >
          <X size={16} />
        </button>
      </div>

      {toast.duration && toast.duration > 0 && (
        <div
          className="toast-progress absolute bottom-0 left-0"
          style={{
            width: `${progress}%`,
            transition: isHovered ? "none" : "width 80ms linear",
          }}
        />
      )}
    </div>
  );
}

// Toast container component
function SimpleToastContainer() {
  const { toasts, startRemoveToast } = useSimpleToast();

  return (
    <div className="toast-container" data-nextjs-scroll-focus-boundary>
      {toasts.map((toast) => (
        <SimpleToastItem
          key={toast.id}
          toast={toast}
          onClose={() => startRemoveToast(toast.id)}
        />
      ))}
    </div>
  );
}

// Create and export a toast object
const internalToast = {
  success: (options: {
    title: string;
    description?: string;
    duration?: number;
    isTranslated?: boolean;
  }) => {
    // This implementation will be replaced at runtime
  },
  error: (options: {
    title: string;
    description?: string;
    duration?: number;
    isTranslated?: boolean;
  }) => {
    // This implementation will be replaced at runtime
  },
  warning: (options: {
    title: string;
    description?: string;
    duration?: number;
    isTranslated?: boolean;
  }) => {
    // This implementation will be replaced at runtime
  },
  info: (options: {
    title: string;
    description?: string;
    duration?: number;
    isTranslated?: boolean;
  }) => {
    // This implementation will be replaced at runtime
  },
};

export { internalToast as toast };
