"use client";

import React from "react";
import { Button, Input, Select } from "./CustomControls";
import { useTranslations, useLocale } from "next-intl";

// Function to convert numbers to Arabic numerals
const toArabicNumeral = (num) => {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num.toString().replace(/[0-9]/g, (d) => arabicNumerals[d]);
};

// Function to convert Arabic numerals to English numerals
const toEnglishNumeral = (num) => {
  const englishNumerals = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  return num
    .toString()
    .replace(
      /[\u0660-\u0669]/g,
      (d) => englishNumerals[d.charCodeAt(0) - 0x0660]
    );
};

const formatNumber = (num, locale) => {
  if (locale === "ar") return toArabicNumeral(num);
  return num;
};

export const TablePagination = ({
  currentPage,
  totalPages,
  rowsPerPage,
  filteredData,
  jumpToPageInput,
  handlePageChange,
  handleJumpToPageInputChange,
  handleJumpToPage,
  handleJumpToPageKeyPress,
  setRowsPerPage,
  setCurrentPage,
}) => {
  const t = useTranslations("table.pagination");
  const locale = useLocale();

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Button
          key={i}
          variant={currentPage === i ? "primary" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className={`${
            currentPage === i
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "border-border"
          }`}
        >
          {formatNumber(i, locale)}
        </Button>
      );
    }

    return items;
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border bg-background px-4 py-3">
      {/* Left: Showing X to Y of Z results */}
      <div className="flex-shrink-0">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            {t("showing")}{" "}
            <span className="font-medium">
              {formatNumber(
                Math.min(
                  (currentPage - 1) * rowsPerPage + 1,
                  filteredData.length
                ),
                locale
              )}
            </span>{" "}
            {t("to")}{" "}
            <span className="font-medium">
              {formatNumber(
                Math.min(currentPage * rowsPerPage, filteredData.length),
                locale
              )}
            </span>{" "}
            {t("of")}{" "}
            <span className="font-medium">
              {formatNumber(filteredData.length, locale)}
            </span>{" "}
            {t("results")}
          </span>
        </div>
      </div>

      {/* Middle: Pagination buttons & Go to page input */}
      <div className="flex flex-grow items-center justify-center gap-x-4 gap-y-2 sm:flex-grow-0">
        <nav
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="rounded-l-md"
          >
            <span className="sr-only">{t("first")}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="11 17 6 12 11 7"></polyline>
              <polyline points="17 17 12 12 17 7"></polyline>
            </svg>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">{t("previous")}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </Button>

          {/* Page numbers */}
          {renderPaginationItems()}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <span className="sr-only">{t("next")}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-r-md"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <span className="sr-only">{t("last")}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="13 17 18 12 13 7"></polyline>
              <polyline points="6 17 11 12 6 7"></polyline>
            </svg>
          </Button>
        </nav>
        {/* Jump to page input */}
        <div className="flex items-center space-x-1 relative">
          <button
            type="button"
            onClick={() => {
              let value = Number(jumpToPageInput) - 1;
              if (value < 1) value = 1;
              handleJumpToPageInputChange({
                target: { value: value.toString() },
              });
            }}
            className="h-8 w-8 flex items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-muted focus:outline-none"
            tabIndex={-1}
            aria-label="Decrement"
          >
            -
          </button>
          <Input
            type="text"
            value={jumpToPageInput}
            onChange={(e) => {
              // Only allow numbers
              let value = e.target.value.replace(/[^0-9\u0660-\u0669]/g, "");
              // Convert Arabic numerals to English for logic
              if (locale === "ar") {
                value = toEnglishNumeral(value);
              }
              // Prevent leading zeros
              value = value.replace(/^0+/, "");
              // Clamp value between 1 and totalPages
              if (value) {
                const numValue = Number(value);
                if (numValue > totalPages) {
                  value = totalPages.toString();
                } else if (numValue < 1) {
                  value = "1";
                }
              }
              handleJumpToPageInputChange({ target: { value } });
            }}
            onKeyPress={handleJumpToPageKeyPress}
            style={{
              width: "95px",
              height: "2rem",
              borderRadius: "0.375rem",
              ...(locale === "ar"
                ? {
                    color: "transparent",
                    textShadow: "none",
                    caretColor: "#fff",
                  }
                : {}),
            }}
            className="text-sm shadow-sm focus:border-primary focus:ring-primary pr-6 text-center border-border text-foreground bg-background"
            placeholder={t("jumpTo")}
            min="1"
            max={totalPages}
            aria-label="Jump to page"
            inputMode="numeric"
          />
          {locale === "ar" && (
            <span
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                color: "var(--foreground, #fff)",
                fontSize: "1rem",
                fontWeight: 500,
                direction: "ltr",
                letterSpacing: "0.05em",
                textAlign: "center",
              }}
            >
              {toArabicNumeral(jumpToPageInput)}
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              let value = Number(jumpToPageInput) + 1;
              if (value > totalPages) value = totalPages;
              handleJumpToPageInputChange({
                target: { value: value.toString() },
              });
            }}
            className="h-8 w-8 flex items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-muted focus:outline-none"
            tabIndex={-1}
            aria-label="Increment"
          >
            +
          </button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleJumpToPage}
            className="h-8 px-3"
          >
            {t("go")}
          </Button>
        </div>
      </div>

      {/* Right: Rows per page */}
      <div className="flex-shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
            {t("rowsPerPage")}:
          </span>
          <Select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="h-8 w-16 text-foreground bg-background"
          >
            <option value={10} className="bg-background text-foreground">
              {formatNumber(10, locale)}
            </option>
            <option value={25} className="bg-background text-foreground">
              {formatNumber(25, locale)}
            </option>
            <option value={50} className="bg-background text-foreground">
              {formatNumber(50, locale)}
            </option>
            <option value={100} className="bg-background text-foreground">
              {formatNumber(100, locale)}
            </option>
          </Select>
        </div>
      </div>
    </div>
  );
};
