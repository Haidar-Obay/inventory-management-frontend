"use client";

import { useState, useEffect, Suspense } from "react";
import { Tabs, Tab, Box, Typography, CircularProgress } from "@mui/material";
import Table from "@/components/ui/table/Table";
import CustomTabs from "@/components/ui/CustomTabs";
import { useTranslations, useLocale } from "next-intl";
import {
  getBusinessTypes,
  getSalesChannels,
  getDistributionChannels,
  getMediaChannels,
  deleteBusinessType,
  deleteSalesChannel,
  deleteDistributionChannel,
  deleteMediaChannel,
  exportBusinessTypesToExcel,
  exportBusinessTypesToPdf,
  importBusinessTypesFromExcel,
  exportSalesChannelsToExcel,
  exportSalesChannelsToPdf,
  importSalesChannelsFromExcel,
  exportDistributionChannelsToExcel,
  exportDistributionChannelsToPdf,
  importDistributionChannelsFromExcel,
  exportMediaChannelsToExcel,
  exportMediaChannelsToPdf,
  importMediaChannelsFromExcel,
} from "@/API/GeneralFiles";
import { useTableColumns } from "@/constants/tableColumns";
import { toast } from "@/components/ui/simple-toast";
import { useSearchParams, useRouter } from "next/navigation";
import { useCustomActions } from "@/components/ui/table/useCustomActions";
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
function GeneralFilesPageLoading() {
  const t = useTranslations("generalFiles");
  return (
    <div className="flex justify-center items-center min-h-screen">
      <CircularProgress />
      <span className="ml-2">{t("loading")}</span>
    </div>
  );
}

// Main component wrapped with Suspense
export default function GeneralFilesPageWrapper() {
  return (
    <Suspense fallback={<GeneralFilesPageLoading />}>
      <GeneralFilesPage />
    </Suspense>
  );
}

