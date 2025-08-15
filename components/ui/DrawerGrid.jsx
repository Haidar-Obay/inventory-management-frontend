"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Autocomplete,
  useTheme,
} from "@mui/material";
import { Plus, Trash2, HelpCircle } from "lucide-react";
import RTLTextField from "@/components/ui/RTLTextField";
import { useTranslations, useLocale } from "next-intl";
import { useDrawerStack } from "@/components/ui/DrawerStackContext";
import HelpGrid from "@/components/ui/HelpGrid";

const DrawerGrid = ({
  gridData,
  onGridDataChange,
  onAddRow,
  onRemoveRow,
  disabled = false,
  columns = [],
  title = "",
  translationNamespace = "common",
  columnActions = {},
  // New props for help functionality
  helpData = null,
  helpColumns = [],
  helpLoading = false,
}) => {
  const t = useTranslations(translationNamespace);
  const locale = useLocale();
  const theme = useTheme();
  const isRTL = locale === "ar";
  const { openDrawer } = useDrawerStack();
  
  // Check if we're in dark mode
  const isDarkMode = theme.palette.mode === 'dark';
  
  // State for help modal
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [helpModalTitle, setHelpModalTitle] = useState("Help");
  const [tableAttributes, setTableAttributes] = useState(null);
  const [currentEditingRowId, setCurrentEditingRowId] = useState(null);

  // Fast lookup from itemcode -> id (only if helpData is provided)
  const itemCodeToId = useMemo(() => {
    if (!helpData || !Array.isArray(helpData)) return new Map();
    
    const map = new Map();
    helpData.forEach((it) => {
      if (it && it.itemcode != null) map.set(String(it.itemcode), it.id);
    });
    return map;
  }, [helpData]);

  // Handler for when items are added from help modal
  const handleHelpAdd = (addedItems) => {
    console.log('DrawerGrid: Received items from help modal:', addedItems);
    console.log('DrawerGrid: Current editing row ID:', currentEditingRowId);
    
    if (addedItems && addedItems.length > 0) {
      // Start with a copy of current grid data
      let updatedGridData = [...gridData];
      
      // Process each added item
      addedItems.forEach((item, index) => {
        console.log(`DrawerGrid: Processing item ${index}:`, item);
        
        if (index === 0) {
          // First item: update the row that opened the help modal
          if (currentEditingRowId) {
            console.log(`DrawerGrid: Updating row ${currentEditingRowId} with item:`, item);
            updatedGridData = updatedGridData.map(row => {
              if (row.id === currentEditingRowId) {
                return {
                  ...row,
                  item_id: item.id || null,
                  itemcode: item.code || item.itemcode || "",
                  price: item.price || 0,
                };
              }
              return row;
            });
          } else {
            // Fallback: try to find an empty row or use the first row
            const emptyRow = updatedGridData.find(row => !row.item_id && !row.itemcode);
            if (emptyRow) {
              console.log(`DrawerGrid: Found empty row ${emptyRow.id}, updating with item:`, item);
              updatedGridData = updatedGridData.map(row => {
                if (row.id === emptyRow.id) {
                  return {
                    ...row,
                    item_id: item.id || null,
                    itemcode: item.code || item.itemcode || "",
                    price: item.price || 0,
                  };
                }
                return row;
              });
            } else {
              // No empty row found, update the first row
              console.log(`DrawerGrid: No empty row found, updating first row with item:`, item);
              updatedGridData = updatedGridData.map((row, idx) => {
                if (idx === 0) {
                  return {
                    ...row,
                    item_id: item.id || null,
                    itemcode: item.code || item.itemcode || "",
                    price: item.price || 0,
                  };
                }
                return row;
              });
            }
          }
        } else {
          // Additional items: add new rows
          console.log(`DrawerGrid: Adding new row for item ${index}:`, item);
          const newRow = {
            id: `row_${Date.now()}_${index}`,
            item_id: item.id || null,
            itemcode: item.code || item.itemcode || "",
            price: item.price || 0,
            discount: 0,
            isEnabled: true,
          };
          
          // Add new row to the updated grid data
          updatedGridData.push(newRow);
        }
      });
      
      // Apply all changes at once
      console.log('DrawerGrid: Applying all changes at once:', updatedGridData);
      onGridDataChange(updatedGridData);
      
      console.log('DrawerGrid: Finished processing all items');
    }
    
    // Reset the current editing row ID
    setCurrentEditingRowId(null);
    
    // Close the help modal
    setHelpModalOpen(false);
  };

  const getRowItemId = (row) => {
    if (row.item_id !== undefined && row.item_id !== null) return row.item_id;
    if (row.itemcode !== undefined && row.itemcode !== null && row.itemcode !== "") {
      const mapped = itemCodeToId.get(String(row.itemcode));
      if (mapped !== undefined) return mapped;
      const numeric = Number(row.itemcode);
      if (!Number.isNaN(numeric)) return numeric;
    }
    return null;
  };

  // Create options without Add button
  const createOptions = (options) => {
    return options;
  };

  const handleGridDataChange = (rowId, field, value) => {
    if (onGridDataChange) {
      const updatedGridData = gridData.map(row => {
        if (row.id === rowId) {
          // Convert numeric fields to numbers
          if (field === "price" || field === "discount" || field === "quantity" || field === "amount") {
            const numValue = value === "" ? 0 : parseFloat(value);
            return { ...row, [field]: isNaN(numValue) ? 0 : numValue };
          }
          return { ...row, [field]: value };
        }
        return row;
      });
      onGridDataChange(updatedGridData);
    }
  };

  // Function to handle item selection and auto-fill price
  const handleItemSelection = (rowId, selectedItem) => {
    if (onGridDataChange) {
      const updatedGridData = gridData.map((gRow) => {
        if (gRow.id === rowId) {
          return {
            ...gRow,
            item_id: selectedItem?.id ?? null,
            itemcode: selectedItem?.itemcode ?? "",
            // Auto-fill price with item's price if available
            price: selectedItem?.price ?? 0,
          };
        }
        return gRow;
      });
      onGridDataChange(updatedGridData);
    }
  };

  // Get background color based on theme
  const getBackgroundColor = () => {
    return isDarkMode ? 'rgb(16 20 29)' : 'rgb(249 250 251)';
  };

  const renderCell = (row, column) => {
    const { field, type = "text", ...fieldProps } = column;
    const columnConfig = columnActions[field] || {};
    const showAddButton = columnConfig.showAddButton || false;
    const showHelpButton = columnConfig.showHelpButton || false;
    
    // Special handling for item selector with Autocomplete (supports both `itemcode` and `item_id` field keys)
    if (field === "itemcode" || field === "item_id") {
      const currentRowItemId = getRowItemId(row);
      const selectedIds = new Set(
        (gridData || [])
          .filter((r) => r.id !== row.id)
          .map((r) => getRowItemId(r))
          .filter((id) => id !== null && id !== undefined)
      );
      
      // Use helpData if provided, otherwise show empty options
      const availableOptions = helpData ? helpData.filter(
        (item) => item.id === currentRowItemId || !selectedIds.has(item.id)
      ) : [];
      
      return (
        <Box sx={{ 
          position: 'relative',
          '&:hover .action-buttons': {
            opacity: 1,
          },
          '&:focus-within .action-buttons': {
            opacity: 1,
          }
        }}>
          <Autocomplete
            key={`${row.id}-${row.item_id ?? row.itemcode ?? 'empty'}`}
            fullWidth
            size="small"
            options={createOptions(availableOptions)}
            getOptionLabel={(option) => {
              if (!option) return "";
              return `${option.code || ""} - ${option.name || ""}`;
            }}
            isOptionEqualToValue={(option, value) => {
              if (!option || !value) return false;
              if (option.id !== undefined && value.id !== undefined) return option.id === value.id;
              return option.itemcode === value.itemcode;
            }}
            value={
              (() => {
                if (row.item_id !== undefined && row.item_id !== null) {
                  return helpData ? helpData.find((item) => item.id === row.item_id) || null : null;
                }
                if (row.itemcode !== undefined && row.itemcode !== null && row.itemcode !== "") {
                  return helpData ? helpData.find((item) => item.id === row.itemcode || item.itemcode === row.itemcode) || null : null;
                }
                return null;
              })()
            }
            onChange={(event, newValue) => {
              // Update both item_id (authoritative) and itemcode (for backward compatibility/display)
              // Also auto-fill price with the selected item's price
              handleItemSelection(row.id, newValue);
            }}
            loading={helpLoading}
            disabled={disabled || !row.isEnabled}
            renderInput={(params) => (
              <RTLTextField 
                {...params} 
                placeholder=""
                label={null}
                InputLabelProps={{ shrink: false }}
                sx={{ 
                  '& .MuiInputBase-root': { 
                    fontSize: '0.875rem',
                    paddingRight: isRTL ? '14px' : ((showAddButton || showHelpButton) ? '100px' : '14px'),
                    paddingLeft: isRTL ? ((showAddButton || showHelpButton) ? '100px' : '14px') : '14px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    '&:hover': {
                      backgroundColor: 'transparent'
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'transparent'
                    }
                  },
                  // Override dropdown arrow positioning for RTL
                  '& .MuiAutocomplete-endAdornment': {
                    left: isRTL ? '8px' : 'auto',
                    right: isRTL ? 'auto' : '8px',
                  },
                  '& .MuiAutocomplete-popupIndicator': {
                    transform: isRTL ? 'rotate(0deg)' : 'none',
                  },
                  // Ensure proper animation for RTL
                  '& .MuiAutocomplete-popupIndicatorOpen': {
                    transform: isRTL ? 'rotate(180deg)' : 'rotate(180deg)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '& .MuiInputLabel-root': {
                    display: 'none'
                  }
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {option.code || option.itemcode || option.id || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">-</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.name || option.title || 'No Name'}
                  </Typography>
                </Box>
              </Box>
            )}
          />
          {(showAddButton || showHelpButton) && (
            <Box
              className="action-buttons"
              sx={{
                position: 'absolute',
                [isRTL ? 'left' : 'right']: isRTL ? 60 : 60,
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                gap: 0.5,
                opacity: 0,
                transition: 'opacity 0.2s',
              }}
            >
              {showAddButton && (
                <IconButton
                  size="small"
                  onClick={() => {
                    openDrawer({
                      type: "item",
                      props: {
                        onSave: (newItem) => {
                          // This should be handled by the parent component
                          // The parent can update helpData if needed
                        },
                      },
                    });
                  }}
                  sx={{ 
                    color: 'primary.main',
                    '&:hover': { backgroundColor: 'transparent' },
                    padding: '2px',
                  }}
                >
                  <Plus size={12} />
                </IconButton>
              )}
              {showHelpButton && (
                <IconButton
                  size="small"
                  onClick={() => {
                    // Store the current row ID for later use
                    setCurrentEditingRowId(row.id);
                    
                    // Set table attributes for the help modal using props
                    const attributes = {
                      data: helpData || [],
                      columns: helpColumns || [],
                      onAdd: () => {},
                      loading: helpLoading || false,
                      enableCellEditing: false,
                      onExportExcel: () => {},
                      onExportPdf: () => {},
                      onPrint: () => {},
                      onRefresh: () => {},
                      onImportExcel: () => {},
                      tableId: "help-table",
                      customActions: [],
                      onCustomAction: () => {},
                      onDelete: () => {},
                    };
                    setTableAttributes(attributes);
                    setHelpModalTitle("Help - Item");
                    setHelpModalOpen(true);
                  }}
                  sx={{ 
                    color: 'info.main',
                    '&:hover': { backgroundColor: 'transparent' },
                    padding: '2px',
                  }}
                  title={t("help")}
                >
                  <HelpCircle size={12} />
                </IconButton>
              )}
            </Box>
          )}
        </Box>
      );
    }
    
    // Regular text field for other fields
    return (
      <Box sx={{ 
        position: 'relative',
        '&:hover .action-buttons': {
          opacity: 1,
        },
        '&:focus-within .action-buttons': {
          opacity: 1,
        }
      }}>
        <RTLTextField
          value={row[field] || ""}
          onChange={(e) => handleGridDataChange(row.id, field, e.target.value)}
          fullWidth
          size="small"
          type={type}
          disabled={disabled || !row.isEnabled || field === "price"}
          placeholder=""
          label={null}
          InputLabelProps={{ shrink: false }}
          sx={{ 
            '& .MuiInputBase-root': { 
              fontSize: '0.875rem',
              paddingRight: isRTL ? '14px' : ((showAddButton || showHelpButton) ? '100px' : '14px'),
              paddingLeft: isRTL ? ((showAddButton || showHelpButton) ? '100px' : '14px') : '14px',
              border: 'none',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent'
              },
              '&.Mui-focused': {
                backgroundColor: 'transparent'
              }
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              border: 'none'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: 'none'
            },
            '& .MuiInputLabel-root': {
              display: 'none'
            }
          }}
          {...fieldProps}
        />
        {(showAddButton || showHelpButton) && (
          <Box
            className="action-buttons"
            sx={{
              position: 'absolute',
              [isRTL ? 'left' : 'right']: isRTL ? 8 : 8,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              gap: 0.5,
              opacity: 0,
              transition: 'opacity 0.2s',
            }}
          >
            {showAddButton && (
              <IconButton
                size="small"
                onClick={() => {
                  openDrawer({
                    type: "item",
                    props: {
                      onSave: (newItem) => {
                        // This should be handled by the parent component
                        // The parent can update helpData if needed
                      },
                    },
                  });
                }}
                sx={{ 
                  color: 'primary.main',
                  '&:hover': { backgroundColor: 'transparent' },
                  padding: '2px',
                }}
              >
                <Plus size={12} />
              </IconButton>
            )}
            {showHelpButton && (
              <IconButton
                size="small"
                onClick={() => {
                  // Set table attributes for the help modal using props
                  const attributes = {
                    data: helpData || [],
                    columns: helpColumns || [],
                    onAdd: () => {},
                    loading: helpLoading || false,
                    enableCellEditing: false,
                    onExportExcel: () => {},
                    onExportPdf: () => {},
                    onPrint: () => {},
                    onRefresh: () => {},
                    onImportExcel: () => {},
                    tableId: "help-table",
                    customActions: [],
                    onCustomAction: () => {},
                    onDelete: () => {},
                  };
                  setTableAttributes(attributes);
                  setHelpModalTitle("Help - Item");
                  setHelpModalOpen(true);
                }}
                sx={{ 
                  color: 'info.main',
                  '&:hover': { backgroundColor: 'transparent' },
                  padding: '2px',
                }}
                title={t("help")}
              >
                <HelpCircle size={12} />
              </IconButton>
            )}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ mb: 2 }}>
      {title && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: isRTL ? "right" : "left" }}>
          {title}
        </Typography>
      )}
      
      <TableContainer 
        component={Paper} 
        sx={{ 
          border: '1px solid', 
          borderColor: 'divider',
          borderRadius: 0,
          boxShadow: 'none',
          backgroundColor: getBackgroundColor()
        }}
      >
        <Table size="small" sx={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow sx={{ 
              backgroundColor: getBackgroundColor()
            }}>
              {/* Static Line Column */}
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.875rem',
                  width: '6px ',
                  borderBottom: '2px solid',
                  borderRight: '1px solid',
                  borderColor: 'divider',
                  padding: '12px 0px',
                  backgroundColor: getBackgroundColor(),
                  textAlign: 'center'
                }}
              >
                Line
              </TableCell>
              {columns.filter(column => column.field !== 'line').map((column, index) => {
                // Determine column width based on field type
                let columnWidth = '25%';
                if (column.field === 'price' || column.field === 'discount') {
                  columnWidth = '15%';
                } else if (column.field === 'itemcode') {
                  columnWidth = '35%';
                }
                
                return (
                  <TableCell 
                    key={index}
                    sx={{ 
                      fontWeight: 600, 
                      fontSize: '0.875rem',
                      width: columnWidth,
                      borderBottom: '2px solid',
                      borderRight: '1px solid',
                      borderColor: 'divider',
                      padding: '12px 16px',
                      backgroundColor: getBackgroundColor(),
                      textAlign: isRTL ? 'right' : 'left'
                    }}
                  >
                    {column.label}
                  </TableCell>
                );
              })}
              {/* Separator column for RTL mode */}
              {isRTL && (
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    fontSize: '0.875rem', 
                    width: 20,
                    borderBottom: '2px solid',
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    padding: '12px 8px',
                    backgroundColor: getBackgroundColor(),
                    textAlign: 'center'
                  }}
                >
                </TableCell>
              )}
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.875rem', 
                  width: '40px !important',
                  minWidth: '40px !important',
                  maxWidth: '40px !important',
                  borderBottom: '2px solid',
                  borderColor: 'divider',
                  padding: '12px 8px',
                  backgroundColor: getBackgroundColor(),
                  textAlign: 'center'
                }}
              >
                {t("actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gridData.map((row, rowIndex) => (
              <TableRow 
                key={row.id} 
                sx={{ 
                  '&:hover': { backgroundColor: 'action.hover' },
                  '&:not(:last-child)': {
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }
                }}
              >
                {/* Static Line Column */}
                <TableCell 
                  sx={{ 
                    py: 1,
                    px: 0,
                    width: '1px !important',
                    minWidth: '1px !important',
                    maxWidth: '1px !important',
                    borderBottom: rowIndex < gridData.length - 1 ? '1px solid' : 'none',
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    verticalAlign: 'top',
                    textAlign: 'center'
                  }}
                >
                  {rowIndex + 1}
                </TableCell>
                {columns.filter(column => column.field !== 'line').map((column, index) => (
                  <TableCell 
                    key={index} 
                    sx={{ 
                      py: 1,
                      px: 2,
                      borderBottom: rowIndex < gridData.length - 1 ? '1px solid' : 'none',
                      borderRight: '1px solid',
                      borderColor: 'divider',
                      verticalAlign: 'top'
                    }}
                  >
                    {renderCell(row, column)}
                  </TableCell>
                ))}
                {/* Separator column in body for RTL mode */}
                {isRTL && (
                  <TableCell 
                    sx={{ 
                      py: 1,
                      px: 1,
                      borderBottom: rowIndex < gridData.length - 1 ? '1px solid' : 'none',
                      borderRight: '1px solid',
                      borderColor: 'divider',
                      verticalAlign: 'top',
                      textAlign: 'center'
                    }}
                  >
                  </TableCell>
                )}
                <TableCell 
                  sx={{ 
                    py: 1,
                    px: 1,
                    width: '40px !important',
                    minWidth: '40px !important',
                    maxWidth: '40px !important',
                    borderBottom: rowIndex < gridData.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                    verticalAlign: 'top',
                    textAlign: 'center'
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => onRemoveRow && onRemoveRow(row.id)}
                    disabled={disabled || gridData.length === 1}
                    sx={{ 
                      color: 'error.main',
                      '&:hover': { backgroundColor: 'error.light' }
                    }}
                  >
                    <Trash2 size={14} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Plus size={16} />}
          onClick={onAddRow}
          disabled={disabled}
          sx={{ 
            textTransform: 'none',
            fontSize: '0.875rem'
          }}
        >
          {t("addRow")}
        </Button>
      </Box>
      
      {/* Help Modal */}
      <HelpGrid 
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        title={helpModalTitle}
        tableAttributes={tableAttributes}
        onSelect={handleHelpAdd}
        existingItems={gridData} // Pass current grid data to identify existing items
      />
    </Box>
  );
};

export default DrawerGrid;

