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
  getCustomerById,
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

  const handleEdit = async (type, row) => {
    if (type === "customer") {
      try {
        // Fetch complete customer data
        const response = await getCustomerById(row.id);
        if (response.status) {
          const customerData = response.data;
          
          // Debug: Log the customer data structure
          console.log('Customer data from backend:', customerData);
          console.log('Address data:', {
            primary_billing: customerData.primary_billing_address,
            primary_shipping: customerData.primary_shipping_address,
            shipping_addresses: customerData.shipping_addresses,
            billing_addresses: customerData.billing_addresses,
            addresses: customerData.addresses,
            first_shipping_address: customerData.shipping_addresses?.[0],
            first_billing_address: customerData.billing_addresses?.[0],
          });
          console.log('Contact data:', {
            primary_contact: customerData.primary_contact,
            contacts: customerData.contacts,
          });
          console.log('Opening balances data:', {
            opening_balances: customerData.opening_balances,
            mapped_opening_balances: customerData.opening_balances?.map(balance => ({
              currency: balance.currency_code || balance.currency_id,
              amount: balance.opening_amount || balance.amount,
              date: balance.opening_date || balance.date,
              notes: balance.notes,
              is_active: balance.is_active
            })) || []
          });
          
          // Map backend data to frontend form structure
          const mappedData = {
            // Basic information
            id: customerData.id,
            title: customerData.title,
            first_name: customerData.first_name,
            middle_name: customerData.middle_name,
            last_name: customerData.last_name,
            display_name: customerData.display_name,
            company_name: customerData.company_name,
            phone1: customerData.phone1,
            phone2: customerData.phone2,
            phone3: customerData.phone3,
            file_number: customerData.file_number,
            barcode: customerData.bar_code,
            search_terms: customerData.search_terms,
            indicator: customerData.indicator,
            risk_category: customerData.risk_category,
            active: customerData.active,
            black_listed: customerData.black_listed,
            one_time_account: customerData.one_time_account,
            special_account: customerData.special_account,
            pos_customer: customerData.pos_customer,
            free_delivery_charge: customerData.free_delivery_charge,
            print_invoice_language: customerData.print_invoice_language,
            send_invoice: customerData.send_invoice,
            add_message: customerData.showMessageField,
            invoice_message: customerData.message,
            notes: customerData.notes,
            
            // Relationships
            customer_group_id: customerData.customer_group?.id,
            salesman_id: customerData.salesman?.id,
            collector_id: customerData.collector?.id,
            supervisor_id: customerData.supervisor?.id,
            manager_id: customerData.manager?.id,
            payment_term_id: customerData.payment_term?.id,
            payment_method_id: customerData.payment_method?.id,
            trade_id: customerData.trade?.id,
            company_code_id: customerData.company_code?.id,
            business_type_id: customerData.business_type?.id,
            sales_channel_id: customerData.sales_channel?.id,
            distribution_channel_id: customerData.distribution_channel?.id,
            media_channel_id: customerData.media_channel?.id,
            
            // Credit and payment settings
            allow_credit: customerData.allow_credit,
            accept_cheques: customerData.accept_cheques,
            payment_day: customerData.payment_day,
            track_payment: customerData.track_payment,
            settlement_method: customerData.settlement_method,
            
            // Pricing settings
            price_choice: customerData.price_choice ? customerData.price_choice.toUpperCase() : '',
            price_list: customerData.price_list,
            global_discount: customerData.global_discount,
            discount_class: customerData.discount_class || '',
            markup_percentage: customerData.markup_percentage,
            markdown_percentage: customerData.markdown_percentage,
            
            // Tax settings
            taxable: customerData.taxable,
            taxed_from_date: customerData.taxed_from_date ? customerData.taxed_from_date.split('T')[0] : '',
            taxed_till_date: customerData.taxed_till_date ? customerData.taxed_till_date.split('T')[0] : '',
            subjected_to_tax: customerData.subjected_to_tax,
            added_tax: customerData.added_tax,
            exempted: customerData.exempted,
            exempted_from: customerData.exempted_from,
            exemption_reference: customerData.exemption_reference,
            exempted_from_date: customerData.exempted_from_date ? customerData.exempted_from_date.split('T')[0] : '',
            exempted_till_date: customerData.exempted_till_date ? customerData.exempted_till_date.split('T')[0] : '',
            
            // Billing address - try primary first, then first billing address
            billing_address_line1: customerData.primary_billing_address?.address_line1 || customerData.billing_addresses?.[0]?.address_line1,
            billing_address_line2: customerData.primary_billing_address?.address_line2 || customerData.billing_addresses?.[0]?.address_line2,
            billing_country_id: customerData.primary_billing_address?.country_id || customerData.billing_addresses?.[0]?.country_id,
            billing_zone_id: customerData.primary_billing_address?.zone_id || customerData.billing_addresses?.[0]?.zone_id,
            billing_city_id: customerData.primary_billing_address?.city_id || customerData.billing_addresses?.[0]?.city_id,
            billing_district_id: customerData.primary_billing_address?.district_id || customerData.billing_addresses?.[0]?.district_id,
            billing_building: customerData.primary_billing_address?.building || customerData.billing_addresses?.[0]?.building,
            billing_block: customerData.primary_billing_address?.block || customerData.billing_addresses?.[0]?.block,
            billing_floor: customerData.primary_billing_address?.floor || customerData.billing_addresses?.[0]?.floor,
            billing_side: customerData.primary_billing_address?.side || customerData.billing_addresses?.[0]?.side,
            billing_apartment: customerData.primary_billing_address?.appartment || customerData.billing_addresses?.[0]?.appartment,
            billing_zip_code: customerData.primary_billing_address?.zip_code || customerData.billing_addresses?.[0]?.zip_code,
            
            // Shipping address - get from shipping_addresses array (first address)
            shipping_address_line1: customerData.shipping_addresses?.[0]?.address_line1,
            shipping_address_line2: customerData.shipping_addresses?.[0]?.address_line2,
            shipping_country_id: customerData.shipping_addresses?.[0]?.country_id,
            shipping_zone_id: customerData.shipping_addresses?.[0]?.zone_id,
            shipping_city_id: customerData.shipping_addresses?.[0]?.city_id,
            shipping_district_id: customerData.shipping_addresses?.[0]?.district_id,
            shipping_building: customerData.shipping_addresses?.[0]?.building,
            shipping_block: customerData.shipping_addresses?.[0]?.block,
            shipping_floor: customerData.shipping_addresses?.[0]?.floor,
            shipping_side: customerData.shipping_addresses?.[0]?.side,
            shipping_apartment: customerData.shipping_addresses?.[0]?.appartment,
            shipping_zip_code: customerData.shipping_addresses?.[0]?.zip_code,
            
            // Primary contact information
            work_phone: customerData.primary_contact?.work_phone,
            mobile: customerData.primary_contact?.mobile,
            position: customerData.primary_contact?.position,
            extension: customerData.primary_contact?.extension,
            
            // Arrays and complex data
            contacts: customerData.contacts || [],
            shipping_addresses: customerData.shipping_addresses || [],
            billing_addresses: customerData.billing_addresses || [],
            addresses: customerData.addresses || [],
            attachments: customerData.attachments || [],
            credit_limits: customerData.credit_limits || [],
            cheque_limits: customerData.cheque_limits || [],
            opening_balances: customerData.opening_balances || [],
            
            // Opening balances mapping for the form
            opening_balances_form: customerData.opening_balances?.map(balance => ({
              currency: balance.currency_code || balance.currency_id,
              amount: balance.opening_amount || balance.amount,
              date: balance.opening_date || balance.date,
              notes: balance.notes,
              is_active: balance.is_active
            })) || [],
          };
          
          setFormData(mappedData);
        } else {
          toast.error({
            title: toastT("error"),
            description: response.message || "Failed to fetch customer details",
          });
          return;
        }
      } catch (error) {
        toast.error({
          title: toastT("error"),
          description: error.message || "Failed to fetch customer details",
        });
        return;
      }
    } else {
      // Use drawer stack for customer groups and salesmen
      openDrawer({
        type: type,
        props: {
          editData: row,
          onSave: (updatedData) => {
            // Update the existing data in the state
            if (type === "customerGroup") {
              setCustomerGroupsData(prev => prev.map(item => 
                item.id === updatedData.id ? updatedData : item
              ));
            } else if (type === "salesman") {
              setSalesmenData(prev => prev.map(item => 
                item.id === updatedData.id ? updatedData : item
              ));
            }
          },
        },
      });
      return; // Exit early for customer groups and salesmen
    }
    
    // Use CustomerDrawer for customers
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

      // Ensure search_terms is always an array
      if (preparedData.search_terms) {
        if (typeof preparedData.search_terms === 'string') {
          // Convert string to array if it's a string
          let searchTermsArray = [];
          let termsString = preparedData.search_terms;
          
          // Remove brackets and quotes if present
          termsString = termsString.replace(/^\[|\]$/g, ''); // Remove [ and ]
          termsString = termsString.replace(/"/g, ''); // Remove quotes
          termsString = termsString.replace(/'/g, ''); // Remove single quotes
          
          // Split by comma and clean up
          searchTermsArray = termsString
            .split(',')
            .map(term => term.trim())
            .filter(term => term && term !== '');
          
          preparedData.search_terms = searchTermsArray;
        } else if (!Array.isArray(preparedData.search_terms)) {
          // If it's not an array and not a string, convert to empty array
          preparedData.search_terms = [];
        }
      } else {
        // If search_terms is null/undefined, set to empty array
        preparedData.search_terms = [];
      }

      // Convert price_choice to lowercase for backend (frontend uses uppercase)
      if (preparedData.price_choice) {
        preparedData.price_choice = preparedData.price_choice.toLowerCase();
      }

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

        // Handle shipping addresses - convert empty strings to null and add address_type
        if (preparedData.shipping_addresses && Array.isArray(preparedData.shipping_addresses)) {
          preparedData.shipping_addresses = preparedData.shipping_addresses.map(address => {
            const addressFields = ['country_id', 'zone_id', 'city_id', 'district_id'];
            const cleanedAddress = { ...address };
            
            addressFields.forEach(field => {
              if (cleanedAddress[field] === "" || cleanedAddress[field] === null) {
                cleanedAddress[field] = null;
              }
            });
            
            // Add address_type for shipping addresses
            cleanedAddress.address_type = 'shipping';
            
            return cleanedAddress;
          });
        }

        // Handle billing addresses - add address_type
        if (preparedData.billing_addresses && Array.isArray(preparedData.billing_addresses)) {
          preparedData.billing_addresses = preparedData.billing_addresses.map(address => {
            const addressFields = ['country_id', 'zone_id', 'city_id', 'district_id'];
            const cleanedAddress = { ...address };
            
            addressFields.forEach(field => {
              if (cleanedAddress[field] === "" || cleanedAddress[field] === null) {
                cleanedAddress[field] = null;
              }
            });
            
            // Add address_type for billing addresses
            cleanedAddress.address_type = 'billing';
            
            return cleanedAddress;
          });
        }

                 // Remove general addresses array to avoid conflicts with billing/shipping addresses
         delete preparedData.addresses;

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
