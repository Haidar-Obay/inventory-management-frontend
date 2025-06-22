"use client";

import { useState, useEffect, Suspense } from "react";
import { Tabs, Tab, Box, Typography, CircularProgress } from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import Table from "@/components/ui/table/Table";
import CustomerDrawer from "@/components/ui/drawers/CustomerDrawer";
import {
  getCustomerGroups,
  getSalesmen,
  getCustomers,
  deleteCustomerGroup,
  deleteSalesman,
  deleteCustomer,
  editCustomerGroup,
  editSalesman,
  editCustomer,
  createCustomerGroup,
  createSalesman,
  createCustomer,
  exportCustomerGroupsToExcel,
  exportCustomerGroupsToPdf,
  importCustomerGroupsFromExcel,
  exportSalesmenToExcel,
  exportSalesmenToPdf,
  importSalesmenFromExcel,
  exportCustomersToExcel,
  exportCustomersToPdf,
  importCustomersFromExcel,
} from "@/API/Customers";
import { useTableColumns } from "@/constants/tableColumns";
import { toast } from "@/components/ui/simple-toast";
import { useSearchParams, useRouter } from "next/navigation";

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
function CustomerPageLoading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <CircularProgress />
      <span className="ml-2">Loading customers...</span>
    </div>
  );
}

// Main component wrapped with Suspense
export default function CustomerPageWrapper() {
  return (
    <Suspense fallback={<CustomerPageLoading />}>
      <CustomerPage />
    </Suspense>
  );
}

