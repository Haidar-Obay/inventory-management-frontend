"use client";

import React, { useState, useEffect, useRef } from "react";

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

// Button component
const Button = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  onClick,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50";

  const variantStyles = {
    default: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
    ghost: "bg-transparent hover:bg-gray-100",
    link: "bg-transparent underline-offset-4 hover:underline text-blue-600",
  };

  const sizeStyles = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-10 px-5 text-base",
    icon: "h-9 w-9",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Input component
const Input = ({ className = "", type = "text", ...props }) => {
  return (
    <input
      type={type}
      className={`flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

// Select component
const Select = ({ children, className = "", ...props }) => {
  return (
    <select
      className={`flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

// Checkbox component
const Checkbox = ({ className = "", ...props }) => {
  return (
    <input
      type="checkbox"
      className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
};

// Tooltip component
const Tooltip = ({ children, content, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);

  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white ${positions[position]}`}
        >
          {content}
          <div
            className={`absolute ${
              position === "top"
                ? "top-full left-1/2 -translate-x-1/2 border-t-gray-800"
                : position === "bottom"
                ? "bottom-full left-1/2 -translate-x-1/2 border-b-gray-800"
                : position === "left"
                ? "left-full top-1/2 -translate-y-1/2 border-l-gray-800"
                : "right-full top-1/2 -translate-y-1/2 border-r-gray-800"
            } border-4 border-transparent`}
          />
        </div>
      )}
    </div>
  );
};

// Dropdown component
const Dropdown = ({ trigger, children, align = "left" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const alignments = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2",
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !isDescendant(dropdownRef.current, event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute z-50 mt-1 min-w-[12rem] rounded-md border border-gray-200 bg-white p-1 shadow-md ${alignments[align]}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// Dropdown item component
const DropdownItem = ({ children, onClick }) => {
  return (
    <div
      className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Badge component
const Badge = ({ children, variant = "default", className = "" }) => {
  const variantStyles = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-purple-100 text-purple-800",
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

// DatePicker component
const DatePicker = ({ value, onChange, className = "" }) => {
  return (
    <input
      type="date"
      value={value || ""}
      onChange={onChange}
      className={`flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
  );
};

// Modal component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-200"
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
        <div>{children}</div>
      </div>
    </div>
  );
};

// Main Table component
const Table = ({ data = [], columns = [], onEdit, onDelete }) => {
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

  const handleToggleSearchRow = () => {
    setShowSearchRow((prev) => !prev);
  };

  const handleJumpToPageInputChange = (e) => {
    setJumpToPageInput(e.target.value);
  };

  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpToPageInput, 10);
    if (
      !isNaN(pageNumber) &&
      pageNumber >= 1 &&
      pageNumber <= totalPages // Ensure totalPages is in scope
    ) {
      handlePageChange(pageNumber); // Ensure handlePageChange is in scope
    }
    setJumpToPageInput(""); // Clear input after attempt
  };

  const handleJumpToPageKeyPress = (e) => {
    if (e.key === "Enter" && jumpToPageInput) {
      handleJumpToPage();
    }
  };

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
  const sortedData = React.useMemo(() => {
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
  const filteredData = React.useMemo(() => {
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
          const dateFilterValue = new Date(filterValue);

          if (
            filterType === "equals" &&
            dateValue.toDateString() !== dateFilterValue.toDateString()
          ) {
            return false;
          } else if (filterType === "before" && dateValue >= dateFilterValue) {
            return false;
          } else if (filterType === "after" && dateValue <= dateFilterValue) {
            return false;
          } else if (filterType === "between") {
            const [startDate, endDate] = filterValue
              .split(",")
              .map((date) => new Date(date));
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
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle column sort
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Handle column drag start
  const handleColumnDragStart = (key) => {
    setDraggedColumn(key);
  };

  // Handle column drag over
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

  // Handle row drag start
  const handleRowDragStart = (index) => {
    setDraggedRow(index);
  };

  // Handle row drag over
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

  // Handle cell double click for editing
  const handleCellDoubleClick = (rowIndex, columnKey) => {
    setEditingCell({ rowIndex, columnKey });
  };

  // Handle cell edit
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

  // Handle cell edit finish
  const handleCellEditFinish = () => {
    setEditingCell(null);
    if (onEdit) {
      onEdit(tableData);
    }
  };

  // Handle column visibility toggle
  const handleColumnVisibilityToggle = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handle global search
  const handleGlobalSearch = (e) => {
    setGlobalSearch(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle column search
  const handleColumnSearch = (key, value) => {
    setColumnSearch((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle filter type change
  const handleFilterTypeChange = (columnKey, filterType) => {
    setColumnFilterTypes((prev) => ({
      ...prev,
      [columnKey]: filterType,
    }));
  };

  // Handle adding a column filter
  const handleAddColumnFilter = (columnKey) => {
    const column = columns.find((col) => col.key === columnKey);
    const filterType = columnFilterTypes[columnKey];
    let filterValue = columnSearch[columnKey] || "";

    // For between filters, set default range values
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
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle removing a column filter
  const handleRemoveColumnFilter = (columnKey) => {
    setActiveColumnFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[columnKey];
      return newFilters;
    });
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle filter value change
  const handleFilterValueChange = (columnKey, value) => {
    setActiveColumnFilters((prev) => ({
      ...prev,
      [columnKey]: {
        ...prev[columnKey],
        value: value,
      },
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle saving current filters
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

  // Handle loading a saved filter
  const handleLoadFilter = (filterIndex) => {
    const filterToLoad = savedFilters[filterIndex];
    setActiveColumnFilters(filterToLoad.filters);
    setIsSettingsModalOpen(false);
    setCurrentPage(1); // Reset to first page on filter load
  };

  // Handle clearing only the filters
  const handleClearColumnFilters = () => {
    setActiveColumnFilters({});
    setColumnSearch({});
    setCurrentPage(1); // Reset to first page
  };

  // Handle clearing only the search
  const handleClearGlobalSearch = () => {
    setGlobalSearch("");
    setCurrentPage(1); // Reset to first page
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
    const allCurrentPageRowIds = paginatedData.map((row) => row.id); // Assumes row.id exists and is unique
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

  // Render filter input based on column type
  const renderFilterInput = (column, columnKey) => {
    const filterConfig = activeColumnFilters[columnKey];
    if (!filterConfig) return null;

    const filterType = filterConfig.type;
    const filterValue = filterConfig.value;
    const availableValues = uniqueColumnValues[columnKey] || [];

    if (column.type === "text") {
      return (
        <div className="space-y-2">
          <Input
            value={filterValue || ""}
            onChange={(e) => handleFilterValueChange(columnKey, e.target.value)}
            placeholder="Filter value..."
            className="mt-1 w-full"
          />
          {availableValues.length > 0 && (
            <Select
              value={filterValue || ""}
              onChange={(e) =>
                handleFilterValueChange(columnKey, e.target.value)
              }
              className="mt-1 w-full"
            >
              <option value="">Select from available values</option>
              {availableValues.map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          )}
        </div>
      );
    } else if (column.type === "number") {
      if (filterType === "between") {
        const [min, max] = (filterValue || "0,100").split(",").map(Number);
        return (
          <div className="flex items-center space-x-2 mt-1">
            <Input
              type="number"
              value={min}
              onChange={(e) => {
                const newMin = e.target.value;
                handleFilterValueChange(columnKey, `${newMin},${max}`);
              }}
              placeholder="Min"
              className="w-1/2"
            />
            <span>to</span>
            <Input
              type="number"
              value={max}
              onChange={(e) => {
                const newMax = e.target.value;
                handleFilterValueChange(columnKey, `${min},${newMax}`);
              }}
              placeholder="Max"
              className="w-1/2"
            />
          </div>
        );
      } else {
        return (
          <div className="space-y-2">
            <Input
              type="number"
              value={filterValue || ""}
              onChange={(e) =>
                handleFilterValueChange(columnKey, e.target.value)
              }
              placeholder="Filter value..."
              className="mt-1 w-full"
            />
            {availableValues.length > 0 && (
              <Select
                value={filterValue || ""}
                onChange={(e) =>
                  handleFilterValueChange(columnKey, e.target.value)
                }
                className="mt-1 w-full"
              >
                <option value="">Select from available values</option>
                {availableValues.map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
            )}
          </div>
        );
      }
    } else if (column.type === "date") {
      if (filterType === "between") {
        const [startDate, endDate] = (filterValue || ",").split(",");
        return (
          <div className="flex flex-col space-y-2 mt-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs">From:</span>
              <DatePicker
                value={startDate}
                onChange={(e) => {
                  const newStartDate = e.target.value;
                  handleFilterValueChange(
                    columnKey,
                    `${newStartDate},${endDate}`
                  );
                }}
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs">To:</span>
              <DatePicker
                value={endDate}
                onChange={(e) => {
                  const newEndDate = e.target.value;
                  handleFilterValueChange(
                    columnKey,
                    `${startDate},${newEndDate}`
                  );
                }}
                className="w-full"
              />
            </div>
          </div>
        );
      } else {
        return (
          <div className="space-y-2">
            <DatePicker
              value={filterValue || ""}
              onChange={(e) =>
                handleFilterValueChange(columnKey, e.target.value)
              }
              className="mt-1 w-full"
            />
            {availableValues.length > 0 && (
              <Select
                value={filterValue || ""}
                onChange={(e) =>
                  handleFilterValueChange(columnKey, e.target.value)
                }
                className="mt-1 w-full"
              >
                <option value="">Select from available dates</option>
                {availableValues.map((value, index) => (
                  <option key={index} value={value}>
                    {new Date(value).toLocaleDateString()}
                  </option>
                ))}
              </Select>
            )}
          </div>
        );
      }
    } else if (column.type === "boolean") {
      return (
        <Select
          value={filterValue || ""}
          onChange={(e) => handleFilterValueChange(columnKey, e.target.value)}
          className="mt-1 w-full"
        >
          <option value="">Select...</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </Select>
      );
    } else if (column.options) {
      return (
        <Select
          value={filterValue || ""}
          onChange={(e) => handleFilterValueChange(columnKey, e.target.value)}
          className="mt-1 w-full"
        >
          <option value="">Select...</option>
          {column.options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      );
    }

    return (
      <Input
        value={filterValue || ""}
        onChange={(e) => handleFilterValueChange(columnKey, e.target.value)}
        placeholder="Filter value..."
        className="mt-1 w-full"
      />
    );
  };

  // Render filter type selector based on column type
  const renderFilterTypeSelector = (column, columnKey) => {
    const currentFilterType = columnFilterTypes[columnKey];

    if (column.type === "text") {
      return (
        <Select
          value={currentFilterType}
          onChange={(e) => handleFilterTypeChange(columnKey, e.target.value)}
          className="w-full text-xs"
        >
          <option value="contains">Contains</option>
          <option value="equals">Equals</option>
          <option value="startsWith">Starts with</option>
          <option value="endsWith">Ends with</option>
        </Select>
      );
    } else if (column.type === "number") {
      return (
        <Select
          value={currentFilterType}
          onChange={(e) => handleFilterTypeChange(columnKey, e.target.value)}
          className="w-full text-xs"
        >
          <option value="equals">Equals</option>
          <option value="greaterThan">Greater than</option>
          <option value="lessThan">Less than</option>
          <option value="between">Between</option>
        </Select>
      );
    } else if (column.type === "date") {
      return (
        <Select
          value={currentFilterType}
          onChange={(e) => handleFilterTypeChange(columnKey, e.target.value)}
          className="w-full text-xs"
        >
          <option value="equals">Equals</option>
          <option value="before">Before</option>
          <option value="after">After</option>
          <option value="between">Between</option>
        </Select>
      );
    } else if (column.type === "boolean") {
      return (
        <Select
          value={currentFilterType}
          onChange={(e) => handleFilterTypeChange(columnKey, e.target.value)}
          className="w-full text-xs"
        >
          <option value="equals">Equals</option>
        </Select>
      );
    }

    return (
      <Select
        value={currentFilterType}
        onChange={(e) => handleFilterTypeChange(columnKey, e.target.value)}
        className="w-full text-xs"
      >
        <option value="contains">Contains</option>
        <option value="equals">Equals</option>
      </Select>
    );
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      items.push(
        <Button
          key="first"
          variant={currentPage === 1 ? "primary" : "outline"}
          size="sm"
          onClick={() => handlePageChange(1)}
          className="px-3"
        >
          1
        </Button>
      );

      // Ellipsis after first page
      if (startPage > 2) {
        items.push(
          <span key="ellipsis-start" className="px-2">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Button
          key={i}
          variant={currentPage === i ? "primary" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className="px-3"
        >
          {i}
        </Button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      // Ellipsis before last page
      if (endPage < totalPages - 1) {
        items.push(
          <span key="ellipsis-end" className="px-2">
            ...
          </span>
        );
      }

      items.push(
        <Button
          key="last"
          variant={currentPage === totalPages ? "primary" : "outline"}
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          className="px-3"
        >
          {totalPages}
        </Button>
      );
    }

    return items;
  };

  const areAllOnPageSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) => selectedRows.has(row.id));

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Table Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-gray-50 p-4">
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
                placeholder="Search all columns..."
                value={globalSearch}
                onChange={handleGlobalSearch}
                className="w-64 pl-10"
              />
            </div>

            {/* Show Clear Search only if there is text in the global search */}
            {globalSearch && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearGlobalSearch}
                className="flex items-center gap-1 border-gray-300 bg-white shadow-sm"
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
                Clear Search
              </Button>
            )}

            {/* Show Clear Filters only if there are active filters */}
            {(Object.keys(activeColumnFilters).length > 0 ||
              Object.keys(columnSearch).length > 0) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearColumnFilters}
                className="flex items-center gap-1 border-gray-300 bg-white shadow-sm"
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
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Active Filters Count */}
          {Object.keys(activeColumnFilters).length > 0 && (
            <Badge variant="primary" className="flex items-center gap-1">
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
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              {Object.keys(activeColumnFilters).length} active filters
            </Badge>
          )}

          <Dropdown
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 border-gray-300 bg-white shadow-sm"
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
                Columns
              </Button>
            }
            align="right"
          >
            <div className="p-2">
              <div className="mb-2 text-xs font-medium text-gray-500">
                Toggle column visibility
              </div>
              <div className="max-h-60 overflow-y-auto">
                {columns.map((column) => (
                  <DropdownItem
                    key={column.key}
                    onClick={() => handleColumnVisibilityToggle(column.key)}
                  >
                    <Checkbox
                      checked={visibleColumns[column.key]}
                      onChange={() => {}}
                      className="mr-2"
                    />
                    {column.header}
                  </DropdownItem>
                ))}
              </div>
            </div>
          </Dropdown>
        </div>
      </div>

      {/* Active Filters Display */}
      {Object.keys(activeColumnFilters).length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-gray-50 p-2">
          <span className="text-xs font-medium text-gray-500">
            Active Filters:
          </span>
          {Object.entries(activeColumnFilters).map(([key, filterConfig]) => {
            const column = columns.find((col) => col.key === key);
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

      {/* Table */}
      <div className="overflow-y-auto max-h-[95vh]">
        <table className="w-full border-collapse">
          <thead
            className="bg-gray-50 sticky top-0 z-20"
            style={{ transform: "translateZ(0px)" }}
          >
            {/* Header Row */}
            <tr className="bg-gray-50">
              <th className="w-10 border-b border-gray-200 px-4 py-2 text-center">
                <Checkbox
                  checked={areAllOnPageSelected}
                  onChange={handleSelectAll}
                  disabled={paginatedData.length === 0}
                  aria-label="Select all rows on this page"
                />
              </th>
              <th className="w-10 border-b border-gray-200 px-4 py-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleSearchRow}
                  className="flex items-center gap-1 border-gray-300 bg-white shadow-sm hover:bg-gray-100"
                >
                  {showSearchRow ? (
                    // Hide Icon (when search row is visible)
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
                      <path d="M3 3l18 18"></path>
                      <circle cx="12" cy="12" r="7"></circle>
                    </svg>
                  ) : (
                    // Show Icon (when search row is hidden)
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
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  )}
                </Button>
              </th>

              {/* Column headers */}
              {columnOrder.map((key) => {
                const column = columns.find((col) => col.key === key);
                if (!column || !visibleColumns[key]) return null;

                const hasActiveFilter = activeColumnFilters[key];

                return (
                  <th
                    key={key}
                    className="border-b border-gray-200 px-4 py-2 text-left"
                    draggable
                    onDragStart={() => handleColumnDragStart(key)}
                    onDragOver={(e) => handleColumnDragOver(e, key)}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSort(key)}
                        >
                          <span>{column.header}</span>
                          {sortConfig.key === key && (
                            <span className="ml-1">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                        <Dropdown
                          trigger={
                            <Button
                              variant={hasActiveFilter ? "primary" : "ghost"}
                              size="sm"
                              className={`h-10 w-10 p-0 ml-2 flex items-center justify-center transition-all duration-200 
  ${
    hasActiveFilter
      ? "text-white bg-blue-600 hover:bg-blue-700"
      : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
  }`}
                              title="Filter Options"
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
                                <path d="M3 4h18" />
                                <path d="M8 8h8" />
                                <path d="M10 12h4" />
                                <path d="M12 16h0" />
                                <circle cx="12" cy="16" r="1.5" />
                              </svg>
                            </Button>
                          }
                          align="left"
                        >
                          <div className="p-2 w-64">
                            <div className="mb-2">
                              <label className="block text-xs font-medium mb-1">
                                Filter Type
                              </label>
                              {renderFilterTypeSelector(column, key)}
                            </div>

                            <div className="mb-2">
                              <label className="block text-xs font-medium mb-1">
                                Filter Value
                              </label>
                              {hasActiveFilter ? (
                                renderFilterInput(column, key)
                              ) : (
                                <div className="space-y-2">
                                  {column.type === "text" && (
                                    <Input
                                      placeholder="Enter text to filter..."
                                      value={columnSearch[key] || ""}
                                      onChange={(e) =>
                                        handleColumnSearch(key, e.target.value)
                                      }
                                    />
                                  )}
                                  {column.type === "number" && (
                                    <Input
                                      type="number"
                                      placeholder="Enter number to filter..."
                                      value={columnSearch[key] || ""}
                                      onChange={(e) =>
                                        handleColumnSearch(key, e.target.value)
                                      }
                                    />
                                  )}
                                  {column.type === "date" && (
                                    <DatePicker
                                      value={columnSearch[key] || ""}
                                      onChange={(e) =>
                                        handleColumnSearch(key, e.target.value)
                                      }
                                    />
                                  )}
                                  {column.type === "boolean" && (
                                    <Select
                                      value={columnSearch[key] || ""}
                                      onChange={(e) =>
                                        handleColumnSearch(key, e.target.value)
                                      }
                                    >
                                      <option value="">Select a value</option>
                                      <option value="true">True</option>
                                      <option value="false">False</option>
                                    </Select>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="flex justify-between pt-2">
                              {hasActiveFilter ? (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleRemoveColumnFilter(key)}
                                >
                                  Remove Filter
                                </Button>
                              ) : (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleAddColumnFilter(key)}
                                >
                                  Apply Filter
                                </Button>
                              )}
                            </div>
                          </div>
                        </Dropdown>
                      </div>
                      {hasActiveFilter && (
                        <div className="mt-1">
                          <Badge variant="primary" className="text-xs">
                            {columnFilterTypes[key]}:{" "}
                            {activeColumnFilters[key].value}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}

              {/* Actions column */}
              <th className="w-20 border-b border-gray-200 px-4 py-2 text-left">
                Actions
              </th>
            </tr>

            {showSearchRow && (
              <tr
                className="bg-gray-50"
                style={{
                  visibility: showSearchRow ? "visible" : "hidden",
                  position: showSearchRow ? "static" : "absolute",
                  height: showSearchRow ? "38px" : "0px",
                  overflow: "hidden",
                  transition:
                    "visibility 0.3s, opacity 0.3s linear, height 0.2s ease",
                  opacity: showSearchRow ? 1 : 0,
                }}
              >
                <td></td>
                <td></td>
                {columnOrder.map((key) => {
                  const column = columns.find((col) => col.key === key);
                  if (!column || !visibleColumns[key]) return null;

                  return (
                    <td key={`search-${key}`} className="px-4 py-2">
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
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
                            className="text-gray-400"
                          >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          </svg>
                        </div>
                        <Input
                          type={column.type === "number" ? "number" : "text"}
                          placeholder={`Search ${column.header}...`}
                          value={columnSearch[key] || ""}
                          onChange={(e) =>
                            handleColumnSearch(key, e.target.value)
                          }
                          className="pl-8 w-full"
                        />
                      </div>
                    </td>
                  );
                })}
                <td className="w-20 border-b border-gray-200 px-4 py-2"></td>
              </tr>
            )}
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => {
                const actualRowIndex =
                  (currentPage - 1) * rowsPerPage + rowIndex;

                return (
                  <tr
                    key={`${rowIndex}-${row.id}`}
                    className={`${
                      selectedRows.has(row.id)
                        ? "bg-blue-100 hover:bg-blue-200"
                        : rowIndex % 2 === 0
                        ? "bg-white hover:bg-gray-100"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    draggable
                    onDragStart={() => handleRowDragStart(actualRowIndex)}
                    onDragOver={(e) => handleRowDragOver(e, actualRowIndex)}
                  >
                    {/* Row selection checkbox */}
                    <td className="border-b border-gray-200 px-4 py-2 text-center">
                      <Checkbox
                        checked={selectedRows.has(row.id)}
                        onChange={() => handleRowSelect(row.id)}
                        aria-label={`Select row ${actualRowIndex + 1}`}
                      />
                    </td>
                    {/* Row handle */}
                    <td className="border-b border-gray-200 px-4 py-2">
                      <div className="flex h-full cursor-move items-center justify-center">
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
                          <line x1="8" y1="6" x2="21" y2="6"></line>
                          <line x1="8" y1="12" x2="21" y2="12"></line>
                          <line x1="8" y1="18" x2="21" y2="18"></line>
                          <line x1="3" y1="6" x2="3.01" y2="6"></line>
                          <line x1="3" y1="12" x2="3.01" y2="12"></line>
                          <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                      </div>
                    </td>

                    {/* Row cells */}
                    {columnOrder.map((key) => {
                      const column = columns.find((col) => col.key === key);
                      if (!column || !visibleColumns[key]) return null;

                      const isEditing =
                        editingCell &&
                        editingCell.rowIndex === actualRowIndex &&
                        editingCell.columnKey === key;

                      return (
                        <td
                          key={`${rowIndex}-${key}`}
                          className="border-b border-gray-200 px-4 py-2"
                          onDoubleClick={() =>
                            handleCellDoubleClick(actualRowIndex, key)
                          }
                        >
                          {isEditing ? (
                            column.type === "boolean" ? (
                              <Select
                                value={String(row[key])}
                                onChange={(e) =>
                                  handleCellEdit(e, actualRowIndex, key)
                                }
                                onBlur={handleCellEditFinish}
                                autoFocus
                              >
                                <option value="true">True</option>
                                <option value="false">False</option>
                              </Select>
                            ) : column.type === "date" ? (
                              <DatePicker
                                value={row[key]}
                                onChange={(e) =>
                                  handleCellEdit(e, actualRowIndex, key)
                                }
                                onBlur={handleCellEditFinish}
                                autoFocus
                              />
                            ) : column.options ? (
                              <Select
                                value={row[key]}
                                onChange={(e) =>
                                  handleCellEdit(e, actualRowIndex, key)
                                }
                                onBlur={handleCellEditFinish}
                                autoFocus
                              >
                                {column.options.map((option, index) => (
                                  <option key={index} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </Select>
                            ) : (
                              <Input
                                type={
                                  column.type === "number" ? "number" : "text"
                                }
                                value={row[key]}
                                onChange={(e) =>
                                  handleCellEdit(e, actualRowIndex, key)
                                }
                                onBlur={handleCellEditFinish}
                                autoFocus
                              />
                            )
                          ) : (
                            <div className="min-h-[24px]">
                              {column.type === "boolean" ? (
                                row[key] ? (
                                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
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
                                      className="mr-1"
                                    >
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    True
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
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
                                      className="mr-1"
                                    >
                                      <line
                                        x1="18"
                                        y1="6"
                                        x2="6"
                                        y2="18"
                                      ></line>
                                      <line
                                        x1="6"
                                        y1="6"
                                        x2="18"
                                        y2="18"
                                      ></line>
                                    </svg>
                                    False
                                  </span>
                                )
                              ) : column.type === "date" ? (
                                new Date(row[key]).toLocaleDateString()
                              ) : column.options ? (
                                column.options.find(
                                  (option) => option.value === row[key]
                                )?.label || row[key]
                              ) : (
                                row[key]
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}

                    {/* Actions */}
                    <td className="border-b border-gray-200 px-4 py-2">
                      <div className="flex space-x-2">
                        {/* Enhanced Edit Button */}
                        <Tooltip content="Edit">
                          <Button
                            variant="primary"
                            size="sm"
                            className="h-9 w-9 p-0 flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 ease-in-out rounded-full shadow-md"
                            onClick={() => onEdit && onEdit(row)}
                          >
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
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </Button>
                        </Tooltip>

                        {/* Enhanced Delete Button */}
                        <Tooltip content="Delete">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-9 w-9 p-0 flex items-center justify-center text-white bg-red-600 hover:bg-red-700 transition-all duration-200 ease-in-out rounded-full shadow-md"
                            onClick={() => onDelete && onDelete(row)}
                          >
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
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </Button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={
                    columnOrder.filter((key) => visibleColumns[key]).length + 3
                  }
                  className="px-4 py-8 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <p className="text-lg font-medium text-gray-900">
                      No data found
                    </p>
                    <p className="text-sm text-gray-500">
                      Try adjusting your search or filter to find what you're
                      looking for.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {filteredData.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-gray-200 bg-white px-4 py-3">
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
            {" "}
            {/* Group for nav and jump */}
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

              {/* Page numbers - renderPaginationItems() should be defined and used here */}
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
            {/* This is the new input field and button */}
            <div className="flex items-center space-x-1">
              <Input
                type="number"
                value={jumpToPageInput}
                onChange={handleJumpToPageInputChange}
                onKeyPress={handleJumpToPageKeyPress}
                className="h-8 w-16 rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-400 focus:ring-blue-400"
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
              <span className="text-sm text-gray-700 whitespace-nowrap">
                Rows per page:
              </span>
              <Select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-8 w-16"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
