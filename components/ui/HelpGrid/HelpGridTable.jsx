"use client";

import React from "react";
import HelpGridHeader from "./HelpGridHeader";
import HelpGridBody from "./HelpGridBody";

const HelpGridTable = ({ 
  tableAttributes, 
  paginatedData, 
  sortConfig, 
  onSort,
  selectedRows,
  onRowSelect,
  areAllOnPageSelected,
  onSelectAll,
  showSearchColumn,
  showSearchRow,
  onToggleSearchColumn,
  onToggleSearchRow,
  isItemAlreadyAdded, // New prop for checking if item is already added
  onSearchValueChange, // New prop for handling search value changes
  searchValues, // New prop for current search values
  // Drag and drop props
  draggedRow,
  dragOverRow,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  // Filter props
  activeColumnFilters,
  onOpenFilterModal,
  onClearColumnFilter
}) => {
  if (!tableAttributes) return null;

  return (
    <div className="border border-border rounded-lg overflow-hidden h-full flex flex-col">
      <div className="overflow-x-auto overflow-y-auto flex-1">
        <table className="w-full border-collapse">
          {/* Header */}
          <HelpGridHeader
            columns={tableAttributes.columns}
            sortConfig={sortConfig}
            onSort={onSort}
            selectedRows={selectedRows}
            onRowSelect={onRowSelect}
            areAllOnPageSelected={areAllOnPageSelected}
            onSelectAll={onSelectAll}
            showSearchColumn={showSearchColumn}
            showSearchRow={showSearchRow}
            onToggleSearchColumn={onToggleSearchColumn}
            onToggleSearchRow={onToggleSearchRow}
            paginatedData={paginatedData}
            isItemAlreadyAdded={isItemAlreadyAdded}
            onSearchValueChange={onSearchValueChange}
            searchValues={searchValues}
            // Filter props
            activeColumnFilters={activeColumnFilters}
            onOpenFilterModal={onOpenFilterModal}
            onClearColumnFilter={onClearColumnFilter}
          />
          
          {/* Body */}
          <HelpGridBody
            columns={tableAttributes.columns}
            data={paginatedData}
            loading={tableAttributes.loading}
            selectedRows={selectedRows}
            onRowSelect={onRowSelect}
            showSearchColumn={showSearchColumn}
            showSearchRow={showSearchRow}
            isItemAlreadyAdded={isItemAlreadyAdded}
            // Drag and drop props
            draggedRow={draggedRow}
            dragOverRow={dragOverRow}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
          />
        </table>
      </div>
    </div>
  );
};

export default HelpGridTable;
