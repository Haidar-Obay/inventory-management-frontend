"use client";

import React from "react";
import { useTheme } from "next-themes";
import { useTableLogic } from "./useTableLogic";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import { TablePagination } from "./TablePagination";
import { TableToolbar } from "./TableToolbar";
import { DeleteModal } from "./DeleteModal";
import { ColumnModal } from "./ColumnModal";
import { FilterModal } from "./FilterModal";
import { Badge } from "./CustomControls";

const Table = (props) => {
  const { theme } = useTheme();
  const {
    // State
    tableData,
    sortConfig,
    filters,
    columnSearch,
    globalSearch,
    visibleColumns,
    tempVisibleColumns,
    showColumnModal,
    columnOrder,
    draggedColumn,
    draggedRow,
    editingCell,
    showSettings,
    savedFilters,
    activeColumnFilters,
    isSettingsModalOpen,
    newFilterName,
    selectedColumnForFilter,
    uniqueColumnValues,
    currentPage,
    rowsPerPage,
    showSearch,
    showSearchRow,
    selectedRows,
    jumpToPageInput,
    deleteModalOpen,
    rowToDelete,
    showFilterModal,
    tempFilterConfig,
    columnFilterTypes,
    sortedData,
    filteredData,
    paginatedData,
    totalPages,
    areAllOnPageSelected,
    columnWidths,
    handleResizeStart,
    resizingColumn,
    selectedSearchColumns,
    handleSearchColumnToggle,
    handleSelectAllSearchColumns,

    // Handlers
    handleToggleSearchRow,
    handleJumpToPageInputChange,
    handleJumpToPage,
    handleJumpToPageKeyPress,
    handlePageChange,
    handleSort,
    handleColumnDragStart,
    handleColumnDragOver,
    handleRowDragStart,
    handleRowDragOver,
    handleCellDoubleClick,
    handleCellEdit,
    handleCellEditFinish,
    handleColumnVisibilityToggle,
    handleGlobalSearch,
    handleColumnSearch,
    handleFilterTypeChange,
    handleAddColumnFilter,
    handleRemoveColumnFilter,
    handleFilterValueChange,
    handleSaveFilters,
    handleLoadFilter,
    handleClearColumnFilters,
    handleClearGlobalSearch,
    handleRowSelect,
    handleSelectAll,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    handleOpenColumnModal,
    handleSaveColumnVisibility,
    handleCancelColumnVisibility,
    handleOpenFilterModal,
    handleSaveFilter,
    handleCancelFilter,

    // Setters
    setTableData,
    setSortConfig,
    setFilters,
    setColumnSearch,
    setGlobalSearch,
    setVisibleColumns,
    setTempVisibleColumns,
    setShowColumnModal,
    setColumnOrder,
    setDraggedColumn,
    setDraggedRow,
    setEditingCell,
    setShowSettings,
    setSavedFilters,
    setActiveColumnFilters,
    setIsSettingsModalOpen,
    setNewFilterName,
    setSelectedColumnForFilter,
    setUniqueColumnValues,
    setCurrentPage,
    setRowsPerPage,
    setShowSearch,
    setShowSearchRow,
    setSelectedRows,
    setJumpToPageInput,
    setDeleteModalOpen,
    setRowToDelete,
    setShowFilterModal,
    setTempFilterConfig,
    setColumnFilterTypes,
    setSelectedSearchColumns,
    setHandleSearchColumnToggle,
    setHandleSelectAllSearchColumns,
  } = useTableLogic({
    ...props,
    tableId: props.tableId || "default",
  });

  // Convert columns object to array if needed
  const columnsArray = Array.isArray(props.columns)
    ? props.columns
    : Object.values(props.columns);

  return (
    <div className="w-full rounded-lg border border-border bg-background shadow-sm">
      <DeleteModal
        isOpen={deleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {showColumnModal && (
        <ColumnModal
          isOpen={showColumnModal}
          columns={columnsArray}
          visibleColumns={tempVisibleColumns}
          onSave={handleSaveColumnVisibility}
          onCancel={handleCancelColumnVisibility}
          onToggleColumn={(columnKey, checked) => {
            setTempVisibleColumns((prev) => ({
              ...prev,
              [columnKey]: checked,
            }));
          }}
        />
      )}

      <FilterModal
        isOpen={showFilterModal}
        selectedColumn={selectedColumnForFilter}
        columns={columnsArray}
        filterType={tempFilterConfig?.type}
        filterValue={tempFilterConfig?.value}
        onSave={handleSaveFilter}
        onCancel={handleCancelFilter}
        onFilterTypeChange={handleFilterTypeChange}
        onFilterValueChange={handleFilterValueChange}
        uniqueValues={uniqueColumnValues[selectedColumnForFilter] || []}
      />

      <TableToolbar
        globalSearch={globalSearch}
        activeColumnFilters={activeColumnFilters}
        columnSearch={columnSearch}
        handleGlobalSearch={handleGlobalSearch}
        handleClearGlobalSearch={handleClearGlobalSearch}
        handleClearColumnFilters={handleClearColumnFilters}
        handleOpenColumnModal={handleOpenColumnModal}
        onAdd={props.onAdd}
        onExportExcel={props.onExportExcel}
        onExportPdf={props.onExportPdf}
        onPrint={props.onPrint}
        onRefresh={props.onRefresh}
        onImportExcel={props.onImportExcel}
        columns={columnsArray}
        selectedSearchColumns={selectedSearchColumns}
        handleSearchColumnToggle={handleSearchColumnToggle}
        handleSelectAllSearchColumns={handleSelectAllSearchColumns}
        visibleColumns={visibleColumns}
      />

      {Object.keys(activeColumnFilters).length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-gray-50 dark:bg-muted/50 p-2">
          <span className="text-xs font-medium text-gray-500">
            Active Filters:
          </span>
          {Object.entries(activeColumnFilters).map(([key, filterConfig]) => {
            const column = columnsArray.find((col) => col.key === key);
            if (!column) return null;

            return (
              <Badge
                key={key}
                variant="primary"
                className="flex items-center gap-1"
              >
                <span>{column.header}: </span>
                <span className="font-bold">{filterConfig.type}</span>
                <span>{filterConfig.value}</span>
                <button
                  onClick={() => handleRemoveColumnFilter(key)}
                  className="ml-1 rounded-full hover:bg-blue-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
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
              </Badge>
            );
          })}
        </div>
      )}

      <div className="w-full">
        <div className="overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
          <div style={{ minWidth: "max-content", width: "100%" }}>
            <table className="w-full border-collapse">
              <TableHeader
                columnOrder={columnOrder}
                columns={columnsArray}
                visibleColumns={visibleColumns}
                sortConfig={sortConfig}
                activeColumnFilters={activeColumnFilters}
                columnFilterTypes={columnFilterTypes}
                showSearchRow={showSearchRow}
                columnSearch={columnSearch}
                areAllOnPageSelected={areAllOnPageSelected}
                paginatedData={paginatedData}
                handleSort={handleSort}
                handleColumnDragStart={handleColumnDragStart}
                handleColumnDragOver={handleColumnDragOver}
                handleToggleSearchRow={handleToggleSearchRow}
                handleOpenFilterModal={handleOpenFilterModal}
                handleColumnSearch={handleColumnSearch}
                handleSelectAll={handleSelectAll}
                columnWidths={columnWidths}
                handleResizeStart={handleResizeStart}
                resizingColumn={resizingColumn}
                t={props.t}
              />

              <TableBody
                paginatedData={paginatedData}
                columns={columnsArray}
                columnOrder={columnOrder}
                visibleColumns={visibleColumns}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                selectedRows={selectedRows}
                editingCell={editingCell}
                enableCellEditing={props.enableCellEditing}
                loading={props.loading}
                handleRowDragStart={handleRowDragStart}
                handleRowDragOver={handleRowDragOver}
                handleCellDoubleClick={handleCellDoubleClick}
                handleCellEdit={handleCellEdit}
                handleCellEditFinish={handleCellEditFinish}
                handleRowSelect={handleRowSelect}
                handleDeleteClick={handleDeleteClick}
                onEdit={props.onEdit}
                columnWidths={columnWidths}
              />
            </table>
          </div>
        </div>
      </div>

      {filteredData.length > 0 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          filteredData={filteredData}
          jumpToPageInput={jumpToPageInput}
          handlePageChange={handlePageChange}
          handleJumpToPageInputChange={handleJumpToPageInputChange}
          handleJumpToPage={handleJumpToPage}
          handleJumpToPageKeyPress={handleJumpToPageKeyPress}
          setRowsPerPage={setRowsPerPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Table;