// The actual component that uses useSearchParams
function CustomerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [customerGroupsData, setCustomerGroupsData] = useState([]);
  const [salesmenData, setSalesmenData] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeDrawerType, setActiveDrawerType] = useState("");
  const [formData, setFormData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [dataFetched, setDataFetched] = useState({
    customerGroups: false,
    salesmen: false,
    customers: false,
  });

  const t = useTranslations("customers");
  const tableT = useTranslations("tableColumns");
  const toastT = useTranslations("toast");

  const {
    customerGroupColumns,
    salesmenColumns,
    customerColumns,
  } = useTableColumns(tableT);

  // Initialize tab value from URL or localStorage
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab !== null) {
      const tabValue = parseInt(tab);
      setValue(tabValue);
      localStorage.setItem("customersLastTab", tabValue.toString());
    } else {
      // If no URL parameter, try to get from localStorage
      const savedTab = localStorage.getItem("customersLastTab");
      if (savedTab) {
        const tabValue = parseInt(savedTab);
        setValue(tabValue);
        // Update URL to match localStorage
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tabValue.toString());
        router.push(`?${params.toString()}`);
      }
    }
  }, [searchParams, router]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    localStorage.setItem("customersLastTab", newValue.toString());
    // Update URL with new tab value
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
        case 0: // Customer Groups
          if (!force && dataFetched.customerGroups) {
            setLoading(false);
            return;
          }
          response = await getCustomerGroups();
          setCustomerGroupsData(response.data || []);
          dataType = "customerGroups";
          break;
        case 1: // Salesmen
          if (!force && dataFetched.salesmen) {
            setLoading(false);
            return;
          }
          response = await getSalesmen();
          setSalesmenData(response.data || []);
          dataType = "salesmen";
          break;
        case 2: // Customers
          if (!force && dataFetched.customers) {
            setLoading(false);
            return;
          }
          response = await getCustomers();
          setCustomersData(response.data || []);
          dataType = "customers";
          break;
      }

      if (dataType) {
        setDataFetched((prev) => ({
          ...prev,
          [dataType]: true,
        }));
      }

      toast.success({
        title: toastT("success"),
        description: toastT("dataFetchedSuccessfully"),
      });
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
    customerGroup: {
      setData: setCustomerGroupsData,
      deleteFn: deleteCustomerGroup,
      editFn: editCustomerGroup,
      createFn: createCustomerGroup,
    },
    salesman: {
      setData: setSalesmenData,
      deleteFn: deleteSalesman,
      editFn: editSalesman,
      createFn: createSalesman,
    },
    customer: {
      setData: setCustomersData,
      deleteFn: deleteCustomer,
      editFn: editCustomer,
      createFn: createCustomer,
    },
  };

  const handleEdit = (type, row) => {
    setFormData({ 
      id: row.id, 
      name: row.name,
      code: row.code,
      active: row.active,
      address: row.address,
      phone1: row.phone1,
      phone2: row.phone2,
      fax: row.fax,
      email: row.email,
      website: row.website,
      tax_number: row.tax_number,
      tax_office: row.tax_office,
      customer_group_id: row.customer_group_id,
      salesman_id: row.salesman_id,
      is_manager: row.is_manager,
      is_supervisor: row.is_supervisor,
      is_collector: row.is_collector,
      fix_commission: row.fix_commission,
      commission_percent: row.commission_percent,
      commission_by_item: row.commission_by_item,
      commission_by_turnover: row.commission_by_turnover,
    });
    setActiveDrawerType(type);
    setIsEditMode(true);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (type, row) => {
    try {
      const response = await entityHandlers[type].deleteFn(row.id);
      if (response.status) {
        entityHandlers[type].setData((prev) =>
          prev.filter((item) => item.id !== row.id)
        );
        // Reset the fetched state for the modified data type
        setDataFetched((prev) => ({
          ...prev,
          [type]: false,
        }));
        toast.success({
          title: toastT("success"),
          description: toastT(`${type}.deleteSuccess`),
        });
      }
    } catch (error) {
      toast.error({
        title: toastT("error"),
        description: error.message || toastT(`${type}.deleteError`),
      });
    }
  };

  const handleAddNew = (type) => {
    setActiveDrawerType(type);
    setIsEditMode(false);
    // Set default values for new items
    const defaultData = {
      active: true, // Default to active for new items
    };
    setFormData(defaultData);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setActiveDrawerType("");
    setFormData({});
    setIsEditMode(false);
  };

  const handleFormDataChange = (data) => {
    setFormData(data);
  };

  const handleSave = async () => {
    const type = activeDrawerType;
    const handler = entityHandlers[type];

    try {
      // Prepare the data with proper types
      const preparedData = {
        ...formData,
        active: formData.active === 'true' || formData.active === true,
        is_manager: formData.is_manager === 'true' || formData.is_manager === true,
        is_supervisor: formData.is_supervisor === 'true' || formData.is_supervisor === true,
        is_collector: formData.is_collector === 'true' || formData.is_collector === true,
      };

      let response;
      if (isEditMode) {
        response = await handler.editFn(formData.id, preparedData);
        if (response.status) {
          // Update existing item in the state
          entityHandlers[type].setData((prev) =>
            prev.map((item) =>
              item.id === formData.id ? { ...item, ...formData } : item
            )
          );
        }
      } else {
        response = await handler.createFn(preparedData);
        if (response.status) {
          // Add new item to the state
          entityHandlers[type].setData((prev) => [...prev, response.data]);
        }
      }

      if (response.status) {
        toast.success({
          title: toastT("success"),
          description: toastT(
            isEditMode ? `${type}.updateSuccess` : `${type}.createSuccess`
          ),
        });

        setIsEditMode(false);
      }
    } catch (error) {
      toast.error({
        title: toastT("error"),
        description:
          error.message ||
          toastT(isEditMode ? `${type}.updateError` : `${type}.createError`),
      });
    }
  };

  const handleSaveAndNew = async () => {
    await handleSave();
    setFormData({});
    if (isEditMode) {
      setIsEditMode(false);
      setFormData({});
    }
  };

  const handleSaveAndClose = async () => {
    await handleSave();
    handleCloseDrawer();
  };

  const handleExportExcel = async (type) => {
    try {
      let response;
      switch (type) {
        case "customerGroup":
          response = await exportCustomerGroupsToExcel();
          break;
        case "salesman":
          response = await exportSalesmenToExcel();
          break;
        case "customer":
          response = await exportCustomersToExcel();
          break;
        default:
          return;
      }

      // Create a download link for the Excel file
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}s.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success({
        title: toastT("success"),
        description: toastT(`${type}.exportSuccess`),
      });
    } catch (error) {
      toast.error({
        title: toastT("error"),
        description: error.message || toastT(`${type}.exportError`),
      });
    }
  };

  const handleExportPdf = async (type) => {
    try {
      let response;
      switch (type) {
        case "customerGroup":
          response = await exportCustomerGroupsToPdf();
          break;
        case "salesman":
          response = await exportSalesmenToPdf();
          break;
        case "customer":
          response = await exportCustomersToPdf();
          break;
        default:
          return;
      }

      // Create a download link for the PDF file
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}s.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success({
        title: toastT("success"),
        description: toastT(`${type}.exportSuccess`),
      });
    } catch (error) {
      toast.error({
        title: toastT("error"),
        description: error.message || toastT(`${type}.exportError`),
      });
    }
  };

  const handleImportExcel = async (type, file) => {
    try {
      let response;
      switch (type) {
        case "customerGroup":
          response = await importCustomerGroupsFromExcel(file);
          break;
        case "salesman":
          response = await importSalesmenFromExcel(file);
          break;
        case "customer":
          response = await importCustomersFromExcel(file);
          break;
        default:
          return;
      }

      if (response.status) {
        // Refresh the data after successful import
        fetchData(value, true);
        toast.success({
          title: toastT("success"),
          description: toastT(`${type}.importSuccess`),
        });
      }
    } catch (error) {
      toast.error({
        title: toastT("error"),
        description: error.message || toastT(`${type}.importError`),
      });
    }
  };

  const handlePrint = (type, data, columns) => {
    try {
      // Create a new window for printing
      const printWindow = window.open("", "_blank");

      // Create the HTML content for printing
      const content = `
        <html>
          <head>
            <title>${type.charAt(0).toUpperCase() + type.slice(1)} List</title>
            <style>
              body { font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
              h1 { text-align: center; }
              @media print {
                body { margin: 0; padding: 20px; }
                table { page-break-inside: auto; }
                tr { page-break-inside: avoid; page-break-after: auto; }
              }
            </style>
          </head>
          <body>
            <h1>${type.charAt(0).toUpperCase() + type.slice(1)} List</h1>
            <table>
              <thead>
                <tr>
                  ${columns.map((col) => `<th>${col.header}</th>`).join("")}
                </tr>
              </thead>
              <tbody>
                ${data
                  .map(
                    (row) => `
                  <tr>
                    ${columns.map((col) => `<td>${row[col.key] || ""}</td>`).join("")}
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </body>
        </html>
      `;

      // Write the content to the new window
      printWindow.document.write(content);
      printWindow.document.close();

      // Wait for content to load then print
      printWindow.onload = function () {
        printWindow.print();
        // Close the window after printing
        printWindow.onafterprint = function () {
          printWindow.close();
        };
      };

      toast.success({
        title: toastT("success"),
        description: toastT(`${type}.printSuccess`),
      });
    } catch (error) {
      toast.error({
        title: toastT("error"),
        description: error.message || toastT(`${type}.printError`),
      });
    }
  };

  return (
    <div className="p-4">
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="customer tabs">
            <Tab label="Customer Groups" />
            <Tab label="Salesmen" />
            <Tab label="Customers" />
          </Tabs>
        </Box>

        {/* Customer Groups Management Tab*/}
        <TabPanel value={value} index={0}>
          <Box className="p-0">
            <Table
              data={customerGroupsData}
              columns={customerGroupColumns}
              onEdit={(row) => handleEdit("customerGroup", row)}
              onDelete={(row) => handleDelete("customerGroup", row)}
              onAdd={() => handleAddNew("customerGroup")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("customerGroup")}
              onExportPdf={() => handleExportPdf("customerGroup")}
              onPrint={() =>
                handlePrint(
                  "customerGroup",
                  customerGroupsData,
                  customerGroupColumns
                )
              }
              onRefresh={() => fetchData(0, true)}
              onImportExcel={(file) => handleImportExcel("customerGroup", file)}
              tableId="customerGroups"
            />
          </Box>
        </TabPanel>

        {/* Salesmen Management Tab*/}
        <TabPanel value={value} index={1}>
          <Box className="p-0">
            <Table
              data={salesmenData}
              columns={salesmenColumns}
              onEdit={(row) => handleEdit("salesman", row)}
              onDelete={(row) => handleDelete("salesman", row)}
              onAdd={() => handleAddNew("salesman")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("salesman")}
              onExportPdf={() => handleExportPdf("salesman")}
              onPrint={() =>
                handlePrint("salesman", salesmenData, salesmenColumns)
              }
              onRefresh={() => fetchData(1, true)}
              onImportExcel={(file) => handleImportExcel("salesman", file)}
              tableId="salesmen"
            />
          </Box>
        </TabPanel>

        {/* Customers Management Tab*/}
        <TabPanel value={value} index={2}>
          <Box className="p-0">
            <Table
              data={customersData}
              columns={customerColumns}
              onEdit={(row) => handleEdit("customer", row)}
              onDelete={(row) => handleDelete("customer", row)}
              onAdd={() => handleAddNew("customer")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("customer")}
              onExportPdf={() => handleExportPdf("customer")}
              onPrint={() => handlePrint("customer", customersData, customerColumns)}
              onRefresh={() => fetchData(2, true)}
              onImportExcel={(file) => handleImportExcel("customer", file)}
              tableId="customers"
            />
          </Box>
        </TabPanel>

        {/* Customer Drawer */}
        <CustomerDrawer
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          type={activeDrawerType}
          onSave={handleSave}
          onSaveAndNew={handleSaveAndNew}
          onSaveAndClose={handleSaveAndClose}
          formData={formData}
          onFormDataChange={handleFormDataChange}
          isEdit={isEditMode}
        />
      </Box>
    </div>
  );
}
