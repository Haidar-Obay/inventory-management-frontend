"use client";

import { useState, useEffect, Suspense } from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  CircularProgress,
  Button,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";
import Table from "@/components/ui/table/Table";
import CustomTabs from "@/components/ui/CustomTabs";
import { toast } from "@/components/ui/simple-toast";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useTableColumns } from "@/constants/tableColumns";
import { useCustomActions } from "@/components/ui/table/useCustomActions";
import { ActiveStatusAction } from "@/components/ui/table/ActiveStatusAction";
import { getPluralFileName } from "@/lib/utils";
import SupplierGroupDrawer from "@/components/ui/drawers/supplierGroup/SupplierGroupDrawer";
import SupplierDrawer from "@/components/ui/drawers/supplier/SupplierDrawer";
import { 
  getSupplierGroups, 
  deleteSupplierGroup, 
  editSupplierGroup,
  exportSupplierGroupsToExcel, 
  exportSupplierGroupsToPdf, 
  importSupplierGroupsFromExcel,
  getSuppliers,
  getSupplierById,
  deleteSupplier,
  editSupplier,
  exportSuppliersToExcel,
  exportSuppliersToPdf,
  importSuppliersFromExcel
} from "@/API/Suppliers";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Loading component for Suspense
function SuppliersPageLoading() {
  const t = useTranslations("suppliers");
  return (
    <div className="flex justify-center items-center min-h-screen">
      <CircularProgress />
      <span className="ml-2">{t("loading")}</span>
    </div>
  );
}

// Main component wrapped with Suspense
export default function SuppliersPageWrapper() {
  return (
    <Suspense fallback={<SuppliersPageLoading />}>
      <SuppliersPage />
    </Suspense>
  );
}

