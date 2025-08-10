"use client";

import { useState, useEffect, Suspense } from "react";
import { Tabs, Tab, Box, Typography, CircularProgress, Button } from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import Table from "@/components/ui/table/Table";
import CustomerDrawer from "@/components/ui/drawers/CustomerDrawer";
import CustomerMasterListDrawer from "@/components/ui/drawers/CustomerMasterListDrawer";
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
  getCustomerMasterLists,
  getCustomerMasterListById,
  createCustomerMasterList,
  editCustomerMasterList,
  deleteCustomerMasterList,
  exportCustomerMasterListsToExcel,
  exportCustomerMasterListsToPdf,
  importCustomerMasterListsFromExcel,
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
  const [customerMasterListsData, setCustomerMasterListsData] = useState([]);
  const [dataFetched, setDataFetched] = useState({
    customerGroups: false,
    salesmen: false,
    customers: false,
    customerMasterLists: false,
  });

  const locale = useLocale();
  const isRTL = locale === "ar";

  const t = useTranslations("customers");
  const commonT = useTranslations("common");
  const tableT = useTranslations("tableColumns");
  const toastT = useTranslations("toast");

  const { customerGroupColumns, salesmenColumns, customerColumns, customerMasterListColumns } =
    useTableColumns(tableT);

  const { openDrawer } = useDrawerStack();

  // Initialize tab value from URL or localStorage
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab !== null) {
      const tabValue = parseInt(tab);
      setValue(tabValue);
      if (typeof window !== 'undefined') {
        localStorage.setItem("customersLastTab", tabValue.toString());
      }
    } else {
      // If no URL parameter, try to get from localStorage
      if (typeof window !== 'undefined') {
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
    }
  }, [searchParams, router]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem("customersLastTab", newValue.toString());
    }
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
          response = await getCustomers(1, 100); // Request 100 records to get more data
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
        case 3: // Customer Master Lists
          if (!force && dataFetched.customerMasterLists) {
            setLoading(false);
            return;
          }
          response = await getCustomerMasterLists();
          setCustomerMasterListsData(response?.data || []);
          dataType = "customerMasterLists";
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
    customerMasterList: {
      setData: setCustomerMasterListsData,
      deleteFn: deleteCustomerMasterList,
      editFn: editCustomerMasterList,
      createFn: createCustomerMasterList,
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
          
          // Debug each opening balance individually
          if (customerData.opening_balances) {
            customerData.opening_balances.forEach((balance, index) => {
              console.log(`Opening balance ${index}:`, {
                original: balance,
                currency_code: balance.currency_code,
                currency_id: balance.currency_id,
                currency: balance.currency,
                opening_amount: balance.opening_amount,
                amount: balance.amount,
                opening_date: balance.opening_date,
                date: balance.date
              });
            });
          }
          
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
            showMessageField: customerData.showMessageField,
            message: customerData.message,
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
            // Pricing percentages (prefer plain keys if backend provides them)
            markup: customerData.markup ?? customerData.markup_percentage,
            markdown: customerData.markdown ?? customerData.markdown_percentage,
            
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
            billing_apartment: customerData.primary_billing_address?.apartment || customerData.primary_billing_address?.appartment || customerData.billing_addresses?.[0]?.apartment || customerData.billing_addresses?.[0]?.appartment,
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
            shipping_apartment: customerData.shipping_addresses?.[0]?.apartment || customerData.shipping_addresses?.[0]?.appartment,
            shipping_zip_code: customerData.shipping_addresses?.[0]?.zip_code,
            shipping_notes: customerData.shipping_addresses?.[0]?.notes,
            
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
            
            // Debug: Log credit limits data
            ...(customerData.credit_limits && {
              _debug_credit_limits: {
                original: customerData.credit_limits,
                count: customerData.credit_limits.length,
                sample: customerData.credit_limits[0]
              }
            }),
            
            // Opening balances mapping for the form
            opening_balances_form: customerData.opening_balances?.map(balance => ({
              currency: balance.currency_code || balance.currency_id || balance.currency || '',
              amount: balance.opening_amount || balance.amount || '',
              date: (balance.opening_date || balance.date) ? (balance.opening_date || balance.date).split('T')[0] : '',
              notes: balance.notes || '',
              is_active: balance.is_active
            })) || [],
          };
          
          // Debug: Log the mapped data
          console.log('handleEdit: Mapped customer data:', mappedData);
          console.log('handleEdit: Credit limits data:', mappedData.credit_limits);
          
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
    } else if (type === "customerMasterList") {
      try {
        const response = await getCustomerMasterListById(row.id);
        if (response.status) {
          const customerMasterListData = response.data;

          // Map backend data to frontend form structure
          const mappedData = {
            id: customerMasterListData.id,
            name: customerMasterListData.name || customerMasterListData.title || "",
            date: customerMasterListData.date ? customerMasterListData.date.split('T')[0] : "",
            valid_from: customerMasterListData.valid_from ? customerMasterListData.valid_from.split('T')[0] : "",
            valid_till: customerMasterListData.valid_till ? customerMasterListData.valid_till.split('T')[0] : "",
            active: customerMasterListData.active !== undefined ? customerMasterListData.active : true,
            items: customerMasterListData.items ? customerMasterListData.items.map(item => ({
              id: item.pivot?.id || `row_${item.id}`, // Use pivot.id if available, otherwise create a unique row id
              item_id: item.id, // This is the actual item ID from the items table
              itemcode: item.code || item.itemcode || "",
              price: parseFloat(item.pivot?.price || item.price || 0),
              discount: parseFloat(item.pivot?.discount || item.discount || 0),
              line: item.pivot?.line || item.line || "",
              isEnabled: true
            })) : [],
          };
          
          setFormData(mappedData);
          
          // Open the CustomerMasterListDrawer for editing
          setActiveDrawerType(type);
          setIsEditMode(true);
          setIsDrawerOpen(true);
          
          return; // Exit early for customer master lists
        } else {
          toast.error({
            title: toastT("error"),
            description: response.message || "Failed to fetch customer master list details",
          });
          return;
        }
      } catch (error) {
        console.error('Error in customerMasterList edit:', error);
        toast.error({
          title: toastT("error"),
          description: error.message || "Failed to fetch customer master list details",
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
    } else if (type === "customerMasterList") {
      // Use CustomerMasterListDrawer for customer master lists
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

  const handleSave = async (newData) => {
    const type = activeDrawerType;
    
    // Handle customer master lists differently (drawer handles API calls)
    if (type === "customerMasterList") {
      // Update local state directly
      if (newData) {
        const setDataFunction = entityHandlers[type]?.setData;
        if (setDataFunction) {
          setDataFunction(prev => {
            // If editing, replace the item; if creating, add new item
            if (isEditMode) {
              return prev.map(item => item.id === newData.id ? newData : item);
            } else {
              return [...prev, newData];
            }
          });
        }
      }
      return; // Exit early for customer master lists
    }
    
    // Handle other types (customers, etc.)
    const handler = entityHandlers[type];

    try {
      setSaveLoading(true);
      // Prepare the data with proper types
      let preparedData = {
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

      // Map barcode field from frontend to backend format
      if (preparedData.barcode !== undefined) {
        preparedData.bar_code = preparedData.barcode;
        delete preparedData.barcode;
      }

      // Map field names from frontend to backend format
       const fieldMappings = {
        // Basic information
        'print_invoice_language': 'print_invoice_language',
        'send_invoice': 'send_invoice',
        'showMessageField': 'showMessageField',
        'message': 'message',
        'notes': 'notes',
        
        // Relationships
        'customer_group_id': 'customer_group_id',
        'salesman_id': 'salesman_id',
        'collector_id': 'collector_id',
        'supervisor_id': 'supervisor_id',
        'manager_id': 'manager_id',
        'trade_id': 'trade_id',
        'company_code_id': 'company_code_id',
        'business_type_id': 'business_type_id',
        'sales_channel_id': 'sales_channel_id',
        'distribution_channel_id': 'distribution_channel_id',
        'media_channel_id': 'media_channel_id',
        
        // Credit and payment settings
        'allow_credit': 'allow_credit',
        'accept_cheques': 'accept_cheques',
        'payment_day': 'payment_day',
        'track_payment': 'track_payment',
        'settlement_method': 'settlement_method',
        
         // Pricing settings
         'price_list': 'price_list',
         'global_discount': 'global_discount',
         'discount_class': 'discount_class',
         'markup': 'markup',
         'markdown': 'markdown',
        
        // Tax settings
        'taxable': 'taxable',
        'taxed_from_date': 'taxed_from_date',
        'taxed_till_date': 'taxed_till_date',
        'subjected_to_tax': 'subjected_to_tax',
        'added_tax': 'added_tax',
        'exempted_from': 'exempted_from',
        'exemption_reference': 'exemption_reference',
        'exempted_from_date': 'exempted_from_date',
        'exempted_till_date': 'exempted_till_date',
        
        // Categorize section fields
        'indicator': 'indicator',
        'risk_category': 'risk_category',
      };

               // Ensure categorize section fields are properly formatted for backend
         // These fields should be sent as-is since they already have the correct backend field names
         const categorizeFields = [
           'trade_id', 'company_code_id', 'customer_group_id', 'business_type_id',
           'sales_channel_id', 'distribution_channel_id', 'media_channel_id',
           'indicator', 'risk_category'
         ];
         
         // Ensure opening balances are preserved and not affected by field mappings
         if (preparedData.opening_balances) {
           console.log('Opening balances preserved:', preparedData.opening_balances);
         }
      
      // Ensure all categorize fields are present and properly formatted
      categorizeFields.forEach(field => {
        if (preparedData[field] !== undefined) {
          // Convert empty strings to null for ID fields
          if (field.endsWith('_id') && (preparedData[field] === "" || preparedData[field] === null)) {
            preparedData[field] = null;
          }
          // Ensure string fields are properly formatted
          else if (field === 'indicator' || field === 'risk_category') {
            preparedData[field] = preparedData[field] || null;
          }
        }
      });

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

        // Handle billing address - keep as individual fields (backend expects this format)
        // The billing address fields are already in the correct format in preparedData
        // No need to convert them to arrays

        // Handle shipping addresses - primary address from individual fields + additional addresses
        const hasPrimaryShippingAddressData = preparedData.shipping_address_line1 || preparedData.shipping_country_id || preparedData.shipping_city_id;
        
        // Create primary shipping address from individual fields
        const primaryShippingAddress = hasPrimaryShippingAddressData ? {
          address_line1: preparedData.shipping_address_line1 || '',
          address_line2: preparedData.shipping_address_line2 || '',
          country_id: preparedData.shipping_country_id || null,
          zone_id: preparedData.shipping_zone_id || null,
          city_id: preparedData.shipping_city_id || null,
          district_id: preparedData.shipping_district_id || null,
          building: preparedData.shipping_building || '',
          block: preparedData.shipping_block || '',
          floor: preparedData.shipping_floor || '',
          side: preparedData.shipping_side || '',
          apartment: preparedData.shipping_apartment || null,
          zip_code: preparedData.shipping_zip_code || '',
          notes: preparedData.shipping_notes || '',
          is_primary: true,
          address_type: 'shipping'
        } : null;

        // Get additional shipping addresses (if any)
        const additionalShippingAddresses = preparedData.shipping_addresses && Array.isArray(preparedData.shipping_addresses) 
          ? preparedData.shipping_addresses.map(address => {
            const addressFields = ['country_id', 'zone_id', 'city_id', 'district_id'];
            const cleanedAddress = { ...address };
            
            addressFields.forEach(field => {
              if (cleanedAddress[field] === "" || cleanedAddress[field] === null) {
                cleanedAddress[field] = null;
              }
            });
              
              // Ensure additional addresses have correct flags
              cleanedAddress.address_type = 'shipping';
              // Remove is_primary field to let backend handle it
              delete cleanedAddress.is_primary;
            
            return cleanedAddress;
            })
          : [];

        // Combine primary and additional addresses
        if (primaryShippingAddress) {
          // Ensure only the first address is primary, rest are not
          const allAddresses = [primaryShippingAddress, ...additionalShippingAddresses];
          preparedData.shipping_addresses = allAddresses.map((address, index) => ({
            ...address,
            is_primary: index === 0, // Only first address is primary
            address_type: 'shipping'
          }));
        } else {
          // If no primary address, make first additional address primary
          preparedData.shipping_addresses = additionalShippingAddresses.map((address, index) => ({
            ...address,
            is_primary: index === 0, // Only first address is primary
            address_type: 'shipping'
          }));
        }

        // Remove individual shipping address fields to avoid conflicts with shipping_addresses array
        const individualShippingAddressFields = [
          'shipping_address_line1', 'shipping_address_line2', 'shipping_country_id', 'shipping_zone_id',
          'shipping_city_id', 'shipping_district_id', 'shipping_building', 'shipping_block',
          'shipping_floor', 'shipping_side', 'shipping_apartment', 'shipping_zip_code', 'shipping_notes'
        ];
        
        individualShippingAddressFields.forEach(field => {
          delete preparedData[field];
        });

         // Remove general addresses array to avoid conflicts with billing/shipping addresses
         delete preparedData.addresses;

        // Remove contact fields from top level
        delete preparedData.work_phone;
        delete preparedData.mobile;
        delete preparedData.position;
        delete preparedData.extension;

                 // Debug: Log the opening balances form data
         console.log('Opening balances form data:', preparedData.opening_balances_form);
         
         // Process opening balances for backend - map to correct field names
         if (preparedData.opening_balances_form && Array.isArray(preparedData.opening_balances_form) && preparedData.opening_balances_form.length > 0) {
           console.log('Opening balances form data is valid, processing...');
           console.log('Raw opening balances form data:', preparedData.opening_balances_form);
           
           // Only process balances that have both currency and amount
           const validBalances = preparedData.opening_balances_form.filter(balance => {
             const hasCurrency = balance.currency && balance.currency.toString().trim() !== '';
             const hasAmount = balance.amount && balance.amount.toString().trim() !== '';
             console.log('Balance check:', { balance, hasCurrency, hasAmount });
             return hasCurrency && hasAmount;
           });
           
           console.log('Valid balances:', validBalances);
           
           if (validBalances.length > 0) {
             try {
               // Import currencies to get the mapping
               const { getCurrencies } = await import('@/API/Currency');
               const currenciesResponse = await getCurrencies();
               console.log('Currencies API response:', currenciesResponse);
               
               const currencies = currenciesResponse.data || currenciesResponse || [];
               console.log('Currencies data:', currencies);
               
               // Create a mapping from currency code to ID
               const currencyCodeToId = {};
               currencies.forEach(currency => {
                 currencyCodeToId[currency.code] = currency.id;
               });
               
               console.log('Currency mapping:', currencyCodeToId);
               
               // If no currencies found, try a fallback approach
               if (Object.keys(currencyCodeToId).length === 0) {
                 console.warn('No currencies found from API, using fallback mapping');
                 // Common currency mappings as fallback
                 const fallbackMapping = {
                   'USD': 1,
                   'EUR': 2,
                   'GBP': 3,
                   'SAR': 4,
                   'AED': 5
                 };
                 
                 preparedData.opening_balances = validBalances.map(balance => {
                   const currencyId = fallbackMapping[balance.currency] || 1; // Default to USD (ID: 1)
                   console.log(`Using fallback: Converting currency ${balance.currency} to ID:`, currencyId);
                   
                   return {
                     currency_id: currencyId,
                     currency: balance.currency, // Add currency code as well
                     amount: parseFloat(balance.amount) || 0, // Add amount field
                     opening_amount: parseFloat(balance.amount) || 0,
                     opening_date: balance.date || null,
                     notes: balance.notes || ''
                   };
                 });
               } else {
                 preparedData.opening_balances = validBalances.map(balance => {
                   const currencyId = currencyCodeToId[balance.currency];
                   console.log(`Converting currency ${balance.currency} to ID:`, currencyId);
                   console.log('Available currencies:', currencies.map(c => ({ code: c.code, id: c.id })));
                  
                   if (!currencyId) {
                     console.error(`Currency code "${balance.currency}" not found in currencies list`);
                     // Use fallback ID for unknown currencies
                     return {
                       currency_id: 1, // Default to USD
                       currency: balance.currency, // Add currency code as well
                       amount: parseFloat(balance.amount) || 0, // Add amount field
                       opening_amount: parseFloat(balance.amount) || 0,
                       opening_date: balance.date || null,
                       notes: balance.notes || ''
                     };
                   }
                   
                   return {
                     currency_id: currencyId,
                     currency: balance.currency, // Add currency code as well
                     amount: parseFloat(balance.amount) || 0, // Add amount field
                     opening_amount: parseFloat(balance.amount) || 0,
                     opening_date: balance.date || null,
                     notes: balance.notes || ''
                   };
                 });
               }
               
               console.log('Mapped opening balances for backend:', preparedData.opening_balances);
             } catch (error) {
               console.error('Error fetching currencies, using fallback:', error);
               // Fallback: use currency code as ID (assuming backend can handle it)
               preparedData.opening_balances = validBalances.map(balance => ({
                 currency_id: balance.currency, // Send currency code as fallback
                 currency: balance.currency, // Add currency code as well
                 amount: parseFloat(balance.amount) || 0, // Add amount field
                 opening_amount: parseFloat(balance.amount) || 0,
                 opening_date: balance.date || null,
                 notes: balance.notes || ''
               }));
             }
           } else {
             console.log('No valid opening balances found');
             preparedData.opening_balances = [];
           }
         } else {
           console.log('No opening balances form data or empty array');
           preparedData.opening_balances = [];
         }
         
         // Debug: Log the opening balances data being sent
         console.log('Opening balances being sent to backend:', preparedData.opening_balances);
         
         // Remove the form version since we've mapped it to the correct format
         delete preparedData.opening_balances_form;

        // Process credit limits for backend - map to correct field names
        if (formData.creditLimits && typeof formData.creditLimits === 'object') {
          const validCreditLimits = [];
          
          // Get currencies for mapping
          try {
            const { getCurrencies } = await import('@/API/Currency');
            const currenciesResponse = await getCurrencies();
            const currencies = currenciesResponse.data || currenciesResponse || [];
            
            // Create a mapping from currency code to ID
            const currencyCodeToId = {};
            currencies.forEach(currency => {
              currencyCodeToId[currency.code] = currency.id;
            });
            
            // Process each credit limit
            Object.entries(formData.creditLimits).forEach(([currencyCode, limitAmount]) => {
              if (limitAmount && limitAmount.toString().trim() !== '') {
                const currencyId = currencyCodeToId[currencyCode] || 1; // Default to USD (ID: 1)
                
                validCreditLimits.push({
                  currency_id: currencyId,
                  credit_limit: parseFloat(limitAmount) || 0,
                  notes: `Credit limit for ${currencyCode}`
                });
              }
            });
            
            preparedData.credit_limits = validCreditLimits;
          } catch (error) {
            console.error('Error processing credit limits:', error);
            // Fallback: use currency code as ID
            preparedData.credit_limits = Object.entries(formData.creditLimits)
              .filter(([_, limitAmount]) => limitAmount && limitAmount.toString().trim() !== '')
              .map(([currencyCode, limitAmount]) => ({
                currency_id: currencyCode, // Send currency code as fallback
                credit_limit: parseFloat(limitAmount) || 0,
                notes: `Credit limit for ${currencyCode}`
              }));
          }
        } else {
          preparedData.credit_limits = [];
        }
        
        // Remove the frontend creditLimits field to avoid conflicts
        delete preparedData.creditLimits;
        
        // Process max cheques for backend - map to correct field names
        if (formData.maxCheques && typeof formData.maxCheques === 'object') {
          // Filter out empty values and convert to proper format
          const validMaxCheques = {};
          Object.entries(formData.maxCheques).forEach(([currencyCode, maxCheques]) => {
            if (maxCheques && maxCheques.toString().trim() !== '') {
              validMaxCheques[currencyCode] = parseInt(maxCheques) || 0;
            }
          });
          
          preparedData.max_cheques = validMaxCheques;
        } else {
          preparedData.max_cheques = {};
        }
        
        // Remove the frontend maxCheques field to avoid conflicts
        delete preparedData.maxCheques;

        // Handle tax-related fields - only send if customer is taxable
        if (preparedData.exempted === true || preparedData.exempted === "true") {
          // If customer is exempted (not taxable), remove tax-related fields
          delete preparedData.added_tax;
          delete preparedData.taxed_from_date;
          delete preparedData.taxed_till_date;
          delete preparedData.exempted_from_date;
          delete preparedData.exempted_till_date;
          delete preparedData.exemption_reference;
        } else {
          // If customer is taxable, ensure tax fields are properly formatted
          if (preparedData.added_tax === 0 || preparedData.added_tax === "0" || preparedData.added_tax === "0.00") {
            preparedData.added_tax = null;
          }
          if (preparedData.taxed_from_date === "" || preparedData.taxed_from_date === null) {
            delete preparedData.taxed_from_date;
          }
          if (preparedData.taxed_till_date === "" || preparedData.taxed_till_date === null) {
            delete preparedData.taxed_till_date;
          }
          if (preparedData.exempted_from_date === "" || preparedData.exempted_from_date === null) {
            delete preparedData.exempted_from_date;
          }
          if (preparedData.exempted_till_date === "" || preparedData.exempted_till_date === null) {
            delete preparedData.exempted_till_date;
          }
          if (preparedData.exemption_reference === "" || preparedData.exemption_reference === null) {
            delete preparedData.exemption_reference;
          }
        }

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
        
        // Handle payment terms field mapping - backend expects different field names
        if (preparedData.payment_term_id) {
          preparedData.selected_payment_term = preparedData.payment_term_id;
          delete preparedData.payment_term_id;
        }
        
        if (preparedData.payment_method_id) {
          preparedData.selected_payment_method = preparedData.payment_method_id;
          delete preparedData.payment_method_id;
        }
        
        // Debug: log pricing values before normalization
        console.log('Pricing (incoming from formData):', {
          form_markup: formData.markup,
          form_markdown: formData.markdown,
          form_markup_percentage: formData.markup_percentage,
          form_markdown_percentage: formData.markdown_percentage,
        });

        console.log('Pricing (prepared before normalize):', {
          prepared_markup: preparedData.markup,
          prepared_markdown: preparedData.markdown,
          prepared_markup_percentage: preparedData.markup_percentage,
          prepared_markdown_percentage: preparedData.markdown_percentage,
        });

        // Normalize pricing keys to backend contract (send markup/markdown)
        if (preparedData.global_discount !== undefined && preparedData.global_discount !== null && preparedData.global_discount !== '') {
          preparedData.global_discount = Number(preparedData.global_discount);
        }
        // Prefer plain keys. If only percentage keys exist, map them over.
        if ((preparedData.markup === undefined || preparedData.markup === '') && preparedData.markup_percentage !== undefined) {
          preparedData.markup = preparedData.markup_percentage;
        }
        if ((preparedData.markdown === undefined || preparedData.markdown === '') && preparedData.markdown_percentage !== undefined) {
          preparedData.markdown = preparedData.markdown_percentage;
        }
        if (preparedData.markup !== undefined && preparedData.markup !== null && preparedData.markup !== '') {
          preparedData.markup = Number(preparedData.markup);
        }
        if (preparedData.markdown !== undefined && preparedData.markdown !== null && preparedData.markdown !== '') {
          preparedData.markdown = Number(preparedData.markdown);
        }
        // Ensure only plain keys are sent
        if ('markup_percentage' in preparedData) delete preparedData.markup_percentage;
        if ('markdown_percentage' in preparedData) delete preparedData.markdown_percentage;

        console.log('Pricing (after normalize):', {
          markup: preparedData.markup,
          markdown: preparedData.markdown,
          has_markup_percentage: 'markup_percentage' in preparedData,
          has_markdown_percentage: 'markdown_percentage' in preparedData,
        });
      }

      // Debug: Log the final prepared data being sent
      console.log('Final prepared data being sent to backend:', preparedData);
      console.log('Opening balances in final data:', preparedData.opening_balances);
      console.log('Opening balances type:', typeof preparedData.opening_balances);
      console.log('Opening balances length:', preparedData.opening_balances?.length);

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

  const handleSaveAndNew = async (newData) => {
    const type = activeDrawerType;
    
    // Handle customer master lists differently (drawer handles API calls)
    if (type === "customerMasterList") {
      // Update local state directly without closing drawer
      if (newData) {
        const setDataFunction = entityHandlers[type]?.setData;
        if (setDataFunction) {
          setDataFunction(prev => {
            // If editing, replace the item; if creating, add new item
            if (isEditMode) {
              return prev.map(item => item.id === newData.id ? newData : item);
            } else {
              return [...prev, newData];
            }
          });
        }
      }
      // Reset editData to null for new entry (drawer will clear fields)
      setIsEditMode(false);
      setFormData({});
      return; // Exit early for customer master lists
    }
    
    // Handle other types
    await handleSave(newData);
    setFormData({});
    if (isEditMode) {
      setIsEditMode(false);
      setFormData({});
    }
  };

  const handleSaveAndClose = async (newData) => {
    const type = activeDrawerType;
    
    // Handle customer master lists differently (drawer handles API calls)
    if (type === "customerMasterList") {
      await handleSave(newData);
      handleCloseDrawer();
      return; // Exit early for customer master lists
    }
    
    // Handle other types
    await handleSave(newData);
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
        case "customerMasterList":
          response = await exportCustomerMasterListsToExcel();
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
        case "customerMasterList":
          response = await exportCustomerMasterListsToPdf();
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
        case "customerMasterList":
          response = await importCustomerMasterListsFromExcel(file);
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

  const customerMasterListActions = useCustomActions({
    onEdit: (row) => handleEdit("customerMasterList", row),
    onDelete: (row) => handleDelete("customerMasterList", row),
    onPreview: (row) => {
      // Preview functionality can be added here
    },
    additionalActions: (row) => [
      ActiveStatusAction({
        row,
        editFunction: entityHandlers.customerMasterList.editFn,
        onSuccess: (row, updatedData) => {
          entityHandlers.customerMasterList.setData((prev) =>
            prev.map((item) =>
              item.id === row.id ? { ...item, active: updatedData.active } : item
            )
          );
          toast.success({
            title: toastT("success"),
            description: toastT("customerMasterList.updateSuccess"),
          });
        },
        onError: (row, errorMessage) => {
          toast.error({
            title: toastT("error"),
            description: errorMessage || toastT("customerMasterList.updateError"),
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
            <Tab label={t("tabs.customerMasterLists")} />
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

        {/* Customer Master Lists Management Tab*/}
        <TabPanel value={value} index={3}>
          <Box className="p-0">
            <Table
              data={customerMasterListsData || []}
              columns={customerMasterListColumns}
              onAdd={() => handleAddNew("customerMasterList")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("customerMasterList")}
              onExportPdf={() => handleExportPdf("customerMasterList")}
              onPrint={() =>
                handlePrint(
                  "customerMasterList",
                  customerMasterListsData,
                  customerMasterListColumns
                )
              }
              onRefresh={() => fetchData(3, true)}
              onImportExcel={(file) => handleImportExcel("customerMasterList", file)}
              tableId="customerMasterLists"
              customActions={customerMasterListActions.customActions}
              onCustomAction={customerMasterListActions.onCustomAction}
              onDelete={(row) => handleDelete("customerMasterList", row)}
            />
          </Box>
        </TabPanel>

        {/* Customer Drawer */}
        <CustomerDrawer
          isOpen={isDrawerOpen && activeDrawerType === "customer"}
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

        {/* Customer Master List Drawer */}
        <CustomerMasterListDrawer
          isOpen={isDrawerOpen && activeDrawerType === "customerMasterList"}
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
