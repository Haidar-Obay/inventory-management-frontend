"use client";

import { useState, useEffect, Suspense } from "react";
import { Tabs, Tab, Box, Typography, CircularProgress } from "@mui/material";
import Table from "@/components/ui/table/Table";
import AddressCodeDrawer from "@/components/ui/drawers/AddressCodeDrawer";
import CustomTabs from "@/components/ui/CustomTabs";
import { useTranslations } from "next-intl";
import {
  getCountries,
  getZones,
  getCities,
  getDistricts,
  deleteCountry,
  deleteCity,
  deleteZone,
  editCountry,
  editZone,
  editCity,
  editDistrict,
  deleteDistrict,
  createCountry,
  createZone,
  createCity,
  createDistrict,
  exportCitiesToExcel,
  exportCitiesToPdf,
  importCitiesFromExcel,
  exportCountriesToExcel,
  exportCountriesToPdf,
  importCountriesFromExcel,
  exportZonesToExcel,
  exportZonesToPdf,
  importZonesFromExcel,
  exportDistrictsToExcel,
  exportDistrictsToPdf,
  importDistrictsFromExcel,
} from "@/API/AddressCodes";
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
function AddressCodesPageLoading() {
  const t = useTranslations("addressCodes");
  return (
    <div className="flex justify-center items-center min-h-screen">
      <CircularProgress />
      <span className="ml-2">{t("loading")}</span>
    </div>
  );
}

// Main component wrapped with Suspense
export default function AddressCodesPageWrapper() {
  return (
    <Suspense fallback={<AddressCodesPageLoading />}>
      <AddressCodesPage />
    </Suspense>
  );
}

