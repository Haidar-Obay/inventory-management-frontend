"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useTheme } from "next-themes";

// Utility function to check if an element is a descendant of another
const isDescendant = (parent, child) => {
  let node = child;
  while (node !== null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
};

export function useTableLogic({
  data = [],
  columns = [],
  onEdit,
  onDelete,
  onAdd = () => {},
  onExportExcel = () => {},
  onImportExcel = () => {},
  onExportPdf = () => {},
  onPrint = () => {},
  onRefresh = () => {},
  enableCellEditing = false,
  loading = false,
}) {
  const { theme } = useTheme();
  const [tableData, setTableData] = useState(data);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filters, setFilters] = useState({});
  const [columnSearch, setColumnSearch] = useState({});
  const [globalSearch, setGlobalSearch] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(
    columns.reduce((acc, column) => {
      acc[column.key] = true;
      return acc;
    }, {})
  );
  const [tempVisibleColumns, setTempVisibleColumns] = useState({});
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [columnOrder, setColumnOrder] = useState(columns.map((col) => col.key));
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [draggedRow, setDraggedRow] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [savedFilters, setSavedFilters] = useState([]);
  const [activeColumnFilters, setActiveColumnFilters] = useState({});
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [newFilterName, setNewFilterName] = useState("");
  const [selectedColumnForFilter, setSelectedColumnForFilter] = useState(null);
  const [uniqueColumnValues, setUniqueColumnValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showSearch, setShowSearch] = useState(true);
  const [showSearchRow, setShowSearchRow] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [jumpToPageInput, setJumpToPageInput] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tempFilterConfig, setTempFilterConfig] = useState(null);

  // Initialize filter types for each column
  const [columnFilterTypes, setColumnFilterTypes] = useState(() => {
    const initialFilterTypes = {};
    columns.forEach((column) => {
      if (column.type === "text") {
        initialFilterTypes[column.key] = "contains";
      } else if (column.type === "number") {
        initialFilterTypes[column.key] = "equals";
      } else if (column.type === "date") {
        initialFilterTypes[column.key] = "equals";
      } else if (column.type === "boolean") {
        initialFilterTypes[column.key] = "equals";
      } else {
        initialFilterTypes[column.key] = "contains";
      }
    });
    return initialFilterTypes;
  });

  // Extract unique values for each column
  useEffect(() => {
    const uniqueValues = {};
    columns.forEach((column) => {
      const values = [...new Set(data.map((row) => row[column.key]))].filter(
        (value) => value !== undefined && value !== null
      );
      uniqueValues[column.key] = values;
    });
    setUniqueColumnValues(uniqueValues);
  }, [data, columns]);

  // Load saved filters from localStorage
  useEffect(() => {
    const savedFiltersFromStorage = localStorage.getItem("tableFilters");
    if (savedFiltersFromStorage) {
      setSavedFilters(JSON.parse(savedFiltersFromStorage));
    }
  }, []);

  // Update tableData when data prop changes
  useEffect(() => {
    setTableData(data);
  }, [data]);

  // Apply sorting
  const sortedData = useMemo(() => {
    const sortableData = [...tableData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null || aValue === undefined)
          return sortConfig.direction === "asc" ? -1 : 1;
        if (bValue === null || bValue === undefined)
          return sortConfig.direction === "asc" ? 1 : -1;

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      });
    }
    return sortableData;
  }, [tableData, sortConfig]);

  // Apply filters and search
  const filteredData = useMemo(() => {
    return sortedData.filter((row) => {
      // Apply global search
      if (globalSearch) {
        const matchesGlobalSearch = Object.keys(row).some((key) => {
          if (!visibleColumns[key]) return false;
          const value = row[key];
          if (value === null || value === undefined) return false;
          return String(value)
            .toLowerCase()
            .includes(globalSearch.toLowerCase());
        });
        if (!matchesGlobalSearch) return false;
      }

      // Apply column search
      for (const [key, searchValue] of Object.entries(columnSearch)) {
        if (!searchValue) continue;

        const value = row[key];
        if (value === null || value === undefined) return false;

        if (!String(value).toLowerCase().includes(searchValue.toLowerCase())) {
          return false;
        }
      }

      // Apply column filters
      for (const [key, filterConfig] of Object.entries(activeColumnFilters)) {
        if (!filterConfig || !filterConfig.value) continue;

        const value = row[key];
        const filterType = filterConfig.type;
        const filterValue = filterConfig.value;

        // Skip if value is null or undefined
        if (value === null || value === undefined) return false;

        const column = columns.find((col) => col.key === key);
        const columnType = column ? column.type : "text";

        if (columnType === "text") {
          if (
            filterType === "contains" &&
            !String(value)
              .toLowerCase()
              .includes(String(filterValue).toLowerCase())
          ) {
            return false;
          } else if (
            filterType === "equals" &&
            String(value).toLowerCase() !== String(filterValue).toLowerCase()
          ) {
            return false;
          } else if (
            filterType === "startsWith" &&
            !String(value)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
          ) {
            return false;
          } else if (
            filterType === "endsWith" &&
            !String(value)
              .toLowerCase()
              .endsWith(String(filterValue).toLowerCase())
          ) {
            return false;
          }
        } else if (columnType === "number") {
          const numValue = Number(value);
          const numFilterValue = Number(filterValue);

          if (filterType === "equals" && numValue !== numFilterValue) {
            return false;
          } else if (
            filterType === "greaterThan" &&
            numValue <= numFilterValue
          ) {
            return false;
          } else if (filterType === "lessThan" && numValue >= numFilterValue) {
            return false;
          } else if (filterType === "between") {
            const [min, max] = filterValue.split(",").map(Number);
            if (numValue < min || numValue > max) {
              return false;
            }
          }
        } else if (columnType === "date") {
          const dateValue = new Date(value);
          if (filterType === "equals") {
            const filterDate = new Date(filterValue);
            if (
              dateValue.getFullYear() !== filterDate.getFullYear() ||
              dateValue.getMonth() !== filterDate.getMonth() ||
              dateValue.getDate() !== filterDate.getDate()
            ) {
              return false;
            }
          } else if (filterType === "before") {
            const filterDate = new Date(filterValue);
            if (dateValue >= filterDate) {
              return false;
            }
          } else if (filterType === "after") {
            const filterDate = new Date(filterValue);
            if (dateValue <= filterDate) {
              return false;
            }
          } else if (filterType === "between") {
            const [start, end] = filterValue.split(",");
            const startDate = new Date(start);
            const endDate = new Date(end);
            if (dateValue < startDate || dateValue > endDate) {
              return false;
            }
          }
        } else if (columnType === "boolean") {
          const boolValue = Boolean(value);
          const boolFilterValue = filterValue === "true";

          if (boolValue !== boolFilterValue) {
            return false;
          }
        }
      }

      return true;
    });
  }, [
    sortedData,
    globalSearch,
    columnSearch,
    activeColumnFilters,
    visibleColumns,
    columns,
  ]);

  // Apply pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Handlers
  const handleToggleSearchRow = () => {
    setShowSearchRow((prev) => !prev);
  };

  const handleJumpToPageInputChange = (e) => {
    setJumpToPageInput(e.target.value);
  };

  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpToPageInput, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
    }
    setJumpToPageInput("");
  };

  const handleJumpToPageKeyPress = (e) => {
    if (e.key === "Enter" && jumpToPageInput) {
      handleJumpToPage();
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleColumnDragStart = (key) => {
    setDraggedColumn(key);
  };

  const handleColumnDragOver = (e, key) => {
    e.preventDefault();
    if (draggedColumn && draggedColumn !== key) {
      const newColumnOrder = [...columnOrder];
      const draggedIndex = newColumnOrder.indexOf(draggedColumn);
      const targetIndex = newColumnOrder.indexOf(key);

      newColumnOrder.splice(draggedIndex, 1);
      newColumnOrder.splice(targetIndex, 0, draggedColumn);

      setColumnOrder(newColumnOrder);
    }
  };

  const handleRowDragStart = (index) => {
    setDraggedRow(index);
  };

  const handleRowDragOver = (e, index) => {
    e.preventDefault();
    if (draggedRow !== null && draggedRow !== index) {
      const newData = [...tableData];
      const draggedRowData = newData[draggedRow];

      newData.splice(draggedRow, 1);
      newData.splice(index, 0, draggedRowData);

      setTableData(newData);
      setDraggedRow(index);
    }
  };

  const handleCellDoubleClick = (rowIndex, columnKey) => {
    setEditingCell({ rowIndex, columnKey });
  };

  const handleCellEdit = (e, rowIndex, columnKey) => {
    const newData = [...tableData];
    const column = columns.find((col) => col.key === columnKey);

    let value = e.target.value;
    if (column.type === "number") {
      value = Number(value);
    } else if (column.type === "boolean") {
      value = value === "true";
    }

    newData[rowIndex][columnKey] = value;
    setTableData(newData);
  };

  const handleCellEditFinish = () => {
    setEditingCell(null);
    if (onEdit) {
      onEdit(tableData);
    }
  };

  const handleColumnVisibilityToggle = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleGlobalSearch = (e) => {
    setGlobalSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleColumnSearch = (key, value) => {
    setColumnSearch((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const handleFilterTypeChange = (columnKey, type) => {
    setTempFilterConfig((prev) => ({
      ...prev,
      type,
      value: prev?.value || "",
    }));
  };

  const handleFilterValueChange = (columnKey, value) => {
    setTempFilterConfig((prev) => ({
      ...prev,
      value,
    }));
  };

  const handleAddColumnFilter = (columnKey) => {
    const column = columns.find((col) => col.key === columnKey);
    const filterType = columnFilterTypes[columnKey];
    let filterValue = columnSearch[columnKey] || "";

    if (filterType === "between") {
      if (column.type === "number") {
        filterValue = "0,100";
      } else if (column.type === "date") {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        filterValue = `${today.toISOString().split("T")[0]},${
          nextWeek.toISOString().split("T")[0]
        }`;
      }
    }

    setActiveColumnFilters((prev) => ({
      ...prev,
      [columnKey]: {
        type: filterType,
        value: filterValue,
      },
    }));
    setCurrentPage(1);
  };

  const handleRemoveColumnFilter = (columnKey) => {
    setActiveColumnFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[columnKey];
      return newFilters;
    });
    setCurrentPage(1);
  };

  const handleSaveFilters = () => {
    if (!newFilterName.trim()) return;

    const newSavedFilter = {
      name: newFilterName,
      filters: { ...activeColumnFilters },
    };

    const updatedSavedFilters = [...savedFilters, newSavedFilter];
    setSavedFilters(updatedSavedFilters);

    localStorage.setItem("tableFilters", JSON.stringify(updatedSavedFilters));
    setNewFilterName("");
  };

  const handleLoadFilter = (filterIndex) => {
    const filterToLoad = savedFilters[filterIndex];
    setActiveColumnFilters(filterToLoad.filters);
    setIsSettingsModalOpen(false);
    setCurrentPage(1);
  };

  const handleClearColumnFilters = () => {
    setActiveColumnFilters({});
    setColumnSearch({});
    setCurrentPage(1);
  };

  const handleClearGlobalSearch = () => {
    setGlobalSearch("");
    setCurrentPage(1);
  };

  const handleRowSelect = (rowId) => {
    setSelectedRows((prevSelectedRows) => {
      const newSelectedRows = new Set(prevSelectedRows);
      if (newSelectedRows.has(rowId)) {
        newSelectedRows.delete(rowId);
      } else {
        newSelectedRows.add(rowId);
      }
      return newSelectedRows;
    });
  };

  const handleSelectAll = () => {
    const allCurrentPageRowIds = paginatedData.map((row) => row.id);
    const areAllCurrentlySelectedOnPage =
      paginatedData.length > 0 &&
      allCurrentPageRowIds.every((id) => selectedRows.has(id));

    setSelectedRows((prevSelectedRows) => {
      const newSelectedRows = new Set(prevSelectedRows);
      if (areAllCurrentlySelectedOnPage) {
        allCurrentPageRowIds.forEach((id) => newSelectedRows.delete(id));
      } else {
        allCurrentPageRowIds.forEach((id) => newSelectedRows.add(id));
      }
      return newSelectedRows;
    });
  };

  const handleDeleteClick = (row) => {
    setRowToDelete(row);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (rowToDelete && onDelete) {
      onDelete(rowToDelete);
    }
    setDeleteModalOpen(false);
    setRowToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setRowToDelete(null);
  };

  const handleOpenColumnModal = () => {
    setTempVisibleColumns({ ...visibleColumns });
    setShowColumnModal(true);
  };

  const handleSaveColumnVisibility = () => {
    setVisibleColumns(tempVisibleColumns);
    setShowColumnModal(false);
  };

  const handleCancelColumnVisibility = () => {
    setShowColumnModal(false);
  };

  const handleOpenFilterModal = (columnKey) => {
    setSelectedColumnForFilter(columnKey);
    const column = columns.find((col) => col.key === columnKey);
    const currentFilter = activeColumnFilters[columnKey];

    setTempFilterConfig({
      type: currentFilter?.type || columnFilterTypes[columnKey],
      value: currentFilter?.value || columnSearch[columnKey] || "",
    });

    setShowFilterModal(true);
  };

  const handleSaveFilter = () => {
    if (
      selectedColumnForFilter &&
      tempFilterConfig &&
      tempFilterConfig.type &&
      tempFilterConfig.type !== "" &&
      tempFilterConfig.value &&
      tempFilterConfig.value !== ""
    ) {
      setActiveColumnFilters((prev) => ({
        ...prev,
        [selectedColumnForFilter]: {
          type: tempFilterConfig.type,
          value: tempFilterConfig.value,
        },
      }));
      setCurrentPage(1);
    }
    setShowFilterModal(false);
    setSelectedColumnForFilter(null);
    setTempFilterConfig(null);
  };

  const handleCancelFilter = () => {
    setShowFilterModal(false);
    setSelectedColumnForFilter(null);
    setTempFilterConfig(null);
  };

  const areAllOnPageSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) => selectedRows.has(row.id));

  return {
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
    handleFilterValueChange,
    handleAddColumnFilter,
    handleRemoveColumnFilter,
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
  };
}
