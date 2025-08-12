"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import HelpGridTable from "./HelpGridTable";
import HelpGridPagination from "./HelpGridPagination";
import HelpGridColumnSelector from "./HelpGridColumnSelector";
import HelpGridSearchSettings from "./HelpGridSearchSettings"; // Added import for search settings modal
import HelpGridFilterModal from "./HelpGridFilterModal"; // Added import for filter modal

const HelpGrid = ({ 
  isOpen, 
  onClose, 
  title = "Help", 
  tableAttributes,
  onSelect, // New prop for handling selection
  existingItems = [] // New prop for existing items in drawer grid
}) => {
  // All hooks must be called in the same order every time
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('helpGridCurrentPage');
        return saved ? parseInt(saved, 10) : 1;
      } catch (e) {
        console.warn('Failed to load current page from localStorage:', e);
        return 1;
      }
    }
    return 1;
  });
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('helpGridRowsPerPage');
        return saved ? parseInt(saved, 10) : 10;
      } catch (e) {
        console.warn('Failed to load rows per page from localStorage:', e);
        return 10;
      }
    }
    return 10;
  });
  const [jumpToPageInput, setJumpToPageInput] = useState("");
  
  // Debug: Log when jumpToPageInput changes
  useEffect(() => {
    console.log('HelpGrid - jumpToPageInput changed to:', jumpToPageInput);
  }, [jumpToPageInput]);
  const [sortConfig, setSortConfig] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('helpGridSortConfig');
        return saved ? JSON.parse(saved) : { key: null, direction: 'asc' };
      } catch (e) {
        console.warn('Failed to load sort configuration from localStorage:', e);
        return { key: null, direction: 'asc' };
      }
    }
    return { key: null, direction: 'asc' };
  });
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({});
  
  // Row selection state
  const [selectedRows, setSelectedRows] = useState(new Set());
  
  // Drag and drop state
  const [draggedRow, setDraggedRow] = useState(null);
  const [dragOverRow, setDragOverRow] = useState(null);
  const [displayOrder, setDisplayOrder] = useState(null);
  const [originalOrder, setOriginalOrder] = useState(null);
  
  // Search column state
  const [showSearchColumn, setShowSearchColumn] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('helpGridShowSearchColumn');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [showSearchRow, setShowSearchRow] = useState(false);
  
  // Search functionality state
  const [searchValues, setSearchValues] = useState({});
  
  // General search state
  const [generalSearch, setGeneralSearch] = useState("");
  
  // Search column settings state
  const [searchableColumns, setSearchableColumns] = useState({});
  const [showSearchSettings, setShowSearchSettings] = useState(false);
  
  // Filter state
  const [activeColumnFilters, setActiveColumnFilters] = useState({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedColumnForFilter, setSelectedColumnForFilter] = useState(null);
  const [tempFilterConfig, setTempFilterConfig] = useState(null);
  const [columnFilterTypes, setColumnFilterTypes] = useState({});

  // Initialize visible columns when tableAttributes changes
  useEffect(() => {
    if (tableAttributes?.columns) {
      // Try to load saved column visibility from localStorage
      let initialVisibleColumns = {};
      let initialSearchableColumns = {};
      
      if (typeof window !== 'undefined') {
        const savedVisibleColumns = localStorage.getItem('helpGridVisibleColumns');
        const savedSearchableColumns = localStorage.getItem('helpGridSearchableColumns');
        
        if (savedVisibleColumns) {
          try {
            initialVisibleColumns = JSON.parse(savedVisibleColumns);
          } catch (e) {
            console.warn('Failed to parse saved visible columns:', e);
          }
        }
        
        if (savedSearchableColumns) {
          try {
            initialSearchableColumns = JSON.parse(savedSearchableColumns);
          } catch (e) {
            console.warn('Failed to parse saved searchable columns:', e);
          }
        }
      }
      
      // Set defaults for any columns that don't have saved settings
      tableAttributes.columns.forEach((column) => {
        if (initialVisibleColumns[column.key] === undefined) {
          // Hide created_at and updated_at columns by default
          initialVisibleColumns[column.key] = !['created_at', 'updated_at'].includes(column.key);
        }
        if (initialSearchableColumns[column.key] === undefined) {
          // Only make searchable columns that are visible by default
          initialSearchableColumns[column.key] = initialVisibleColumns[column.key];
        }
      });
      
      setVisibleColumns(initialVisibleColumns);
      setSearchableColumns(initialSearchableColumns);
    }
  }, [tableAttributes?.columns]);

  // Initialize original order when data changes
  useEffect(() => {
    if (tableAttributes?.data && !originalOrder) {
      setOriginalOrder([...tableAttributes.data]);
    }
  }, [tableAttributes?.data, originalOrder]);

  // Initialize filter types for each column
  useEffect(() => {
    if (tableAttributes?.columns) {
      const initialFilterTypes = {};
      tableAttributes.columns.forEach((column) => {
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
      setColumnFilterTypes(initialFilterTypes);
    }
  }, [tableAttributes?.columns]);

  // Update searchable columns when visible columns change
  useEffect(() => {
    setSearchableColumns(prev => {
      const updated = {};
      Object.keys(visibleColumns).forEach(key => {
        if (visibleColumns[key]) {
          // For newly visible columns, set searchable based on whether they should be hidden by default
          const shouldBeHiddenByDefault = ['created_at', 'updated_at'].includes(key);
          updated[key] = prev[key] !== undefined ? prev[key] : !shouldBeHiddenByDefault;
        }
      });
      return updated;
    });
  }, [visibleColumns]);

  // Persist visible columns to localStorage
  useEffect(() => {
    if (Object.keys(visibleColumns).length > 0) {
      try {
        localStorage.setItem('helpGridVisibleColumns', JSON.stringify(visibleColumns));
      } catch (e) {
        console.warn('Failed to save visible columns to localStorage:', e);
      }
    }
  }, [visibleColumns]);

  // Persist searchable columns to localStorage
  useEffect(() => {
    if (Object.keys(searchableColumns).length > 0) {
      try {
        localStorage.setItem('helpGridSearchableColumns', JSON.stringify(searchableColumns));
      } catch (e) {
        console.warn('Failed to save searchable columns to localStorage:', e);
      }
    }
  }, [searchableColumns]);

  // Persist rows per page to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('helpGridRowsPerPage', rowsPerPage.toString());
    } catch (e) {
      console.warn('Failed to save rows per page to localStorage:', e);
    }
  }, [rowsPerPage]);

  // Persist sort configuration to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('helpGridSortConfig', JSON.stringify(sortConfig));
    } catch (e) {
      console.warn('Failed to save sort configuration to localStorage:', e);
    }
  }, [sortConfig]);

  // Persist current page to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('helpGridCurrentPage', currentPage.toString());
    } catch (e) {
      console.warn('Failed to save current page to localStorage:', e);
    }
  }, [currentPage]);

  // Check if an item is already in the drawer grid (should be disabled)
  const isItemAlreadyAdded = useCallback((item) => {
    // Only consider items that actually have data
    const itemsWithData = existingItems.filter(existingItem => 
      existingItem.item_id || (existingItem.itemcode && existingItem.itemcode.trim() !== '')
    );
    
    const result = itemsWithData.some(existingItem => 
      existingItem.item_id === item.id || 
      existingItem.itemcode === item.code || 
      existingItem.itemcode === item.itemcode
    );
    
    console.log('isItemAlreadyAdded check:', {
      item,
      existingItems: itemsWithData, // Only show items with data
      result
    });
    
    return result;
  }, [existingItems]);

  // Clear selections when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      console.log('Modal opening, existingItems:', existingItems);
      
      // Mark existing items as pre-selected but disabled
      const existingItemIds = new Set();
      
      // Only process items that actually have data
      const itemsWithData = existingItems.filter(item => 
        item.item_id || (item.itemcode && item.itemcode.trim() !== '')
      );
      
      itemsWithData.forEach(item => {
        if (item.item_id) {
          existingItemIds.add(item.item_id);
          console.log('Added existing item_id:', item.item_id);
        }
        if (item.itemcode) {
          existingItemIds.add(item.itemcode);
          console.log('Added existing itemcode:', item.itemcode);
        }
      });
      
      console.log('Final existingItemIds:', Array.from(existingItemIds));
      
      // Set existing items as pre-selected (for visual indication)
      setSelectedRows(existingItemIds);
      
      setCurrentPage(1); // Reset to first page
    } else {
      // Clear selections when modal closes
      setSelectedRows(new Set());
      
      // Clear all search values when modal closes
      setSearchValues({});
      setGeneralSearch("");
      setShowSearchRow(false); // Also hide the search row
      
      // Reset reordered data to original order
      setDisplayOrder(null);
      setOriginalOrder(null);
      
      // Clear all filters when modal closes
      setActiveColumnFilters({});
    }
  }, [isOpen, existingItems]);

  // Persist search column state
  useEffect(() => {
    localStorage.setItem('helpGridShowSearchColumn', showSearchColumn.toString());
  }, [showSearchColumn]);

  // Reset to first page when search values change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValues]);

  // Reset to first page when general search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [generalSearch]);

  // Check if current order is different from original
  const isOrderChanged = useMemo(() => {
    if (!displayOrder || !originalOrder) return false;
    
    // Compare the current display order with the original order
    // We need to compare based on item identifiers, not just array positions
    const currentIds = displayOrder.map(item => item.id || item.itemcode);
    const originalIds = originalOrder.map(item => item.id || item.itemcode);
    
    // Check if the arrays have the same items in the same order
    if (currentIds.length !== originalIds.length) return true;
    
    for (let i = 0; i < currentIds.length; i++) {
      if (currentIds[i] !== originalIds[i]) return true;
    }
    
    return false;
  }, [displayOrder, originalOrder]);

  // Reset to first page when data is reordered
  useEffect(() => {
    if (isOrderChanged) {
      setCurrentPage(1);
    }
  }, [isOrderChanged]);

  // Filter columns based on visibility
  const filteredColumns = useMemo(() => {
    return tableAttributes?.columns?.filter(column => visibleColumns[column.key]) || [];
  }, [tableAttributes?.columns, visibleColumns]);

  // Memoized data and columns
  const sortedData = useMemo(() => {
    if (!tableAttributes?.data) {
      return [];
    }

    // Start with the original data
    let filteredData = [...tableAttributes.data];

    // Apply general search filtering (searches across all visible columns)
    if (generalSearch && generalSearch.trim() !== '') {
      const searchTerm = generalSearch.toLowerCase().trim();
      filteredData = filteredData.filter(row => {
        // Search only in visible AND searchable columns
        return filteredColumns.some(column => {
          // Only search in columns that are both visible and searchable
          if (!searchableColumns[column.key]) return false;
          
          const cellValue = row[column.key];
          if (cellValue === null || cellValue === undefined) return false;
          
          const cellString = String(cellValue).toLowerCase();
          return cellString.includes(searchTerm);
        });
      });
    }

    // Apply column-specific search filtering
    if (showSearchRow && Object.keys(searchValues).length > 0) {
      filteredData = filteredData.filter(row => {
        return Object.entries(searchValues).every(([columnKey, searchValue]) => {
          if (!searchValue || searchValue.trim() === '') return true;
          
          const cellValue = row[columnKey];
          if (cellValue === null || cellValue === undefined) return false;
          
          const searchLower = searchValue.toLowerCase().trim();
          const cellString = String(cellValue).toLowerCase();
          
          return cellString.includes(searchLower);
        });
      });
    }

    // Apply column filters
    if (Object.keys(activeColumnFilters).length > 0) {
      filteredData = filteredData.filter(row => {
        return Object.entries(activeColumnFilters).every(([columnKey, filterConfig]) => {
          if (!filterConfig || !filterConfig.type || !filterConfig.value) return true;
          
          const cellValue = row[columnKey];
          if (cellValue === null || cellValue === undefined) return false;
          
          const { type, value } = filterConfig;
          
          // Get column type to apply appropriate filter logic
          const column = filteredColumns.find(col => col.key === columnKey);
          const columnType = column ? column.type : "text";
          
          switch (type) {
            case 'equals':
              if (columnType === "date") {
                // Handle date equality by comparing only date parts (year, month, day)
                const cellDate = new Date(cellValue);
                const filterDate = new Date(value);
                return (
                  cellDate.getFullYear() === filterDate.getFullYear() &&
                  cellDate.getMonth() === filterDate.getMonth() &&
                  cellDate.getDate() === filterDate.getDate()
                );
              } else if (columnType === "number") {
                return Number(cellValue) === Number(value);
              } else {
                return String(cellValue).toLowerCase() === String(value).toLowerCase();
              }
            case 'contains':
              return String(cellValue).toLowerCase().includes(String(value).toLowerCase());
            case 'startsWith':
              return String(cellValue).toLowerCase().startsWith(String(value).toLowerCase());
            case 'endsWith':
              return String(cellValue).toLowerCase().endsWith(String(value).toLowerCase());
            case 'greaterThan':
              if (columnType === "date") {
                return new Date(cellValue) > new Date(value);
              } else {
                return Number(cellValue) > Number(value);
              }
            case 'lessThan':
              if (columnType === "date") {
                return new Date(cellValue) < new Date(value);
              } else {
                return Number(cellValue) < Number(value);
              }
            case 'before':
              return new Date(cellValue) < new Date(value);
            case 'after':
              return new Date(cellValue) > new Date(value);
            case 'between':
              if (typeof value === 'string' && value.includes(',')) {
                const [min, max] = value.split(',');
                if (columnType === "number") {
                  return Number(cellValue) >= Number(min) && Number(cellValue) <= Number(max);
                } else if (columnType === "date") {
                  const cellDate = new Date(cellValue);
                  return cellDate >= new Date(min) && cellDate <= new Date(max);
                }
              }
              return false;
            default:
              return true;
          }
        });
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (typeof aValue === 'string') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortConfig.direction === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      });
    }

    // Apply custom display order if available
    if (displayOrder && displayOrder.length > 0) {
      // Create a map for quick lookup
      const orderMap = new Map();
      displayOrder.forEach((item, index) => {
        const key = item.id || item.itemcode || index;
        orderMap.set(key, index);
      });
      
      // Sort based on the custom order
      filteredData.sort((a, b) => {
        const aKey = a.id || a.itemcode;
        const bKey = b.id || b.itemcode;
        const aOrder = orderMap.get(aKey) ?? Number.MAX_SAFE_INTEGER;
        const bOrder = orderMap.get(bKey) ?? Number.MAX_SAFE_INTEGER;
        return aOrder - bOrder;
      });
    }

    return filteredData;
  }, [tableAttributes?.data, displayOrder, sortConfig, showSearchRow, searchValues, generalSearch, filteredColumns, searchableColumns, activeColumnFilters]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(sortedData.length / rowsPerPage);
  }, [sortedData.length, rowsPerPage]);

  // Check if all rows on current page are selected
  const areAllOnPageSelected = useMemo(() => {
    const selectableItems = paginatedData.filter(item => !isItemAlreadyAdded(item));
    return selectableItems.length > 0 && 
      selectableItems.every((item, index) => {
        const itemId = item.id || item.itemcode || index;
        return selectedRows.has(itemId);
      });
  }, [paginatedData, selectedRows, isItemAlreadyAdded]);

  // Get items that can be selected (not already added)
  const selectableItems = useMemo(() => {
    return paginatedData.filter(item => !isItemAlreadyAdded(item));
  }, [paginatedData, isItemAlreadyAdded]);

  // Check if all selectable items are selected
  const areAllSelectableItemsSelected = useMemo(() => {
    return selectableItems.length > 0 && 
      selectableItems.every(item => selectedRows.has(item.id || item.itemcode));
  }, [selectableItems, selectedRows]);

  if (!isOpen) return null;

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  // Jump to page handlers
  const handleJumpToPageInputChange = (e) => {
    setJumpToPageInput(e.target.value);
  };

  const handleJumpToPage = () => {
    if (!jumpToPageInput || jumpToPageInput.trim() === "") {
      return; // Don't jump if input is empty
    }
    
    const pageNumber = parseInt(jumpToPageInput, 10);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Clear the input after jumping to show placeholder again
      setJumpToPageInput("");
    }
  };

  const handleJumpToPageKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleJumpToPage();
    }
  };

  const handleColumnVisibilitySave = (newVisibleColumns) => {
    setVisibleColumns(newVisibleColumns);
    setCurrentPage(1); // Reset to first page when columns change
  };

  // Row selection handlers
  const handleRowSelect = (rowId) => {
    console.log('handleRowSelect called with:', rowId);
    console.log('Current selectedRows before:', Array.from(selectedRows));
    
    setSelectedRows((prevSelectedRows) => {
      const newSelectedRows = new Set(prevSelectedRows);
      if (newSelectedRows.has(rowId)) {
        newSelectedRows.delete(rowId);
        console.log('Removed rowId:', rowId);
      } else {
        newSelectedRows.add(rowId);
        console.log('Added rowId:', rowId);
      }
      
      console.log('New selectedRows:', Array.from(newSelectedRows));
      return newSelectedRows;
    });
  };

  const handleSelectAll = () => {
    // Only select/deselect selectable items (not already added)
    const selectableItemIds = paginatedData
      .filter(item => !isItemAlreadyAdded(item))
      .map((item, index) => item.id || item.itemcode || index);
    
    const areAllSelectableSelected = selectableItemIds.every((id) => selectedRows.has(id));
    
    setSelectedRows((prevSelectedRows) => {
      const newSelectedRows = new Set(prevSelectedRows);
      
      if (areAllSelectableSelected) {
        // Deselect all selectable items
        selectableItemIds.forEach((id) => newSelectedRows.delete(id));
      } else {
        // Select all selectable items (keep existing selections for already added items)
        selectableItemIds.forEach((id) => newSelectedRows.add(id));
      }
      return newSelectedRows;
    });
  };

  // Search column handlers
  const handleToggleSearchColumn = () => {
    setShowSearchColumn((prev) => !prev);
  };

  const handleToggleSearchRow = () => {
    setShowSearchRow((prev) => !prev);
  };

  // Search value handlers
  const handleSearchValueChange = (columnKey, value) => {
    setSearchValues(prev => ({
      ...prev,
      [columnKey]: value
    }));
  };

  const handleClearAllSearch = () => {
    setSearchValues({});
    setGeneralSearch("");
  };

  const handleGeneralSearchChange = (value) => {
    setGeneralSearch(value);
  };

  const handleSearchColumnSettingsSave = (newSearchableColumns) => {
    setSearchableColumns(newSearchableColumns);
    setShowSearchSettings(false);
  };

  // Drag and drop handlers
  const handleDragStart = (e, row, rowIndex) => {
    console.log('Drag started:', { row, rowIndex, rowId: row.id || row.itemcode });
    setDraggedRow({ row, index: rowIndex });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', ''); // Required for Firefox
  };

  const handleDragOver = (e, row, rowIndex) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverRow({ row, index: rowIndex });
  };

  const handleDragLeave = () => {
    setDragOverRow(null);
  };

  const handleDrop = (e, targetRow, targetIndex) => {
    e.preventDefault();
    
    if (!draggedRow || draggedRow.index === targetIndex) {
      setDraggedRow(null);
      setDragOverRow(null);
      return;
    }

    // Get the current displayed data (after filtering, sorting, etc.)
    const currentDisplayedData = sortedData;
    
    // Find the actual items in the current displayed data
    const draggedItem = currentDisplayedData[draggedRow.index];
    const targetItem = currentDisplayedData[targetIndex];
    
    if (!draggedItem || !targetItem) {
      console.warn('Drag and drop failed: Invalid items', { draggedItem, targetItem, draggedRow, targetIndex });
      setDraggedRow(null);
      setDragOverRow(null);
      return;
    }

    // Create a new display order based on the current displayed data
    const newDisplayOrder = [...currentDisplayedData];
    const [removedItem] = newDisplayOrder.splice(draggedRow.index, 1);
    newDisplayOrder.splice(targetIndex, 0, removedItem);

    console.log('Drag and drop successful:', {
      from: draggedRow.index,
      to: targetIndex,
      draggedItem: draggedItem.id || draggedItem.itemcode,
      targetItem: targetItem.id || targetItem.itemcode,
      newDisplayOrderLength: newDisplayOrder.length
    });

    // Update the display order state
    setDisplayOrder(newDisplayOrder);

    setDraggedRow(null);
    setDragOverRow(null);
  };

  const handleDragEnd = () => {
    setDraggedRow(null);
    setDragOverRow(null);
  };

  // Reset reordered data to original order
  const handleResetOrder = () => {
    setDisplayOrder(null);
  };

  // Filter handlers
  const handleOpenFilterModal = (columnKey) => {
    setSelectedColumnForFilter(columnKey);
    const column = tableAttributes.columns.find((col) => col.key === columnKey);
    const currentFilter = activeColumnFilters[columnKey];

    setTempFilterConfig({
      type: currentFilter?.type || columnFilterTypes[columnKey],
      value: currentFilter?.value || "",
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

  const handleFilterTypeChange = (columnKey, type) => {
    setTempFilterConfig(prev => ({
      ...prev,
      type
    }));
  };

  const handleFilterValueChange = (columnKey, value) => {
    setTempFilterConfig(prev => ({
      ...prev,
      value
    }));
  };

  const handleClearAllFilters = () => {
    setActiveColumnFilters({});
    setCurrentPage(1);
  };

  const handleClearColumnFilter = (columnKey) => {
    setActiveColumnFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[columnKey];
      return newFilters;
    });
    setCurrentPage(1);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-background rounded-lg shadow-xl w-[1200px] h-[600px] overflow-hidden border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-foreground">
              {title}
            </h2>
            {(() => {
              // Only count rows that actually have item data
              const itemsWithData = existingItems.filter(item => 
                item.item_id || (item.itemcode && item.itemcode.trim() !== '')
              );
              return itemsWithData.length > 0 ? (
                <span className="px-2 py-1 text-sm bg-muted text-muted-foreground rounded-md border border-border">
                  {itemsWithData.length} item{itemsWithData.length === 1 ? '' : 's'} already added
                </span>
              ) : null;
            })()}
            {selectedRows.size > 0 && (
              <span className="px-2 py-1 text-sm bg-primary/10 text-primary rounded-md border border-primary/20">
                {(() => {
                  const selectedSelectableCount = paginatedData.filter((row, index) => {
                    const rowId = row.id || row.itemcode || index;
                    return selectedRows.has(rowId) && !isItemAlreadyAdded(row);
                  }).length;
                  return `${selectedSelectableCount} selectable item${selectedSelectableCount === 1 ? '' : 's'} selected`;
                })()}
              </span>
            )}
            {(showSearchRow && Object.keys(searchValues).length > 0) || generalSearch ? (
              <button
                onClick={handleClearAllSearch}
                className="px-2 py-1 text-sm bg-destructive/10 text-destructive rounded-md border border-destructive/20 hover:bg-destructive/20 transition-colors"
              >
                Clear All Search
              </button>
            ) : null}
            {(showSearchRow && Object.keys(searchValues).length > 0) || generalSearch ? (
              <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-md border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                {sortedData.length} result{sortedData.length === 1 ? '' : 's'} found
              </span>
            ) : null}
            {Object.keys(activeColumnFilters).length > 0 && (
              <button
                onClick={handleClearAllFilters}
                className="px-2 py-1 text-sm bg-red-100 text-red-800 rounded-md border border-red-200 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900/40 transition-colors"
                title="Clear all filters"
              >
                Clear Filters ({Object.keys(activeColumnFilters).length})
              </button>
            )}
            {isOrderChanged && (
              <button
                onClick={handleResetOrder}
                className="px-2 py-1 text-sm bg-orange-100 text-orange-800 rounded-md border border-orange-200 hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800 dark:hover:bg-orange-900/40 transition-colors"
                title="Reset to original order"
              >
                Reset Order
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-hidden h-[calc(600px-120px)]">
          {tableAttributes ? (
            <div className="space-y-4 h-full flex flex-col">
              {/* General Search Bar */}
              <div className="flex-shrink-0">
                <div className="flex items-center gap-4">
                  {/* General Search Input */}
                  <div className="flex-1 max-w-xs">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Search all columns..."
                        value={generalSearch}
                        onChange={(e) => handleGeneralSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                      />
                      {generalSearch && (
                        <button
                          onClick={() => handleGeneralSearchChange("")}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Search Settings Button */}
                  <button
                    onClick={() => setShowSearchSettings(true)}
                    className="px-3 py-3 text-sm border border-border rounded hover:bg-muted text-muted-foreground flex items-center gap-2"
                    title="Configure searchable columns"
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
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l-.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                  </button>
                  
                  {/* Column Settings Button - Moved to right side of table */}
                  <button
                    onClick={() => setShowColumnSelector(true)}
                    className="px-3 py-3 text-sm border border-border rounded hover:bg-muted text-muted-foreground flex items-center gap-2 ml-auto"
                    title="Configure visible columns"
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
                  </button>
                  
                  {/* Search Status */}
                  {generalSearch && (
                    <div className="text-sm text-muted-foreground">
                      Searching for "{generalSearch}" in {Object.values(searchableColumns).filter(Boolean).length} searchable column{Object.values(searchableColumns).filter(Boolean).length === 1 ? '' : 's'}
                    </div>
                  )}
                </div>
              </div>

              {/* Table Component */}
              <div className="flex-1 overflow-hidden">
                <HelpGridTable
                  tableAttributes={{
                    ...tableAttributes,
                    columns: filteredColumns
                  }}
                  paginatedData={paginatedData}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  selectedRows={selectedRows}
                  onRowSelect={handleRowSelect}
                  areAllOnPageSelected={areAllOnPageSelected}
                  onSelectAll={handleSelectAll}
                  showSearchColumn={showSearchColumn}
                  showSearchRow={showSearchRow}
                  onToggleSearchColumn={handleToggleSearchColumn}
                  onToggleSearchRow={handleToggleSearchRow}
                  isItemAlreadyAdded={isItemAlreadyAdded}
                  onSearchValueChange={handleSearchValueChange}
                  searchValues={searchValues}
                  // Drag and drop props
                  draggedRow={draggedRow}
                  dragOverRow={dragOverRow}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  // Filter props
                  activeColumnFilters={activeColumnFilters}
                  onOpenFilterModal={handleOpenFilterModal}
                  onClearColumnFilter={handleClearColumnFilter}
                />
              </div>
              
              {/* Footer with Pagination and Add Button - Always visible */}
              <div className="flex-shrink-0 border-t border-border pt-2 flex items-center justify-between bg-background">
                {/* Pagination Component */}
                <div className="flex-1">
                  <HelpGridPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={sortedData.length}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    jumpToPageInput={jumpToPageInput}
                    onJumpToPageInputChange={handleJumpToPageInputChange}
                    onJumpToPage={handleJumpToPage}
                    onJumpToPageKeyPress={handleJumpToPageKeyPress}
                  />
                </div>
                
                {/* Add Button - Only active when selectable items are selected */}
                <div className="flex justify-end ml-6 w-[120px]">
                  <button
                    onClick={() => {
                      // Only proceed if selectable items are selected
                      const selectedSelectableItems = paginatedData.filter((row, index) => {
                        const rowId = row.id || row.itemcode || index;
                        const isSelected = selectedRows.has(rowId);
                        const isAlreadyAdded = isItemAlreadyAdded(row);
                        
                        console.log(`Row ${index}:`, {
                          row,
                          rowId,
                          isSelected,
                          isAlreadyAdded,
                          selectedRows: Array.from(selectedRows)
                        });
                        
                        return isSelected && !isAlreadyAdded;
                      });
                      
                      console.log('Final selected items to add:', selectedSelectableItems);
                      
                      if (selectedSelectableItems.length > 0) {
                        // Add the selected selectable items
                        if (onSelect) {
                          onSelect(selectedSelectableItems);
                        }
                        
                        // Close the modal after adding
                        onClose();
                      }
                      // If no selectable items selected, do nothing
                    }}
                    disabled={selectableItems.length === 0 || selectedRows.size === 0}
                    className={`px-4 py-2 rounded-md focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors duration-200 flex items-center gap-2 justify-center ${
                      selectableItems.length > 0 && selectedRows.size > 0
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                    }`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <path d="M5 12h14"></path>
                      <path d="M12 5v14"></path>
                    </svg>
                    {selectableItems.length > 0 && selectedRows.size > 0 
                      ? (() => {
                          const selectedSelectableCount = paginatedData.filter((row, index) => {
                            const rowId = row.id || row.itemcode || index;
                            return selectedRows.has(rowId) && !isItemAlreadyAdded(row);
                          }).length;
                          return `Add (${selectedSelectableCount})`;
                        })()
                      : 'Add'
                    }
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Help content will be displayed here.
            </p>
          )}
        </div>
      </div>

      {/* Column Selector Modal */}
      <HelpGridColumnSelector
        isOpen={showColumnSelector}
        onClose={() => setShowColumnSelector(false)}
        columns={tableAttributes?.columns || []}
        visibleColumns={visibleColumns}
        onSave={handleColumnVisibilitySave}
      />

      {/* Search Column Settings Modal */}
      <HelpGridSearchSettings
        isOpen={showSearchSettings}
        onClose={() => setShowSearchSettings(false)}
        columns={tableAttributes?.columns || []}
        searchableColumns={searchableColumns}
        visibleColumns={visibleColumns}
        onSave={handleSearchColumnSettingsSave}
      />

      {/* Filter Modal */}
      <HelpGridFilterModal
        isOpen={showFilterModal}
        selectedColumn={selectedColumnForFilter}
        columns={tableAttributes?.columns || []}
        filterType={tempFilterConfig?.type}
        filterValue={tempFilterConfig?.value}
        onSave={handleSaveFilter}
        onCancel={handleCancelFilter}
        onFilterTypeChange={handleFilterTypeChange}
        onFilterValueChange={handleFilterValueChange}
      />
    </div>
  );
};

export default HelpGrid;
