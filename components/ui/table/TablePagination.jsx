"use client";

import React from "react";
import { Button, Input, Select } from "./CustomControls";

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
          {i}
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
            Showing{" "}
            <span className="font-medium">
              {Math.min(
                (currentPage - 1) * rowsPerPage + 1,
                filteredData.length
              )}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * rowsPerPage, filteredData.length)}
            </span>{" "}
            of <span className="font-medium">{filteredData.length}</span>{" "}
            results
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
            <span className="sr-only">First</span>
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
            <span className="sr-only">Previous</span>
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
            <span className="sr-only">Next</span>
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
            <span className="sr-only">Last</span>
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
        <div className="flex items-center space-x-1">
          <Input
            type="number"
            value={jumpToPageInput}
            onChange={handleJumpToPageInputChange}
            onKeyPress={handleJumpToPageKeyPress}
            className="h-8 w-16 rounded-md border-border text-foreground bg-background text-sm shadow-sm focus:border-primary focus:ring-primary"
            placeholder="Page"
            min="1"
            max={totalPages}
            aria-label="Jump to page"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleJumpToPage}
            className="h-8"
          >
            Go
          </Button>
        </div>
      </div>

      {/* Right: Rows per page */}
      <div className="flex-shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
            Rows per page:
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
              10
            </option>
            <option value={25} className="bg-background text-foreground">
              25
            </option>
            <option value={50} className="bg-background text-foreground">
              50
            </option>
            <option value={100} className="bg-background text-foreground">
              100
            </option>
          </Select>
        </div>
      </div>
    </div>
  );
};