// The actual component that uses useSearchParams
function GeneralFilesPage() {
  const t = useTranslations("generalFiles");
  const tableT = useTranslations("tableColumns");
  const toastT = useTranslations("toast");
  const { 
    businessTypesColumns, 
    salesChannelsColumns, 
    distributionChannelsColumns, 
    mediaChannelsColumns 
  } = useTableColumns(tableT);
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [value, setValue] = useState(0);
  const [businessTypesData, setBusinessTypesData] = useState([]);
  const [salesChannelsData, setSalesChannelsData] = useState([]);
  const [distributionChannelsData, setDistributionChannelsData] = useState([]);
  const [mediaChannelsData, setMediaChannelsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState({
    businessTypes: false,
    salesChannels: false,
    distributionChannels: false,
    mediaChannels: false,
  });
  
  const { openDrawer } = useDrawerStack();

  // Initialize tab value from URL or localStorage
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab !== null) {
      const tabValue = parseInt(tab);
      setValue(tabValue);
      localStorage.setItem("generalFilesLastTab", tabValue.toString());
    } else {
      // If no URL parameter, try to get from localStorage
      const savedTab = localStorage.getItem("generalFilesLastTab");
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
    localStorage.setItem("generalFilesLastTab", newValue.toString());
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
        case 0: // Business Types
          if (!force && dataFetched.businessTypes) {
            setLoading(false);
            return;
          }
          response = await getBusinessTypes();
          setBusinessTypesData(response.data || []);
          dataType = "businessTypes";
          break;
        case 1: // Sales Channels
          if (!force && dataFetched.salesChannels) {
            setLoading(false);
            return;
          }
          response = await getSalesChannels();
          setSalesChannelsData(response.data || []);
          dataType = "salesChannels";
          break;
        case 2: // Distribution Channels
          if (!force && dataFetched.distributionChannels) {
            setLoading(false);
            return;
          }
          response = await getDistributionChannels();
          setDistributionChannelsData(response.data || []);
          dataType = "distributionChannels";
          break;
        case 3: // Media Channels
          if (!force && dataFetched.mediaChannels) {
            setLoading(false);
            return;
          }
          response = await getMediaChannels();
          setMediaChannelsData(response.data || []);
          dataType = "mediaChannels";
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
    businessType: {
      setData: setBusinessTypesData,
      deleteFn: deleteBusinessType,
    },
    salesChannel: {
      setData: setSalesChannelsData,
      deleteFn: deleteSalesChannel,
    },
    distributionChannel: {
      setData: setDistributionChannelsData,
      deleteFn: deleteDistributionChannel,
    },
    mediaChannel: {
      setData: setMediaChannelsData,
      deleteFn: deleteMediaChannel,
    },
  };

  const handleEdit = (type, row) => {
    // Get the correct sub field name based on type
    const getSubFieldName = () => {
      switch (type) {
        case "salesChannel":
          return "sub_sales_of";
        case "distributionChannel":
          return "sub_distribution_of";
        case "mediaChannel":
          return "sub_media_of";
        default:
          return "sub_of";
      }
    };

    const subFieldName = getSubFieldName();
    
    // Prepare form data based on type
    let formData = { id: row.id, code: row.code, name: row.name };
    
    if (type === "businessType") {
      // Business type only has id, code, name
      formData = { id: row.id, code: row.code, name: row.name };
    } else {
      // Other types have sub field
      formData = { 
        id: row.id, 
        code: row.code, 
        name: row.name, 
        [subFieldName]: row[subFieldName] 
      };
    }

    openDrawer({
      type: type,
      props: {
        isEdit: true,
        formData: formData,
        onSave: (data) => {
          // Update the data in the state
          const setData = entityHandlers[type].setData;
          setData((prev) =>
            prev.map((item) =>
              item.id === data.id ? { ...item, ...data } : item
            )
          );
          setDataFetched((prev) => ({
            ...prev,
            [type]: false,
          }));
        },
      },
    });
  };

  const handleDelete = async (type, row) => {
    try {
      const response = await entityHandlers[type].deleteFn(row.id);
      if (response.status) {
        entityHandlers[type].setData((prev) =>
          prev.filter((item) => item.id !== row.id)
        );
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
    openDrawer({
      type: type,
      props: {
        isEdit: false,
        formData: undefined,
        onSave: (data) => {
          // Add the new data to the state
          const setData = entityHandlers[type].setData;
          setData((prev) => [...prev, data]);
          setDataFetched((prev) => ({
            ...prev,
            [type]: false,
          }));
        },
      },
    });
  };



  const handleExportExcel = async (type) => {
    try {
      let response;
      switch (type) {
        case "businessType":
          response = await exportBusinessTypesToExcel();
          break;
        case "salesChannel":
          response = await exportSalesChannelsToExcel();
          break;
        case "distributionChannel":
          response = await exportDistributionChannelsToExcel();
          break;
        case "mediaChannel":
          response = await exportMediaChannelsToExcel();
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
        case "businessType":
          response = await exportBusinessTypesToPdf();
          break;
        case "salesChannel":
          response = await exportSalesChannelsToPdf();
          break;
        case "distributionChannel":
          response = await exportDistributionChannelsToPdf();
          break;
        case "mediaChannel":
          response = await exportMediaChannelsToPdf();
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
        case "businessType":
          response = await importBusinessTypesFromExcel(file);
          break;
        case "salesChannel":
          response = await importSalesChannelsFromExcel(file);
          break;
        case "distributionChannel":
          response = await importDistributionChannelsFromExcel(file);
          break;
        case "mediaChannel":
          response = await importMediaChannelsFromExcel(file);
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
      // Logic to prepare data for printing
      // Here you can use a library like `react-to-print` or open a new window with a printable format
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

  // Setup custom actions for each entity type
  const businessTypeActions = useCustomActions({
    onEdit: (row) => handleEdit("businessType", row),
    onDelete: (row) => handleDelete("businessType", row),
    onPreview: (row) => {
      // Preview functionality can be added here
    },
  });

  const salesChannelActions = useCustomActions({
    onEdit: (row) => handleEdit("salesChannel", row),
    onDelete: (row) => handleDelete("salesChannel", row),
    onPreview: (row) => {
      // Preview functionality can be added here
    },
  });

  const distributionChannelActions = useCustomActions({
    onEdit: (row) => handleEdit("distributionChannel", row),
    onDelete: (row) => handleDelete("distributionChannel", row),
    onPreview: (row) => {
      // Preview functionality can be added here
    },
  });

  const mediaChannelActions = useCustomActions({
    onEdit: (row) => handleEdit("mediaChannel", row),
    onDelete: (row) => handleDelete("mediaChannel", row),
    onPreview: (row) => {
      // Preview functionality can be added here
    },
  });

  return (
    <div className="p-4">
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <CustomTabs
            value={value}
            onChange={handleChange}
            aria-label="general files tabs"
            sx={{
              direction: isRTL ? "rtl" : "ltr",
            }}
          >
            <Tab label={t("tabs.businessTypes")} />
            <Tab label={t("tabs.salesChannels")} />
            <Tab label={t("tabs.distributionChannels")} />
            <Tab label={t("tabs.mediaChannels")} />
          </CustomTabs>
        </Box>

        {/* Business Types Management Tab */}
        <TabPanel value={value} index={0}>
          <Box className="p-0">
            <Table
              columns={businessTypesColumns}
              data={businessTypesData}
              t={t}
              onAdd={() => handleAddNew("businessType")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("businessType")}
              onExportPdf={() => handleExportPdf("businessType")}
              onPrint={() =>
                handlePrint("businessType", businessTypesData, businessTypesColumns)
              }
              onRefresh={() => fetchData(0, true)}
              onImportExcel={(file) => handleImportExcel("businessType", file)}
              tableId="businessTypes"
              customActions={businessTypeActions.customActions}
              onCustomAction={businessTypeActions.onCustomAction}
              onDelete={(row) => handleDelete("businessType", row)}
            />
          </Box>
        </TabPanel>

        {/* Sales Channels Management Tab */}
        <TabPanel value={value} index={1}>
          <Box className="p-0">
            <Table
              data={salesChannelsData}
              columns={salesChannelsColumns}
              t={t}
              onAdd={() => handleAddNew("salesChannel")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("salesChannel")}
              onExportPdf={() => handleExportPdf("salesChannel")}
              onPrint={() => handlePrint("salesChannel", salesChannelsData, salesChannelsColumns)}
              onRefresh={() => fetchData(1, true)}
              onImportExcel={(file) => handleImportExcel("salesChannel", file)}
              tableId="salesChannels"
              customActions={salesChannelActions.customActions}
              onCustomAction={salesChannelActions.onCustomAction}
              onDelete={(row) => handleDelete("salesChannel", row)}
            />
          </Box>
        </TabPanel>

        {/* Distribution Channels Management Tab */}
        <TabPanel value={value} index={2}>
          <Box className="p-0">
            <Table
              data={distributionChannelsData}
              columns={distributionChannelsColumns}
              t={t}
              onAdd={() => handleAddNew("distributionChannel")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("distributionChannel")}
              onExportPdf={() => handleExportPdf("distributionChannel")}
              onPrint={() =>
                handlePrint("distributionChannel", distributionChannelsData, distributionChannelsColumns)
              }
              onRefresh={() => fetchData(2, true)}
              onImportExcel={(file) => handleImportExcel("distributionChannel", file)}
              tableId="distributionChannels"
              customActions={distributionChannelActions.customActions}
              onCustomAction={distributionChannelActions.onCustomAction}
              onDelete={(row) => handleDelete("distributionChannel", row)}
            />
          </Box>
        </TabPanel>

        {/* Media Channels Management Tab */}
        <TabPanel value={value} index={3}>
          <Box className="p-0">
            <Table
              data={mediaChannelsData}
              columns={mediaChannelsColumns}
              t={t}
              onAdd={() => handleAddNew("mediaChannel")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("mediaChannel")}
              onExportPdf={() => handleExportPdf("mediaChannel")}
              onPrint={() => handlePrint("mediaChannel", mediaChannelsData, mediaChannelsColumns)}
              onRefresh={() => fetchData(3, true)}
              onImportExcel={(file) => handleImportExcel("mediaChannel", file)}
              tableId="mediaChannels"
              customActions={mediaChannelActions.customActions}
              onCustomAction={mediaChannelActions.onCustomAction}
              onDelete={(row) => handleDelete("mediaChannel", row)}
            />
          </Box>
        </TabPanel>


      </Box>
    </div>
  );
} 