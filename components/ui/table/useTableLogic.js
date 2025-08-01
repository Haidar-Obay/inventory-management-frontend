"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
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

// Helper function to safely access localStorage
const safeLocalStorage = {
  getItem: (key) => {
    if (typeof window !== 'undefined') {
      try {
        return window.localStorage.getItem(key);
      } catch (error) {
        console.error("Error accessing localStorage:", error);
        return null;
      }
    }
    return null;
  },
  setItem: (key, value) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, value);
      } catch (error) {
        console.error("Error setting localStorage:", error);
      }
    }
  },
  removeItem: (key) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.error("Error removing from localStorage:", error);
      }
    }
  }
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
  tableId = "default",
  customActions = [],
  onCustomAction,
}) {
  const { theme } = useTheme();
  const [tableData, setTableData] = useState(data);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filters, setFilters] = useState({});
  const [columnSearch, setColumnSearch] = useState({});
  const [globalSearch, setGlobalSearch] = useState("");
  
  // Helper functions for localStorage persistence
  const getLastAppliedTemplateKey = () => tableId ? `table:${tableId}:lastAppliedTemplate` : null;
  
  const loadLastAppliedTemplate = useCallback(() => {
    const key = getLastAppliedTemplateKey();
    if (!key) return null;
    
    try {
      const saved = safeLocalStorage.getItem(key);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Error loading last applied template:", error);
      return null;
    }
  }, [tableId]);

  // Add a ref to track if the last applied template has been loaded
  const hasLoadedLastAppliedTemplate = useRef(false);

  const [visibleColumns, setVisibleColumns] = useState(() => {
    // Try to load from last applied template first
    const lastAppliedTemplate = loadLastAppliedTemplate();
    if (lastAppliedTemplate && lastAppliedTemplate.visible_columns) {
      return lastAppliedTemplate.visible_columns;
    }
    
    // Default settings if no saved settings or error
    const defaultSettings = {};
    columns.forEach((col) => {
      defaultSettings[col.key] =
        col.key !== "created_at" && col.key !== "updated_at";
    });
    return defaultSettings;
  });
  
  const [selectedSearchColumns, setSelectedSearchColumns] = useState({});
  const [tempVisibleColumns, setTempVisibleColumns] = useState({});
  const [showColumnModal, setShowColumnModal] = useState(false);
  
  const [columnOrder, setColumnOrder] = useState(() => {
    // Try to load from last applied template first
    const lastAppliedTemplate = loadLastAppliedTemplate();
    if (lastAppliedTemplate && lastAppliedTemplate.column_order) {
      return lastAppliedTemplate.column_order;
    }
    
    // Use default order
    return columns.map((col) => col.key);
  });
  
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
  const [showSearchColumn, setShowSearchColumn] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = safeLocalStorage.getItem(`tableShowSearchColumn_${tableId}`);
      if (saved !== null) return saved === "true";
    }
    return false;
  });
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [jumpToPageInput, setJumpToPageInput] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tempFilterConfig, setTempFilterConfig] = useState(null);
  const [tempColumnWidths, setTempColumnWidths] = useState({});
  const [tempColumnOrder, setTempColumnOrder] = useState([]);

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

  // Helper function to calculate appropriate width
  const calculateWidth = (column, savedWidth) => {
    if (savedWidth) return savedWidth;
    if (column.width) return column.width;
    
    // Use smaller default widths
    if (column.key === "id") return "60px";
    if (column.key === "code") return "80px";
    if (column.key === "name" || column.key === "title" || column.key === "firstName" || column.key === "lastName") return "100px";
    if (column.key === "phone" || column.key.includes("phone")) return "90px";
    if (column.key === "email") return "120px";
    if (column.key === "address") return "130px";
    if (column.key === "description" || column.key === "notes") return "150px";
    if (column.type === "boolean") return "70px";
    if (column.type === "date") return "90px";
    
    return "80px";
  };

  // Add column widths state with localStorage
  const [columnWidths, setColumnWidths] = useState(() => {
    // Try to load from last applied template first
    const lastAppliedTemplate = loadLastAppliedTemplate();
    if (lastAppliedTemplate && lastAppliedTemplate.column_widths) {
      return {
        select: "28px",
        search: "28px",
        ...lastAppliedTemplate.column_widths,
      };
    }
    
    // If no saved widths or error, use default widths
    return {
      select: "28px",
      search: "28px",
      ...columns.reduce((acc, column) => {
        acc[column.key] = calculateWidth(column, null);
        return acc;
      }, {}),
    };
  });

  // Extract unique values for each column
  useEffect(() => {
    const uniqueValues = {};
    // Ensure data is an array before processing
    const safeData = Array.isArray(data) ? data : [];

    columns.forEach((column) => {
      const values = [
        ...new Set(safeData.map((row) => row[column.key])),
      ].filter((value) => value !== undefined && value !== null);
      uniqueValues[column.key] = values;
    });
    setUniqueColumnValues(uniqueValues);
  }, [data, columns]);

  // Load saved filters from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFiltersFromStorage = safeLocalStorage.getItem("tableFilters");
      if (savedFiltersFromStorage) {
        setSavedFilters(JSON.parse(savedFiltersFromStorage));
      }
    }
  }, []);

  // Update tableData when data prop changes
  useEffect(() => {
    setTableData(data);
  }, [data]);

  // Effect to apply last applied template settings on initialization
  useEffect(() => {
    if (!hasLoadedLastAppliedTemplate.current) {
      const lastAppliedTemplate = loadLastAppliedTemplate();
      if (lastAppliedTemplate && lastAppliedTemplate.id) {
        // Apply column visibility
        if (lastAppliedTemplate.visible_columns) {
          setVisibleColumns(lastAppliedTemplate.visible_columns);
        }
        
        // Apply column widths
        if (lastAppliedTemplate.column_widths) {
          setColumnWidths({
            select: "28px",
            search: "28px",
            ...lastAppliedTemplate.column_widths,
          });
        }
        
        // Apply column order
        if (lastAppliedTemplate.column_order) {
          setColumnOrder(lastAppliedTemplate.column_order);
        }
      }
      hasLoadedLastAppliedTemplate.current = true;
    }
  }, []); // Empty dependency array to run only once

  // Initialize selectedSearchColumns when visibleColumns is set
  useEffect(() => {
    const initialSelection = {};
    columns.forEach((col) => {
      if (visibleColumns[col.key]) {
        initialSelection[col.key] = true;
      }
    });
    setSelectedSearchColumns(initialSelection);
  }, [visibleColumns, columns]);

  // Update selectedSearchColumns when visibleColumns changes
  useEffect(() => {
    setSelectedSearchColumns((prev) => {
      const newSelection = { ...prev };
      // Remove columns that are no longer visible
      Object.keys(newSelection).forEach((key) => {
        if (!visibleColumns[key]) {
          delete newSelection[key];
        }
      });
      // Add newly visible columns
      columns.forEach((col) => {
        if (visibleColumns[col.key] && !(col.key in newSelection)) {
          newSelection[col.key] = true;
        }
      });
      return newSelection;
    });
  }, [visibleColumns, columns]);

  // Apply sorting
  const sortedData = useMemo(() => {
    // Ensure tableData is an array before processing
    const safeTableData = Array.isArray(tableData) ? tableData : [];
    const sortableData = [...safeTableData];
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
    // Ensure sortedData is an array before processing
    const safeSortedData = Array.isArray(sortedData) ? sortedData : [];

    return safeSortedData.filter((row) => {
      // Apply global search
      if (globalSearch) {
        const matchesGlobalSearch = Object.keys(row).some((key) => {
          // Only search in selected and visible columns
          if (!selectedSearchColumns[key] || !visibleColumns[key]) return false;
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
    selectedSearchColumns,
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

  const handleToggleSearchColumn = () => {
    setShowSearchColumn((prev) => !prev);
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
      // Ensure tableData is an array before processing
      const safeTableData = Array.isArray(tableData) ? tableData : [];
      const newData = [...safeTableData];
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
    // Ensure tableData is an array before processing
    const safeTableData = Array.isArray(tableData) ? tableData : [];
    const newData = [...safeTableData];
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
      // Ensure tableData is an array before passing to onEdit
      const safeTableData = Array.isArray(tableData) ? tableData : [];
      onEdit(safeTableData);
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
  };

  const handleSearchColumnToggle = (columnKey) => {
    // Only allow toggling if the column is visible
    if (visibleColumns[columnKey]) {
      setSelectedSearchColumns((prev) => ({
        ...prev,
        [columnKey]: !prev[columnKey],
      }));
    }
  };

  const handleSelectAllSearchColumns = () => {
    const allSelected = Object.keys(selectedSearchColumns).every(
      (key) => selectedSearchColumns[key] && visibleColumns[key]
    );
    const newSelection = {};
    columns.forEach((col) => {
      if (visibleColumns[col.key]) {
        newSelection[col.key] = !allSelected;
      }
    });
    setSelectedSearchColumns(newSelection);
  };

  const handleColumnSearch = (key, value) => {
    setColumnSearch((prev) => {
      if (value === "") {
        // Remove the key if value is empty
        const newSearch = { ...prev };
        delete newSearch[key];
        return newSearch;
      } else {
        // Add or update the key with the value
        return {
          ...prev,
          [key]: value,
        };
      }
    });
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

    safeLocalStorage.setItem("tableFilters", JSON.stringify(updatedSavedFilters));
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
    // Ensure paginatedData is an array before processing
    const safePaginatedData = Array.isArray(paginatedData) ? paginatedData : [];
    const allCurrentPageRowIds = safePaginatedData.map((row) => row.id);
    const areAllCurrentlySelectedOnPage =
      safePaginatedData.length > 0 &&
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
    setTempColumnWidths({ ...columnWidths });
    setTempColumnOrder([...columnOrder]);
    setShowColumnModal(true);
  };

  const handleSaveColumnVisibility = () => {
    setVisibleColumns(tempVisibleColumns);
    setColumnWidths(tempColumnWidths);
    setColumnOrder(tempColumnOrder);
    setShowColumnModal(false);
  };

  const handleCancelColumnVisibility = () => {
    setShowColumnModal(false);
  };

  // New handlers for column width and order management
  const handleColumnWidthChange = (columnKey, newWidth) => {
    setTempColumnWidths((prev) => ({
      ...prev,
      [columnKey]: newWidth,
    }));
  };

  const handleColumnOrderChange = (newOrder) => {
    setTempColumnOrder(newOrder);
  };

  const handleMoveColumnUp = (columnKey) => {
    const currentIndex = tempColumnOrder.indexOf(columnKey);
    if (currentIndex > 0) {
      const newOrder = [...tempColumnOrder];
      [newOrder[currentIndex], newOrder[currentIndex - 1]] = [
        newOrder[currentIndex - 1],
        newOrder[currentIndex],
      ];
      setTempColumnOrder(newOrder);
    }
  };

  const handleMoveColumnDown = (columnKey) => {
    const currentIndex = tempColumnOrder.indexOf(columnKey);
    if (currentIndex < tempColumnOrder.length - 1) {
      const newOrder = [...tempColumnOrder];
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [
        newOrder[currentIndex + 1],
        newOrder[currentIndex],
      ];
      setTempColumnOrder(newOrder);
    }
  };

  const handleResetColumnSettings = (tab) => {
    if (tab === "visibility") {
      const defaultSettings = {};
      columns.forEach((col) => {
        defaultSettings[col.key] =
          col.key !== "created_at" && col.key !== "updated_at";
      });
      setTempVisibleColumns(defaultSettings);
      setVisibleColumns(defaultSettings);
    } else if (tab === "size") {
      const defaultWidths = {
        select: "28px",
        search: "28px",
        ...columns.reduce((acc, column) => {
          acc[column.key] = calculateWidth(column, null);
          return acc;
        }, {}),
      };
      setTempColumnWidths(defaultWidths);
      setColumnWidths(defaultWidths);
    } else if (tab === "order") {
      const defaultOrder = columns.map((col) => col.key);
      setTempColumnOrder(defaultOrder);
      setColumnOrder(defaultOrder);
    }
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
    Array.isArray(paginatedData) &&
    paginatedData.length > 0 &&
    paginatedData.every((row) => selectedRows.has(row.id));

      // Reset column widths with animation
    const resetColumnWidths = () => {
      const defaultWidths = {
        select: "28px",
        search: "28px",
        ...columns.reduce((acc, column) => {
          acc[column.key] = "110px";
          return acc;
        }, {}),
      };

    // Animate the width changes
    Object.entries(defaultWidths).forEach(([key, width]) => {
      const th = document.querySelector(`th[data-column="${key}"]`);
      if (th) {
        th.style.transition = "width 0.3s ease";
        th.style.width = width;
        setTimeout(() => {
          th.style.transition = "";
        }, 300);
      }
    });

    setColumnWidths(defaultWidths);
  };

  // Reset column visibility to defaults
  const resetColumnVisibility = () => {
    const defaultSettings = {};
    columns.forEach((col) => {
      defaultSettings[col.key] =
        col.key !== "created_at" && col.key !== "updated_at";
    });
    setVisibleColumns(defaultSettings);
  };

  // Get visible columns
  const getVisibleColumns = () => {
    return columns.filter((col) => visibleColumns[col.key]);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      safeLocalStorage.setItem(
        `tableShowSearchColumn_${tableId}`,
        showSearchColumn
      );
    }
  }, [showSearchColumn, tableId]);

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
    handleSearchColumnToggle,
    handleSelectAllSearchColumns,
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
    setColumnWidths,
    resetColumnWidths,
    resetColumnVisibility,

    // Getters
    getVisibleColumns,
  };
}
