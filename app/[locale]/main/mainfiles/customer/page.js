"use client";

import { useState, useEffect, Suspense } from "react";
import { Tabs, Tab, Box, Typography, CircularProgress } from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import Table from "@/components/ui/table/Table";
import CustomerDrawer from "@/components/ui/drawers/CustomerDrawer";
import CustomTabs from "@/components/ui/CustomTabs";
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
import { useCustomActions } from "@/components/ui/table/useCustomActions";
import { getPluralFileName } from "@/lib/utils";
import { ActiveStatusAction } from "@/components/ui/table/ActiveStatusAction";
import { useDrawerStack } from "@/components/ui/DrawerStackContext";

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
  const t = useTranslations("customers");
  return (
    <div className="flex justify-center items-center min-h-screen">
      <CircularProgress />
      <span className="ml-2">{t("loading")}</span>
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
  const [saveLoading, setSaveLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeDrawerType, setActiveDrawerType] = useState("");
  const [formData, setFormData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [dataFetched, setDataFetched] = useState({
    customerGroups: false,
    salesmen: false,
    customers: false,
  });

  const locale = useLocale();
  const isRTL = locale === "ar";

  const t = useTranslations("customers");
  const commonT = useTranslations("common");
  const tableT = useTranslations("tableColumns");
  const toastT = useTranslations("toast");

  const { customerGroupColumns, salesmenColumns, customerColumns } =
    useTableColumns(tableT);

  const { openDrawer } = useDrawerStack();

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
          // Handle paginated response structure and transform nested objects
          const rawCustomersData = response.data?.data || response.data || [];
          const transformedCustomersData = rawCustomersData.map(customer => {
            
            return {
              ...customer,
              // Flatten nested objects for table display
              'customer_group.name': customer.customer_group?.name || '',
              'salesman.name': customer.salesman?.name || '',
              'collector.name': customer.collector?.name || '',
              'supervisor.name': customer.supervisor?.name || '',
              'manager.name': customer.manager?.name || '',
              'payment_term.name': customer.payment_term?.name || '',
              'payment_method.name': customer.payment_method?.name || '',
              // Also add simple properties as fallback
              customer_group_name: customer.customer_group?.name || '',
              salesman_name: customer.salesman?.name || '',
              collector_name: customer.collector?.name || '',
              supervisor_name: customer.supervisor?.name || '',
              manager_name: customer.manager?.name || '',
              payment_term_name: customer.payment_term?.name || '',
              payment_method_name: customer.payment_method?.name || '',
            };
          });
          setCustomersData(transformedCustomersData);
          dataType = "customers";
          break;
      }

      if (dataType) {
        setDataFetched((prev) => ({
          ...prev,
          [dataType]: true,
        }));
      }

      // toast.success({
      //   title: toastT("success"),
      //   description: toastT("dataFetchedSuccessfully"),
      // });
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
    if (type === "customer") {
      // Handle customer data with nested objects
      setFormData({
        id: row.id,
        title: row.title,
        first_name: row.first_name,
        middle_name: row.middle_name,
        last_name: row.last_name,
        display_name: row.display_name,
        company_name: row.company_name,
        phone1: row.phone1,
        phone2: row.phone2,
        phone3: row.phone3,
        file_number: row.file_number,
        bar_code: row.bar_code,
        search_terms: row.search_terms,
        indicator: row.indicator,
        risk_category: row.risk_category,
        active: row.active,
        black_listed: row.black_listed,
        one_time_account: row.one_time_account,
        special_account: row.special_account,
        pos_customer: row.pos_customer,
        free_delivery_charge: row.free_delivery_charge,
        print_invoice_language: row.print_invoice_language,
        send_invoice: row.send_invoice,
        add_message: row.add_message,
        invoice_message: row.invoice_message,
        notes: row.notes,
        customer_group_id: row.customer_group?.id,
        salesman_id: row.salesman?.id,
        collector_id: row.collector?.id,
        supervisor_id: row.supervisor?.id,
        manager_id: row.manager?.id,
        payment_term_id: row.payment_term?.id,
        payment_method_id: row.payment_method?.id,
      });
      // Use single CustomerDrawer for customers
      setActiveDrawerType(type);
      setIsEditMode(true);
      setIsDrawerOpen(true);
    } else {
      // Use drawer stack for customer groups and salesmen
      openDrawer({
        type: type,
        props: {
          editData: row,
          onSave: (updatedData) => {
            // Update the data in the state
            if (type === "customerGroup") {
              setCustomerGroupsData(prev => 
                prev.map(item => item.id === row.id ? updatedData : item)
              );
            } else if (type === "salesman") {
              setSalesmenData(prev => 
                prev.map(item => item.id === row.id ? updatedData : item)
              );
            }
          },
        },
      });
    }
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

  const handleToggleActive = async (type, row) => {
    try {
      // Prepare the data with only the active field changed
      const updatedData = {
        ...row,
        active: !row.active, // Toggle the active status
      };

      // Call the edit function (same as drawer uses)
      const response = await entityHandlers[type].editFn(row.id, updatedData);

      if (response.status) {
        // Update existing item in the state
        entityHandlers[type].setData((prev) =>
          prev.map((item) =>
            item.id === row.id ? { ...item, active: updatedData.active } : item
          )
        );

        toast.success({
          title: toastT("success"),
          description: toastT(`${type}.updateSuccess`),
        });
      }
    } catch (error) {
      toast.error({
        title: toastT("error"),
        description: error.message || toastT(`${type}.updateError`),
      });
    }
  };

  const handleAddNew = (type) => {
    if (type === "customer") {
      // Use single CustomerDrawer for customers
      setActiveDrawerType(type);
      setIsEditMode(false);
      // Set default values for new items
      const defaultData = {
        active: true, // Default to active for new items
      };
      setFormData(defaultData);
      setIsDrawerOpen(true);
    } else {
      // Use drawer stack for customer groups and salesmen
      openDrawer({
        type: type,
        props: {
          onSave: (newData) => {
            // Add the new data to the state
            if (type === "customerGroup") {
              setCustomerGroupsData(prev => [...(Array.isArray(prev) ? prev : []), newData]);
            } else if (type === "salesman") {
              setSalesmenData(prev => [...(Array.isArray(prev) ? prev : []), newData]);
            }
          },
        },
      });
    }
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
      setSaveLoading(true);
      // Prepare the data with proper types
      const preparedData = {
        ...formData,
        active: formData.active === "true" || formData.active === true,
        is_manager:
          formData.is_manager === "true" || formData.is_manager === true,
        is_supervisor:
          formData.is_supervisor === "true" || formData.is_supervisor === true,
        is_collector:
          formData.is_collector === "true" || formData.is_collector === true,
      };

      // Convert empty strings to null for address fields to prevent constraint violations
      const addressFields = [
        'billing_country_id', 'billing_zone_id', 'billing_city_id', 'billing_district_id',
        'shipping_country_id', 'shipping_zone_id', 'shipping_city_id', 'shipping_district_id'
      ];
      
      addressFields.forEach(field => {
        if (preparedData[field] === "" || preparedData[field] === null) {
          preparedData[field] = null;
        }
      });

      // For customer type, prepare contacts with primary contact
      if (type === "customer") {
        // Create primary contact from form data
        const primaryContactName = [formData.first_name, formData.middle_name, formData.last_name].filter(Boolean).join(' ');
        
        // Only include primary contact if there's meaningful contact data
        const hasPrimaryContactData = primaryContactName || formData.work_phone || formData.mobile || formData.position;
        
        if (hasPrimaryContactData) {
          const primaryContact = {
            title: formData.title || "",
            name: primaryContactName,
            work_phone: formData.work_phone || "",
            mobile: formData.mobile || "",
            position: formData.position || "",
            extension: formData.extension || "",
            is_primary: true
          };

          // Get additional contacts from formData.contacts (if any)
          const additionalContacts = (formData.contacts || []).map(contact => ({
            ...contact,
            is_primary: false
          }));

          preparedData.contacts = [primaryContact, ...additionalContacts];
        } else {
          preparedData.contacts = (formData.contacts || []).map(contact => ({
            ...contact,
            is_primary: false
          }));
        }

        // Handle shipping addresses - convert empty strings to null
        if (preparedData.shipping_addresses && Array.isArray(preparedData.shipping_addresses)) {
          preparedData.shipping_addresses = preparedData.shipping_addresses.map(address => {
            const addressFields = ['country_id', 'zone_id', 'city_id', 'district_id'];
            const cleanedAddress = { ...address };
            
            addressFields.forEach(field => {
              if (cleanedAddress[field] === "" || cleanedAddress[field] === null) {
                cleanedAddress[field] = null;
              }
            });
            
            return cleanedAddress;
          });
        }

        // Remove contact fields from top level
        delete preparedData.work_phone;
        delete preparedData.mobile;
        delete preparedData.position;
        delete preparedData.extension;

        // Process attachments for backend
        if (preparedData.attachments && Array.isArray(preparedData.attachments)) {
          preparedData.attachments = preparedData.attachments.map(attachment => ({
            file_name: attachment.file_name || attachment.file?.name || '',
            file_path: attachment.file_path || '',
            file_type: attachment.file_type || attachment.file?.type || '',
            file_size: attachment.file_size || attachment.file?.size || 0,
            description: attachment.description || '',
            is_public: attachment.is_public !== undefined ? attachment.is_public : true
          }));
        }
      }

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
      } else {
        toast.error({
          title: toastT("error"),
          description: response?.message || toastT(isEditMode ? `${type}.updateError` : `${type}.createError`),
        });
      }
    } catch (error) {
      toast.error({
        title: toastT("error"),
        description:
          error.message ||
          toastT(isEditMode ? `${type}.updateError` : `${type}.createError`),
      });
    } finally {
      setSaveLoading(false);
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
      // Check if the table is empty before exporting
      let dataArray;
      switch (type) {
        case "customerGroup":
          dataArray = customerGroupsData;
          break;
        case "salesman":
          dataArray = salesmenData;
          break;
        case "customer":
          dataArray = customersData;
          break;
        default:
          return;
      }

      // Check if data array is empty
      if (!dataArray || dataArray.length === 0) {
        toast.error({
          title: toastT("error"),
          description: toastT("noDataToExport"),
        });
        return;
      }

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
      link.setAttribute("download", `${getPluralFileName(type)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error({
        title: toastT("error"),
        description: error.message || toastT(`${type}.exportError`),
      });
    }
  };

  const handleExportPdf = async (type) => {
    try {
      // Check if the table is empty before exporting
      let dataArray;
      switch (type) {
        case "customerGroup":
          dataArray = customerGroupsData;
          break;
        case "salesman":
          dataArray = salesmenData;
          break;
        case "customer":
          dataArray = customersData;
          break;
        default:
          return;
      }

      // Check if data array is empty
      if (!dataArray || dataArray.length === 0) {
        toast.error({
          title: toastT("error"),
          description: toastT("noDataToExport"),
        });
        return;
      }

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
      link.setAttribute("download", `${getPluralFileName(type)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
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

      // Get the translated title for the type
      const typeTitle = t(
        `management.${type === "customerGroup" ? "customerGroup" : type === "salesman" ? "salesman" : "customer"}`
      );

      // Create the HTML content for printing
      const content = `
        <html>
          <head>
            <title>${isRTL ? `${commonT("list")} ${typeTitle}` : `${typeTitle} ${commonT("list")}`}</title>
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
            <h1>${isRTL ? `${commonT("list")} ${typeTitle}` : `${typeTitle} ${commonT("list")}`}</h1>
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
    } catch (error) {
      toast.error({
        title: toastT("error"),
        description: error.message || toastT(`${type}.printError`),
      });
    }
  };

  // Setup custom actions for each entity type (after handler functions are defined)
  const customerGroupActions = useCustomActions({
    onEdit: (row) => handleEdit("customerGroup", row),
    onDelete: (row) => handleDelete("customerGroup", row),
    onPreview: (row) => {
      // Preview functionality can be added here
    },
    additionalActions: (row) => [
      ActiveStatusAction({
        row,
        editFunction: entityHandlers.customerGroup.editFn,
        onSuccess: (row, updatedData) => {
          entityHandlers.customerGroup.setData((prev) =>
            prev.map((item) =>
              item.id === row.id ? { ...item, active: updatedData.active } : item
            )
          );
          toast.success({
            title: toastT("success"),
            description: toastT("customerGroup.updateSuccess"),
          });
        },
        onError: (row, errorMessage) => {
          toast.error({
            title: toastT("error"),
            description: errorMessage || toastT("customerGroup.updateError"),
          });
        },
      }),
    ],
  });

  const salesmenActions = useCustomActions({
    onEdit: (row) => handleEdit("salesman", row),
    onDelete: (row) => handleDelete("salesman", row),
    onPreview: (row) => {
      // Preview functionality can be added here
    },
    additionalActions: (row) => [
      ActiveStatusAction({
        row,
        editFunction: entityHandlers.salesman.editFn,
        onSuccess: (row, updatedData) => {
          entityHandlers.salesman.setData((prev) =>
            prev.map((item) =>
              item.id === row.id ? { ...item, active: updatedData.active } : item
            )
          );
          toast.success({
            title: toastT("success"),
            description: toastT("salesman.updateSuccess"),
          });
        },
        onError: (row, errorMessage) => {
          toast.error({
            title: toastT("error"),
            description: errorMessage || toastT("salesman.updateError"),
          });
        },
      }),
    ],
  });

  const customerActions = useCustomActions({
    onEdit: (row) => handleEdit("customer", row),
    onDelete: (row) => handleDelete("customer", row),
    onPreview: (row) => {
      // Preview functionality can be added here
    },
    additionalActions: (row) => [
      ActiveStatusAction({
        row,
        editFunction: entityHandlers.customer.editFn,
        onSuccess: (row, updatedData) => {
          entityHandlers.customer.setData((prev) =>
            prev.map((item) =>
              item.id === row.id ? { ...item, active: updatedData.active } : item
            )
          );
          toast.success({
            title: toastT("success"),
            description: toastT("customer.updateSuccess"),
          });
        },
        onError: (row, errorMessage) => {
          toast.error({
            title: toastT("error"),
            description: errorMessage || toastT("customer.updateError"),
          });
        },
      }),
    ],
  });

  return (
    <div className="p-4">
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <CustomTabs
            value={value}
            onChange={handleChange}
            aria-label="customer tabs"
            sx={{
              direction: isRTL ? "rtl" : "ltr",
            }}
          >
            <Tab label={t("tabs.customerGroups")} />
            <Tab label={t("tabs.salesmen")} />
            <Tab label={t("tabs.customers")} />
          </CustomTabs>
        </Box>

        {/* Customer Groups Management Tab*/}
        <TabPanel value={value} index={0}>
          <Box className="p-0">
            <Table
              data={customerGroupsData}
              columns={customerGroupColumns}
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
              customActions={customerGroupActions.customActions}
              onCustomAction={customerGroupActions.onCustomAction}
              onDelete={(row) => handleDelete("customerGroup", row)}
            />
          </Box>
        </TabPanel>

        {/* Salesmen Management Tab*/}
        <TabPanel value={value} index={1}>
          <Box className="p-0">
            <Table
              data={salesmenData}
              columns={salesmenColumns}
              onAdd={() => handleAddNew("salesman")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("salesman")}
              onExportPdf={() => handleExportPdf("salesman")}
              onPrint={() => handlePrint("salesman", salesmenData, salesmenColumns)}
              onRefresh={() => fetchData(1, true)}
              onImportExcel={(file) => handleImportExcel("salesman", file)}
              tableId="salesmen"
              customActions={salesmenActions.customActions}
              onCustomAction={salesmenActions.onCustomAction}
              onDelete={(row) => handleDelete("salesman", row)}
            />
          </Box>
        </TabPanel>

        {/* Customers Management Tab*/}
        <TabPanel value={value} index={2}>
          <Box className="p-0">
            <Table
              data={customersData}
              columns={customerColumns}
              onAdd={() => handleAddNew("customer")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("customer")}
              onExportPdf={() => handleExportPdf("customer")}
              onPrint={() =>
                handlePrint("customer", customersData, customerColumns)
              }
              onRefresh={() => fetchData(2, true)}
              onImportExcel={(file) => handleImportExcel("customer", file)}
              tableId="customers"
              customActions={customerActions.customActions}
              onCustomAction={customerActions.onCustomAction}
              onDelete={(row) => handleDelete("customer", row)}
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
          saveLoading={saveLoading}
        />
      </Box>
    </div>
  );
}
