"use client";

import React from "react";
import { Button } from "./CustomControls";
import { useTranslations, useLocale } from "next-intl";
import Portal from "../Portal";

export const DeleteModal = ({ isOpen, onConfirm, onCancel }) => {
  const t = useTranslations("table");
  const locale = useLocale();
  const isRTL = locale === "ar";

  console.log('DeleteModal rendered', { isOpen, onConfirm });

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[2147483647] pointer-events-auto flex items-center justify-center bg-black/50"
        onClick={handleBackdropClick}
      >
        <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg border border-border">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-destructive">
              {t("delete.modal.title")}
            </h3>
            <button
              onClick={onCancel}
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
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            <p className="text-muted-foreground">{t("delete.modal.message")}</p>
            <div
              className="flex justify-end"
              style={{
                gap: "0.5rem",
                flexDirection: isRTL ? "row-reverse" : "row",
              }}
            >
              <Button
                variant="outline"
                onClick={onCancel}
                className="border-border"
              >
                {t("delete.modal.cancel")}
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  console.log('Confirm button clicked');
                  onConfirm();
                }}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {t("delete.modal.confirm")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};
