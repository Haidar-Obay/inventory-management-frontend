"use client";

import React, { useState } from "react";
import { Button, Input, Badge } from "./CustomControls";
import { ActionToolbar } from "../action-toolbar.jsx";
import { SearchColumnsModal } from "./SearchColumnsModal";
import { useTranslations } from "next-intl";

export const TableToolbar = ({
  globalSearch,
  activeColumnFilters,
  columnSearch,
  handleGlobalSearch,
  handleClearGlobalSearch,
  handleClearColumnFilters,
  handleOpenColumnModal,
  onAdd,
  onExportExcel,
  onExportPdf,
  onPrint,
  onRefresh,
  onImportExcel,
  columns,
  selectedSearchColumns,
  handleSearchColumnToggle,
  handleSelectAllSearchColumns,
  visibleColumns,
}) => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const t = useTranslations("table");

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-gray-50 dark:bg-muted/50 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
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
                className="text-gray-400"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <Input
              placeholder={t("search.placeholder")}
              value={globalSearch}
              onChange={handleGlobalSearch}
              className="w-64 pl-10 text-foreground bg-background"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSearchModal(true)}
            className="h-9 px-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </Button>

          {/* Show Clear Search only if there is text in the global search */}
          {globalSearch && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearGlobalSearch}
              className="flex items-center gap-1 border-border bg-background shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              {t("search.clear")}
            </Button>
          )}

          {/* Show Clear Filters only if there are active filters */}
          {(Object.keys(activeColumnFilters).length > 0 ||
            Object.keys(columnSearch).length > 0) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearColumnFilters}
              className="flex items-center gap-1 border-border bg-background shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              {t("search.clearFilters")}
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        {/* Action Toolbar */}
        <ActionToolbar
          onAdd={onAdd}
          onExportExcel={onExportExcel}
          onExportPdf={onExportPdf}
          onPrint={onPrint}
          onRefresh={onRefresh}
          className="m-0"
          onImportExcel={onImportExcel}
          dropdownDirection="down"
        />

        {/* Replace Dropdown with Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenColumnModal}
          className="flex items-center gap-1 border-border bg-background text-foreground shadow-sm hover:bg-muted"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
          </svg>
          {t("columns.title")}
        </Button>
      </div>

      {/* Search Columns Modal */}
      <SearchColumnsModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        columns={columns}
        selectedSearchColumns={selectedSearchColumns}
        handleSearchColumnToggle={handleSearchColumnToggle}
        handleSelectAllSearchColumns={handleSelectAllSearchColumns}
        visibleColumns={visibleColumns}
      />
    </div>
  );
};