// The actual component that uses useSearchParams
function SuppliersPage() {
  const t = useTranslations("suppliers");
  const commonT = useTranslations("common");
  const tableT = useTranslations("tableColumns");
  const toastT = useTranslations("toast");
  const { supplierGroupColumns, supplierColumns } = useTableColumns(tableT);
  const locale = useLocale();
  const isRTL = locale === "ar";
  const searchParams = useSearchParams();
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [supplierGroupsData, setSupplierGroupsData] = useState([]);
  const [suppliersData, setSuppliersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState({
    supplierGroups: false,
    suppliers: false,
  });
  const [supplierGroupDrawerOpen, setSupplierGroupDrawerOpen] = useState(false);
  const [editingSupplierGroup, setEditingSupplierGroup] = useState(null);
  const [supplierDrawerOpen, setSupplierDrawerOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);

  // Initialize tab value from URL or localStorage
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab !== null) {
      const tabValue = parseInt(tab);
      setValue(tabValue);
      if (typeof window !== 'undefined') {
        localStorage.setItem("suppliersLastTab", tabValue.toString());
      }
    } else {
      if (typeof window !== 'undefined') {
        const savedTab = localStorage.getItem("suppliersLastTab");
        if (savedTab) {
          const tabValue = parseInt(savedTab);
          setValue(tabValue);
          const params = new URLSearchParams(searchParams.toString());
          params.set("tab", tabValue.toString());
          router.push(`?${params.toString()}`);
        }
      }
    }
  }, [searchParams, router]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem("suppliersLastTab", newValue.toString());
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newValue.toString());
    router.push(`?${params.toString()}`);
  };

  const fetchData = async (tabIndex, force = false) => {
    try {
      setLoading(true);
      let response;
      let dataType;

      switch (tabIndex) {
        case 0: // Supplier Groups
          if (!force && dataFetched.supplierGroups) {
            setLoading(false);
            return;
          }
          response = await getSupplierGroups();
          setSupplierGroupsData(response.data || []);
          dataType = "supplierGroups";
          break;
        case 1: // Suppliers
          if (!force && dataFetched.suppliers) {
            setLoading(false);
            return;
          }
          response = await getSuppliers();
          setSuppliersData(response.data || []);
          dataType = "suppliers";
          break;
      }

      if (dataType) {
        setDataFetched((prev) => ({
          ...prev,
          [dataType]: true,
        }));
      }
    } catch (error) {
      toast.error({
        title: toastT("error"),
        description: error.message || toastT("failedToFetchData"),
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch for the first tab
  useEffect(() => {
    fetchData(value);
  }, [value]);

  const entityHandlers = {
    supplierGroup: {
      setData: setSupplierGroupsData,
      deleteFn: deleteSupplierGroup,
      editFn: null, // Will be handled by drawer
      createFn: null, // Will be handled by drawer
    },
    supplier: {
      setData: setSuppliersData,
      deleteFn: deleteSupplier,
      editFn: null, // Will be handled by drawer later
      createFn: null, // Will be handled by drawer later
    },
  };

  const handleEdit = async (type, row) => {
    if (type === "supplierGroup") {
      setEditingSupplierGroup(row);
      setSupplierGroupDrawerOpen(true);
    } else if (type === "supplier") {
      setSupplierDrawerOpen(true);
      setDrawerLoading(true);
      try {
        const response = await getSupplierById(row.id);
        setEditingSupplier(response?.data || row);
      } catch (error) {
        toast.error({
          title: toastT("error"),
          description: error.message || toastT("failedToFetchData"),
        });
      } finally {
        setDrawerLoading(false);
      }
    }
  };

  const handleDelete = async (type, row) => {
    if (type === "supplierGroup") {
      try {
        await deleteSupplierGroup(row.id);
        setSupplierGroupsData(prev => prev.filter(item => item.id !== row.id));
        toast.success({
          title: toastT("success"),
          description: toastT("supplierGroup.deleteSuccess"),
        });
      } catch (error) {
        toast.error({
          title: toastT("error"),
          description: error.message || toastT("supplierGroup.deleteError"),
        });
      }
    } else if (type === "supplier") {
      try {
        await deleteSupplier(row.id);
        setSuppliersData(prev => prev.filter(item => item.id !== row.id));
        toast.success({
          title: toastT("success"),
          description: toastT("supplier.deleteSuccess"),
        });
      } catch (error) {
        toast.error({
          title: toastT("error"),
          description: error.message || toastT("supplier.deleteError"),
        });
      }
    }
  };

  const handleToggleActive = async (type, row) => {
    // This will be handled by the ActiveStatusAction component
    console.log("Toggle active", type, row);
  };

  const handleAddNew = (type) => {
    if (type === "supplierGroup") {
      setEditingSupplierGroup(null);
      setSupplierGroupDrawerOpen(true);
    } else if (type === "supplier") {
      setEditingSupplier(null);
      setSupplierDrawerOpen(true);
    }
  };

  const handleExportExcel = async (type) => {
    if (type === "supplierGroup") {
      try {
        await exportSupplierGroupsToExcel();
        toast.success({
          title: toastT("success"),
          description: toastT("supplierGroup.exportSuccess"),
        });
      } catch (error) {
        toast.error({
          title: toastT("error"),
          description: error.message || toastT("supplierGroup.exportError"),
        });
      }
    } else if (type === "supplier") {
      try {
        await exportSuppliersToExcel();
        toast.success({
          title: toastT("success"),
          description: toastT("supplier.exportSuccess"),
        });
      } catch (error) {
        toast.error({
          title: toastT("error"),
          description: error.message || toastT("supplier.exportError"),
        });
      }
    }
  };

  const handleExportPdf = async (type) => {
    if (type === "supplierGroup") {
      try {
        await exportSupplierGroupsToPdf();
        toast.success({
          title: toastT("success"),
          description: toastT("supplierGroup.exportSuccess"),
        });
      } catch (error) {
        toast.error({
          title: toastT("error"),
          description: error.message || toastT("supplierGroup.exportError"),
        });
      }
    } else if (type === "supplier") {
      try {
        await exportSuppliersToPdf();
        toast.success({
          title: toastT("success"),
          description: toastT("supplier.exportSuccess"),
        });
      } catch (error) {
        toast.error({
          title: toastT("error"),
          description: error.message || toastT("supplier.exportError"),
        });
      }
    }
  };

  const handleImportExcel = async (type, file) => {
    if (type === "supplierGroup") {
      try {
        await importSupplierGroupsFromExcel(file);
        toast.success({
          title: toastT("success"),
          description: toastT("supplierGroup.importSuccess"),
        });
        // Refresh data after import
        fetchData(0, true);
      } catch (error) {
        toast.error({
          title: toastT("error"),
          description: error.message || toastT("supplierGroup.exportError"),
        });
      }
    } else if (type === "supplier") {
      try {
        await importSuppliersFromExcel(file);
        toast.success({
          title: toastT("success"),
          description: toastT("supplier.importSuccess"),
        });
        // Refresh data after import
        fetchData(1, true);
      } catch (error) {
        toast.error({
          title: toastT("error"),
          description: error.message || toastT("supplier.importError"),
        });
      }
    }
  };

  const handlePrint = (type, data, columns) => {
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        toast.error({
          title: toastT("error"),
          description: toastT("printError"),
        });
        return;
      }

      // Create the print content
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${type === 'supplierGroup' ? 'Supplier Groups' : 'Suppliers'} - Print</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .header { text-align: center; margin-bottom: 20px; }
            .timestamp { text-align: right; font-size: 12px; color: #666; margin-bottom: 20px; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${type === 'supplierGroup' ? 'Supplier Groups' : 'Suppliers'}</h1>
          </div>
          <div class="timestamp">
            Printed on: ${new Date().toLocaleString()}
          </div>
          <table>
            <thead>
              <tr>
                ${columns.map(col => `<th>${col.header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${columns.map(col => {
                    let value = row[col.key];
                    if (col.render) {
                      value = col.render(value);
                    } else if (col.type === 'boolean') {
                      value = value ? 'Yes' : 'No';
                    } else if (col.type === 'date' && value) {
                      value = new Date(value).toLocaleDateString();
                    } else if (value === null || value === undefined) {
                      value = '';
                    }
                    return `<td>${value}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="no-print" style="margin-top: 20px; text-align: center;">
            <button onclick="window.print()">Print</button>
            <button onclick="window.close()">Close</button>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();
      
      toast.success({
        title: toastT("success"),
        description: type === 'supplierGroup' ? toastT("supplierGroup.printSuccess") : toastT("supplier.printSuccess"),
      });
    } catch (error) {
      console.error('Print error:', error);
      toast.error({
        title: toastT("error"),
        description: type === 'supplierGroup' ? toastT("supplierGroup.printError") : toastT("supplier.printError"),
      });
    }
  };

  // Setup custom actions for supplier groups
  const supplierGroupActions = useCustomActions({
    onEdit: (row) => handleEdit("supplierGroup", row),
    onDelete: (row) => handleDelete("supplierGroup", row),
    onPreview: (row) => {
      // Preview functionality can be added here
    },
    additionalActions: (row) => [
      ActiveStatusAction({
        row,
        editFunction: async (id, data) => {
          try {
            const response = await editSupplierGroup(id, data);
            return response;
          } catch (error) {
            console.error('editSupplierGroup error:', error);
            throw error;
          }
        },
        onSuccess: (row, updatedData) => {
          // Extract the active status from the response
          const activeStatus = updatedData?.active !== undefined ? updatedData.active : !row.active;
          
          setSupplierGroupsData((prev) => {
            const updated = prev.map((item) =>
              item.id === row.id ? { ...item, active: activeStatus } : item
            );
            return updated;
          });
          
          toast.success({
            title: toastT("success"),
            description: toastT("supplierGroup.updateSuccess"),
          });
        },
        onError: (row, errorMessage) => {
          toast.error({
            title: toastT("error"),
            description: errorMessage || toastT("supplierGroup.updateError"),
          });
        },
      }),
    ],
  });

  // Setup custom actions for suppliers
  const supplierActions = useCustomActions({
    onEdit: (row) => handleEdit("supplier", row),
    onDelete: (row) => handleDelete("supplier", row),
    onPreview: (row) => {
      // Preview functionality can be added here
    },
    additionalActions: (row) => [
      ActiveStatusAction({
        row,
        editFunction: async (id, data) => {
          try {
            const response = await editSupplier(id, data);
            return response;
          } catch (error) {
            console.error('editSupplier error:', error);
            throw error;
          }
        },
        onSuccess: (row, updatedData) => {
          // Extract the active status from the response
          const activeStatus = updatedData?.active !== undefined ? updatedData.active : !row.active;
          
          setSuppliersData((prev) => {
            const updated = prev.map((item) =>
              item.id === row.id ? { ...item, active: activeStatus } : item
            );
            return updated;
          });
          
          toast.success({
            title: toastT("success"),
            description: toastT("supplier.updateSuccess"),
          });
        },
        onError: (row, errorMessage) => {
          toast.error({
            title: toastT("error"),
            description: errorMessage || toastT("supplier.updateError"),
          });
        },
      }),
    ],
  });

  // Drawer handlers
  const handleSupplierGroupSave = (data) => {
    if (editingSupplierGroup) {
      // Update existing
      setSupplierGroupsData(prev => 
        prev.map(item => item.id === editingSupplierGroup.id ? data : item)
      );
    } else {
      // Add new
      setSupplierGroupsData(prev => [...prev, data]);
    }
    setSupplierGroupDrawerOpen(false);
    setEditingSupplierGroup(null);
  };

  const handleSupplierGroupSaveAndNew = (data) => {
    if (editingSupplierGroup) {
      // Update existing
      setSupplierGroupsData(prev => 
        prev.map(item => item.id === editingSupplierGroup.id ? data : item)
      );
    } else {
      // Add new
      setSupplierGroupsData(prev => [...prev, data]);
    }
    // Keep drawer open for new entry
    setEditingSupplierGroup(null);
  };

  const handleSupplierGroupSaveAndClose = (data) => {
    if (editingSupplierGroup) {
      // Update existing
      setSupplierGroupsData(prev => 
        prev.map(item => item.id === editingSupplierGroup.id ? data : item)
      );
    } else {
      // Add new
      setSupplierGroupsData(prev => [...prev, data]);
    }
    setSupplierGroupDrawerOpen(false);
    setEditingSupplierGroup(null);
  };

  const handleSupplierGroupClose = () => {
    setSupplierGroupDrawerOpen(false);
    setEditingSupplierGroup(null);
  };

  const handleSupplierSave = (data) => {
    if (editingSupplier) {
      // Update existing
      setSuppliersData(prev => 
        prev.map(item => item.id === editingSupplier.id ? data : item)
      );
    } else {
      // Add new
      setSuppliersData(prev => [...prev, data]);
    }
    setSupplierDrawerOpen(false);
    setEditingSupplier(null);
  };

  const handleSupplierClose = () => {
    setSupplierDrawerOpen(false);
    setEditingSupplier(null);
    setDrawerLoading(false);
  };

  return (
    <div className="p-4">
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <CustomTabs
            value={value}
            onChange={handleChange}
            aria-label="suppliers tabs"
            sx={{
              direction: isRTL ? "rtl" : "ltr",
            }}
          >
            <Tab label={t("tabs.supplierGroups")} />
            <Tab label={t("tabs.suppliers")} />
          </CustomTabs>
        </Box>

        {/* Supplier Groups Tab */}
        <TabPanel value={value} index={0}>
          <Box className="p-0">
            <Table
              data={supplierGroupsData}
              columns={supplierGroupColumns}
              onAdd={() => handleAddNew("supplierGroup")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("supplierGroup")}
              onExportPdf={() => handleExportPdf("supplierGroup")}
              onPrint={() =>
                handlePrint("supplierGroup", supplierGroupsData, supplierGroupColumns)
              }
              onRefresh={() => fetchData(0, true)}
              onImportExcel={(file) => handleImportExcel("supplierGroup", file)}
              tableId="supplierGroups"
              customActions={supplierGroupActions.customActions}
              onCustomAction={supplierGroupActions.onCustomAction}
              onDelete={(row) => handleDelete("supplierGroup", row)}
            />
          </Box>
        </TabPanel>

        {/* Suppliers Tab */}
        <TabPanel value={value} index={1}>
          <Box className="p-0">
            <Table
              data={suppliersData}
              columns={supplierColumns}
              onAdd={() => handleAddNew("supplier")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("supplier")}
              onExportPdf={() => handleExportPdf("supplier")}
              onPrint={() =>
                handlePrint("supplier", suppliersData, supplierColumns)
              }
              onRefresh={() => fetchData(1, true)}
              onImportExcel={(file) => handleImportExcel("supplier", file)}
              tableId="suppliers"
              customActions={supplierActions.customActions}
              onCustomAction={supplierActions.onCustomAction}
              onDelete={(row) => handleDelete("supplier", row)}
            />
          </Box>
        </TabPanel>
      </Box>

      {/* Supplier Group Drawer */}
      <SupplierGroupDrawer
        isOpen={supplierGroupDrawerOpen}
        onClose={handleSupplierGroupClose}
        onSave={handleSupplierGroupSave}
        onSaveAndNew={handleSupplierGroupSaveAndNew}
        onSaveAndClose={handleSupplierGroupSaveAndClose}
        editData={editingSupplierGroup}
        saveLoading={saveLoading}
      />

      {/* Supplier Drawer */}
      <SupplierDrawer
        isOpen={supplierDrawerOpen}
        onClose={handleSupplierClose}
        type={editingSupplier ? "edit" : "add"}
        onSave={handleSupplierSave}
        formData={editingSupplier || {}}
        isEdit={!!editingSupplier}
        initialLoading={drawerLoading}
      />
    </div>
  );
}
