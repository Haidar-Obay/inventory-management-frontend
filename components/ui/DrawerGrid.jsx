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
import { getItems } from "@/API/Items";

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
}) => {
  const t = useTranslations(translationNamespace);
  const locale = useLocale();
  const theme = useTheme();
  const isRTL = locale === "ar";
  const { openDrawer } = useDrawerStack();
  
  // Check if we're in dark mode
  const isDarkMode = theme.palette.mode === 'dark';
  
  // State for items data
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  // Fast lookup from itemcode -> id
  const itemCodeToId = useMemo(() => {
    const map = new Map();
    (items || []).forEach((it) => {
      if (it && it.itemcode != null) map.set(String(it.itemcode), it.id);
    });
    return map;
  }, [items]);

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

  // Fetch items data
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setItemsLoading(true);
        const response = await getItems();
        setItems(response.data || []);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setItemsLoading(false);
      }
    };

    fetchItems();
  }, []);

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
      const filteredOptions = items.filter(
        (item) => item.id === currentRowItemId || !selectedIds.has(item.id)
      );
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
            options={createOptions(filteredOptions)}
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
                  return items.find((item) => item.id === row.item_id) || null;
                }
                if (row.itemcode !== undefined && row.itemcode !== null && row.itemcode !== "") {
                  return items.find((item) => item.id === row.itemcode || item.itemcode === row.itemcode) || null;
                }
                return null;
              })()
            }
            onChange={(event, newValue) => {
              // Update both item_id (authoritative) and itemcode (for backward compatibility/display)
              // Also auto-fill price with the selected item's price
              handleItemSelection(row.id, newValue);
            }}
            loading={itemsLoading}
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
                          setItems(prev => [...prev, newItem]);
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
                        setItems(prev => [...prev, newItem]);
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
        <Table size="small" sx={{ borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow sx={{ 
              backgroundColor: getBackgroundColor()
            }}>
              {columns.map((column, index) => {
                // Determine column width based on field type
                let columnWidth = '25%';
                if (column.field === 'price' || column.field === 'discount') {
                  columnWidth = '15%';
                } else if (column.field === 'line') {
                  columnWidth = '20%';
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
                {columns.map((column, index) => (
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
    </Box>
  );
};

export default DrawerGrid;

