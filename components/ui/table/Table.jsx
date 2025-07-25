"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useTableLogic } from "./useTableLogic";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import { TablePagination } from "./TablePagination";
import { TableToolbar } from "./TableToolbar";
import { DeleteModal } from "./DeleteModal";
import { ColumnModal } from "./ColumnModal";
import { FilterModal } from "./FilterModal";
import PreviewModal from "./PreviewModal";
import { Badge } from "./CustomControls";

const Table = (props) => {
  const { theme } = useTheme();
  const {
    customActions = [],
    onCustomAction,
    ...tableProps
  } = props;
  
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
    showSearchColumn,
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
    selectedSearchColumns,
    tempColumnWidths,
    tempColumnOrder,

    // Handlers
    handleSearchColumnToggle,
    handleSelectAllSearchColumns,
    handleToggleSearchRow,
    handleToggleSearchColumn,
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
    handleColumnWidthChange,
    handleColumnOrderChange,
    handleMoveColumnUp,
    handleMoveColumnDown,
    handleResetColumnSettings,

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
    setShowSearchColumn,
    setSelectedRows,
    setJumpToPageInput,
    setDeleteModalOpen,
    setRowToDelete,
    setShowFilterModal,
    setTempFilterConfig,
    setColumnFilterTypes,
    setSelectedSearchColumns,
  } = useTableLogic({
    ...tableProps,
    tableId: tableProps.tableId || "default",
  });

  const [isOverflowing, setIsOverflowing] = useState(false);
  const scrollContainerRef = useRef(null);
  const [openDropdownRowId, setOpenDropdownRowId] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewRow, setPreviewRow] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(() => {
    if (typeof window !== "undefined") {
      const tableId = tableProps.tableId || "default";
      const stored = localStorage.getItem(`selectedTemplate_${tableId}`);
      return stored || null;
    }
    return null;
  });

  useEffect(() => {
    const tableId = tableProps.tableId || "default";
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`selectedTemplate_${tableId}`);
      setSelectedTemplateId(stored || null);
    }
  }, [tableProps.tableId]);

  // Persisted Other Settings
  const tableId = tableProps.tableId || "default";
  const otherSettingsKey = `table:${tableId}:otherSettings`;
  const getPersistedOtherSettings = () => {
    try {
      const raw = localStorage.getItem(otherSettingsKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };
  const persisted = getPersistedOtherSettings();
  const [headerColor, setHeaderColor] = useState(persisted.headerColor ?? "");
  const [showHeaderSeparator, setShowHeaderSeparator] = useState(persisted.showHeaderSeparator ?? true);
  const [showHeaderColSeparator, setShowHeaderColSeparator] = useState(persisted.showHeaderColSeparator ?? true);
  const [showBodyColSeparator, setShowBodyColSeparator] = useState(persisted.showBodyColSeparator ?? true);

  const handleOtherSettingsChange = (settings) => {
    if (settings.headerColor !== undefined) setHeaderColor(settings.headerColor);
    if (settings.showHeaderSeparator !== undefined) setShowHeaderSeparator(settings.showHeaderSeparator);
    if (settings.showHeaderColSeparator !== undefined) setShowHeaderColSeparator(settings.showHeaderColSeparator);
    if (settings.showBodyColSeparator !== undefined) setShowBodyColSeparator(settings.showBodyColSeparator);
  };

  // Custom setter that saves to localStorage
  const handleSelectedTemplateChange = (templateId) => {
    const tableId = tableProps.tableId || "default";
    if (templateId) {
      localStorage.setItem(`selectedTemplate_${tableId}`, templateId);
    } else {
      localStorage.removeItem(`selectedTemplate_${tableId}`);
    }
    setSelectedTemplateId(templateId);
  };



  // Convert columns object to array if needed
  const columnsArray = Array.isArray(tableProps.columns)
    ? tableProps.columns
    : Object.values(tableProps.columns);

  // Use temp states for live preview when modal is open
  const effectiveVisibleColumns = showColumnModal
    ? tempVisibleColumns
    : visibleColumns;
  const effectiveColumnWidths = showColumnModal
    ? tempColumnWidths
    : columnWidths;
  const effectiveColumnOrder = showColumnModal ? tempColumnOrder : columnOrder;

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const checkOverflow = () => {
      // Check if the content width is greater than the container width
      const hasOverflow = container.scrollWidth > container.clientWidth;
      setIsOverflowing(hasOverflow);
    };

    // Initial check
    checkOverflow();

    // Debounced check on resize
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkOverflow, 150);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, [tableData, visibleColumns]); // Re-check when data or columns change

  return (
    <div className="w-full rounded-lg border border-border bg-background shadow-sm">
      <DeleteModal
        isOpen={deleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <PreviewModal
        isOpen={previewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false);
          setPreviewRow(null);
        }}
        row={previewRow}
        columns={columnsArray}
        columnOrder={columnOrder}
        visibleColumns={visibleColumns}
      />

      {showColumnModal && (
        <ColumnModal
          isOpen={showColumnModal}
          tableName={tableProps.tableId || "default"}
          columns={columnsArray}
          visibleColumns={tempVisibleColumns}
          columnWidths={tempColumnWidths}
          columnOrder={tempColumnOrder}
          realVisibleColumns={visibleColumns}
          realColumnWidths={columnWidths}
          realColumnOrder={columnOrder}
          onSave={handleSaveColumnVisibility}
          onCancel={handleCancelColumnVisibility}
          onToggleColumn={(columnKey, checked, newVisibleColumns) => {
            if (newVisibleColumns) {
              setTempVisibleColumns(newVisibleColumns);
            } else {
              setTempVisibleColumns((prev) => ({
                ...prev,
                [columnKey]: checked,
              }));
            }
          }}
          onColumnWidthChange={handleColumnWidthChange}
          onColumnOrderChange={handleColumnOrderChange}
          onMoveColumnUp={handleMoveColumnUp}
          onMoveColumnDown={handleMoveColumnDown}
          onResetSettings={handleResetColumnSettings}
          selectedTemplateId={selectedTemplateId}
          onSelectedTemplateChange={handleSelectedTemplateChange}
          headerColor={headerColor}
          showHeaderSeparator={showHeaderSeparator}
          showHeaderColSeparator={showHeaderColSeparator}
          showBodyColSeparator={showBodyColSeparator}
          onOtherSettingsChange={handleOtherSettingsChange}
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
        onAdd={tableProps.onAdd}
        onExportExcel={tableProps.onExportExcel}
        onExportPdf={tableProps.onExportPdf}
        onPrint={tableProps.onPrint}
        onRefresh={tableProps.onRefresh}
        onImportExcel={tableProps.onImportExcel}
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
        <div
          className="overflow-x-auto"
          style={{ scrollbarWidth: "thin" }}
          ref={scrollContainerRef}
        >
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
                showSearchColumn={showSearchColumn}
                columnSearch={columnSearch}
                areAllOnPageSelected={areAllOnPageSelected}
                paginatedData={paginatedData}
                handleSort={handleSort}
                handleColumnDragStart={handleColumnDragStart}
                handleColumnDragOver={handleColumnDragOver}
                handleToggleSearchRow={handleToggleSearchRow}
                handleToggleSearchColumn={handleToggleSearchColumn}
                handleOpenFilterModal={handleOpenFilterModal}
                handleColumnSearch={handleColumnSearch}
                handleSelectAll={handleSelectAll}
                columnWidths={columnWidths}
                t={props.t}
                isOverflowing={isOverflowing}
                headerColor={headerColor}
                showHeaderSeparator={showHeaderSeparator}
                showHeaderColSeparator={showHeaderColSeparator}
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
                enableCellEditing={tableProps.enableCellEditing}
                loading={tableProps.loading}
                handleRowDragStart={handleRowDragStart}
                handleRowDragOver={handleRowDragOver}
                handleCellDoubleClick={handleCellDoubleClick}
                handleCellEdit={handleCellEdit}
                handleCellEditFinish={handleCellEditFinish}
                handleRowSelect={handleRowSelect}
                handleDeleteClick={handleDeleteClick}
                onEdit={tableProps.onEdit}
                columnWidths={columnWidths}
                isOverflowing={isOverflowing}
                openDropdownRowId={openDropdownRowId}
                setOpenDropdownRowId={setOpenDropdownRowId}
                showSearchColumn={showSearchColumn}
                showBodyColSeparator={showBodyColSeparator}

                customActions={customActions}
                onCustomAction={onCustomAction}
                onDeleteConfirm={handleDeleteClick}
                onPreviewConfirm={(row) => {
                  setPreviewRow(row);
                  setPreviewModalOpen(true);
                  setOpenDropdownRowId(null);
                }}
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
