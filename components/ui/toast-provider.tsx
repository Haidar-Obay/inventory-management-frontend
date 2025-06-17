"use client";

import { useSimpleToast, toast as toastExport } from "./simple-toast";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

export function ToastSetup() {
  const { addToast } = useSimpleToast();
  const t = useTranslations("toast");

  // Replace the placeholder implementation with actual toast functions
  useEffect(() => {
    // Override success toast
    toastExport.success = (options) => {
      addToast({
        title: options.isTranslated ? t(options.title) : options.title,
        description: options.description
          ? options.isTranslated
            ? t(options.description)
            : options.description
          : undefined,
        type: "success",
        duration: options.duration || 5000,
        isTranslated: false, // We've already translated the text
      });
    };

    // Override error toast
    toastExport.error = (options) => {
      addToast({
        title: options.isTranslated ? t(options.title) : options.title,
        description: options.description
          ? options.isTranslated
            ? t(options.description)
            : options.description
          : undefined,
        type: "error",
        duration: options.duration || 5000,
        isTranslated: false, // We've already translated the text
      });
    };

    // Override warning toast
    toastExport.warning = (options) => {
      addToast({
        title: options.isTranslated ? t(options.title) : options.title,
        description: options.description
          ? options.isTranslated
            ? t(options.description)
            : options.description
          : undefined,
        type: "warning",
        duration: options.duration || 5000,
        isTranslated: false, // We've already translated the text
      });
    };

    // Override info toast
    toastExport.info = (options) => {
      addToast({
        title: options.isTranslated ? t(options.title) : options.title,
        description: options.description
          ? options.isTranslated
            ? t(options.description)
            : options.description
          : undefined,
        type: "info",
        duration: options.duration || 5000,
        isTranslated: false, // We've already translated the text
      });
    };
  }, [addToast, t]);

  return null;
}
