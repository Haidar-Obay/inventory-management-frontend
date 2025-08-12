"use client";

import React from "react";

const HelpGridPagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  rowsPerPage, 
  onPageChange,
  onRowsPerPageChange,
  jumpToPageInput,
  onJumpToPageInputChange,
  onJumpToPage,
  onJumpToPageKeyPress
}) => {
  // No automatic population - input is fully controlled by user interaction
  const startItem = ((currentPage - 1) * rowsPerPage) + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= 1) {
      // Only one page or no pages
      return [1];
    }
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart page range
      if (currentPage <= 3) {
        // Near start: show 1, 2, 3, 4, 5, ..., last
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end: show 1, ..., last-4, last-3, last-2, last-1, last
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle: show 1, ..., current-1, current, current+1, ..., last
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between min-h-[32px] py-1">
      {/* Left side - Rows per page and info */}
      <div className="flex items-center gap-3">
        {/* Rows per page selector */}
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange && onRowsPerPageChange(Number(e.target.value))}
            className="px-2 py-1 text-sm border border-border rounded bg-background text-foreground focus:ring-1 focus:ring-ring focus:border-transparent"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        
        {/* Results info */}
        <div className="text-sm text-muted-foreground">
          {totalItems === 0 ? (
            'No results'
          ) : (
            `Showing ${startItem} to ${endItem} of ${totalItems} result${totalItems === 1 ? '' : 's'}`
          )}
        </div>
      </div>

      {/* Right side - Pagination controls - Always visible */}
      <div className="flex items-center gap-1">
                  {/* First page button */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || totalPages <= 1}
            className="px-2 py-1 text-sm border border-border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
            title="First page"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 19l-7-7 7-7" />
            </svg>
          </button>

        {/* Previous page button */}
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1 || totalPages <= 1}
          className="px-2 py-1 text-sm border border-border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
          title="Previous page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-0.5">
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-2 py-1 text-sm text-muted-foreground">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-1 text-sm border rounded transition-colors ${
                    currentPage === page
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-foreground hover:bg-muted'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next page button */}
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages <= 1}
          className="px-2 py-1 text-sm border border-border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
          title="Next page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Last page button */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages <= 1}
          className="px-2 py-1 text-sm border border-border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
          title="Last page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5l7 7-7 7" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7" />
          </svg>
        </button>
      </div>

              {/* Jump to page input */}
        <div className="flex items-center space-x-0.5 relative ml-3">
          <button
            type="button"
            onClick={() => {
              // If input is empty, first show current page
              if (!jumpToPageInput || jumpToPageInput === "") {
                onJumpToPageInputChange({ target: { value: currentPage.toString() } });
                return;
              }
              
              // Then apply decrement
              let value = Number(jumpToPageInput) - 1;
              if (value < 1) value = 1;
              onJumpToPageInputChange({
                target: { value: value.toString() },
              });
            }}
            className="h-8 w-8 flex items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-muted focus:outline-none"
            tabIndex={-1}
            aria-label="Decrement"
          >
            -
          </button>
          <input
            type="text"
            value={jumpToPageInput || ""}
            onChange={(e) => {
              const inputValue = e.target.value;
              // Allow empty input for better UX
              if (inputValue === "") {
                onJumpToPageInputChange({ target: { value: "" } });
                return;
              }
              
              // Only allow numbers
              let value = inputValue.replace(/[^0-9]/g, "");
              
              // If no valid number, don't update
              if (value === "") {
                return;
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
              
              onJumpToPageInputChange({ target: { value } });
            }}
            onKeyPress={onJumpToPageKeyPress}
            style={{
              width: "95px",
              height: "2rem",
              borderRadius: "0.375rem",
            }}
            className="text-sm shadow-sm border border-border text-center text-foreground bg-background focus:border-primary focus:ring-primary"
            placeholder="Jump to"
            min="1"
            max={totalPages}
            aria-label="Jump to page"
            inputMode="numeric"
          />
          <button
            type="button"
            onClick={() => {
              // If input is empty, first show current page
              if (!jumpToPageInput || jumpToPageInput === "") {
                onJumpToPageInputChange({ target: { value: currentPage.toString() } });
                return;
              }
              
              // Then apply increment
              let value = Number(jumpToPageInput) + 1;
              if (value > totalPages) value = totalPages;
              onJumpToPageInputChange({
                target: { value: value.toString() },
              });
            }}
            className="h-8 w-8 flex items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-muted focus:outline-none"
            tabIndex={-1}
            aria-label="Increment"
          >
            +
          </button>
          <button
            onClick={onJumpToPage}
            className="h-8 px-3 text-sm border border-border rounded hover:bg-muted text-foreground transition-colors"
          >
            Go
          </button>
        </div>
    </div>
  );
};

export default HelpGridPagination;