// The actual component that uses useSearchParams
function AddressCodesPage() {
  const t = useTranslations("addressCodes");
  const tableT = useTranslations("tableColumns");
  const toastT = useTranslations("toast");
  const { countryColumns, cityColumns, zoneColumns, districtColumns } =
    useTableColumns(tableT);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [countriesData, setCountriesData] = useState([]);
  const [zonesData, setZonesData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [districtsData, setDistrictsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeDrawerType, setActiveDrawerType] = useState("");
  const [formData, setFormData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [dataFetched, setDataFetched] = useState({
    countries: false,
    zones: false,
    cities: false,
    districts: false,
  });

  // Initialize tab value from URL or localStorage
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab !== null) {
      const tabValue = parseInt(tab);
      setValue(tabValue);
      localStorage.setItem("addressCodesLastTab", tabValue.toString());
    } else {
      // If no URL parameter, try to get from localStorage
      const savedTab = localStorage.getItem("addressCodesLastTab");
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
    localStorage.setItem("addressCodesLastTab", newValue.toString());
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
        case 0: // Countries
          if (!force && dataFetched.countries) {
            setLoading(false);
            return;
          }
          response = await getCountries();
          setCountriesData(response.data || []);
          dataType = "countries";
          break;
        case 1: // Zones
          if (!force && dataFetched.zones) {
            setLoading(false);
            return;
          }
          response = await getZones();
          setZonesData(response.data || []);
          dataType = "zones";
          break;
        case 2: // Cities
          if (!force && dataFetched.cities) {
            setLoading(false);
            return;
          }
          response = await getCities();
          setCitiesData(response.data || []);
          dataType = "cities";
          break;
        case 3: // Districts
          if (!force && dataFetched.districts) {
            setLoading(false);
            return;
          }
          response = await getDistricts();
          setDistrictsData(response.data || []);
          dataType = "districts";
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
    country: {
      setData: setCountriesData,
      deleteFn: deleteCountry,
      editFn: editCountry,
      createFn: createCountry,
    },
    zone: {
      setData: setZonesData,
      deleteFn: deleteZone,
      editFn: editZone,
      createFn: createZone,
    },
    city: {
      setData: setCitiesData,
      deleteFn: deleteCity,
      editFn: editCity,
      createFn: createCity,
    },
    district: {
      setData: setDistrictsData,
      deleteFn: deleteDistrict,
      editFn: editDistrict,
      createFn: createDistrict,
    },
  };

  const handleEdit = (type, row) => {
    setFormData({ id: row.id, name: row.name });
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
    setFormData({});
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
      let response;
      if (isEditMode) {
        response = await handler.editFn(formData.id, formData);
        if (response.status) {
          entityHandlers[type].setData((prev) =>
            prev.map((item) =>
              item.id === formData.id ? { ...item, ...formData } : item
            )
          );
        }
      } else {
        response = await handler.createFn(formData);
        if (response.status) {
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
        case "country":
          response = await exportCountriesToExcel();
          break;
        case "zone":
          response = await exportZonesToExcel();
          break;
        case "city":
          response = await exportCitiesToExcel();
          break;
        case "district":
          response = await exportDistrictsToExcel();
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
        case "country":
          response = await exportCountriesToPdf();
          break;
        case "zone":
          response = await exportZonesToPdf();
          break;
        case "city":
          response = await exportCitiesToPdf();
          break;
        case "district":
          response = await exportDistrictsToPdf();
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
        case "country":
          response = await importCountriesFromExcel(file);
          break;
        case "zone":
          response = await importZonesFromExcel(file);
          break;
        case "city":
          response = await importCitiesFromExcel(file);
          break;
        case "district":
          response = await importDistrictsFromExcel(file);
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
      console.log("Printing data:", { type, data, columns });
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

  return (
    <div className="p-4">
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <CustomTabs
            value={value}
            onChange={handleChange}
            aria-label="address code tabs"
          >
            <Tab label={t("tabs.countries")} />
            <Tab label={t("tabs.zones")} />
            <Tab label={t("tabs.cities")} />
            <Tab label={t("tabs.districts")} />
          </CustomTabs>
        </Box>

        {/* Countries Management Tab*/}
        <TabPanel value={value} index={0}>
          <Box className="p-0">
            <Table
              columns={countryColumns}
              data={countriesData}
              t={t}
              onEdit={(row) => handleEdit("country", row)}
              onDelete={(row) => handleDelete("country", row)}
              onAdd={() => handleAddNew("country")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("country")}
              onExportPdf={() => handleExportPdf("country")}
              onPrint={() =>
                handlePrint("country", countriesData, countryColumns)
              }
              onRefresh={() => fetchData(0, true)}
              onImportExcel={(file) => handleImportExcel("country", file)}
              tableId="countries"
            />
          </Box>
        </TabPanel>

        {/* Zones Management Tab*/}
        <TabPanel value={value} index={1}>
          <Box className="p-0">
            <Table
              data={zonesData}
              columns={zoneColumns}
              t={t}
              onEdit={(row) => handleEdit("zone", row)}
              onDelete={(row) => handleDelete("zone", row)}
              onAdd={() => handleAddNew("zone")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("zone")}
              onExportPdf={() => handleExportPdf("zone")}
              onPrint={() => handlePrint("zone", zonesData, zoneColumns)}
              onRefresh={() => fetchData(1, true)}
              onImportExcel={(file) => handleImportExcel("zone", file)}
              tableId="zones"
            />
          </Box>
        </TabPanel>

        {/* Cities Management Tab*/}
        <TabPanel value={value} index={2}>
          <Box className="p-0">
            <Table
              data={citiesData}
              columns={cityColumns}
              t={t}
              onEdit={(row) => handleEdit("city", row)}
              onDelete={(row) => handleDelete("city", row)}
              onAdd={() => handleAddNew("city")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("city")}
              onExportPdf={() => handleExportPdf("city")}
              onPrint={() => handlePrint("city", citiesData, cityColumns)}
              onRefresh={() => fetchData(2, true)}
              onImportExcel={(file) => handleImportExcel("city", file)}
              tableId="cities"
            />
          </Box>
        </TabPanel>

        {/* Districts Management Tab*/}
        <TabPanel value={value} index={3}>
          <Box className="p-0">
            <Table
              data={districtsData}
              columns={districtColumns}
              t={t}
              onEdit={(row) => handleEdit("district", row)}
              onDelete={(row) => handleDelete("district", row)}
              onAdd={() => handleAddNew("district")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("district")}
              onExportPdf={() => handleExportPdf("district")}
              onPrint={() =>
                handlePrint("district", districtsData, districtColumns)
              }
              onRefresh={() => fetchData(3, true)}
              onImportExcel={(file) => handleImportExcel("district", file)}
              tableId="districts"
            />
          </Box>
        </TabPanel>

        {/* Address Code Drawer */}
        <AddressCodeDrawer
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
