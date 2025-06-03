"use client";

import { useState, useEffect } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import Table from "@/components/ui/table/Table";
import AddressCodeDrawer from "@/components/ui/drawers/AddressCodeDrawer";
import {
  getCountries,
  getProvinces,
  getCities,
  getDistricts,
  deleteCountry,
  deleteCity,
  deleteProvince,
  editCountry,
  editProvince,
  editCity,
  editDistrict,
  deleteDistrict,
  createCountry,
  createProvince,
  createCity,
  createDistrict,
  exportCitiesToExcel,
  exportCitiesToPdf,
  importCitiesFromExcel,
  exportCountriesToExcel,
  exportCountriesToPdf,
  importCountriesFromExcel,
  exportProvincesToExcel,
  exportProvincesToPdf,
  importProvincesFromExcel,
  exportDistrictsToExcel,
  exportDistrictsToPdf,
  importDistrictsFromExcel,
} from "@/API/geographyApi";
import {
  countryColumns,
  cityColumns,
  provinceColumns,
  districtColumns,
} from "@/constants/tableColumns";
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

export default function AddressCodesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [countriesData, setCountriesData] = useState([]);
  const [provincesData, setProvincesData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [districtsData, setDistrictsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeDrawerType, setActiveDrawerType] = useState("");
  const [formData, setFormData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [dataFetched, setDataFetched] = useState({
    countries: false,
    provinces: false,
    cities: false,
    districts: false
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
          dataType = 'countries';
          break;
        case 1: // Provinces
          if (!force && dataFetched.provinces) {
            setLoading(false);
            return;
          }
          response = await getProvinces();
          setProvincesData(response.data || []);
          dataType = 'provinces';
          break;
        case 2: // Cities
          if (!force && dataFetched.cities) {
            setLoading(false);
            return;
          }
          response = await getCities();
          setCitiesData(response.data || []);
          dataType = 'cities';
          break;
        case 3: // Districts
          if (!force && dataFetched.districts) {
            setLoading(false);
            return;
          }
          response = await getDistricts();
          setDistrictsData(response.data || []);
          dataType = 'districts';
          break;
      }

      if (dataType) {
        setDataFetched(prev => ({
          ...prev,
          [dataType]: true
        }));
      }

      toast.success({
        title: "Success",
        description: "Data fetched successfully",
      });
    } catch (error) {
      toast.error({
        title: "Error",
        description: error.message || "Failed to fetch data",
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
    province: {
      setData: setProvincesData,
      deleteFn: deleteProvince,
      editFn: editProvince,
      createFn: createProvince,
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
        entityHandlers[type].setData(prev => prev.filter(item => item.id !== row.id));
        // Reset the fetched state for the modified data type
        setDataFetched(prev => ({
          ...prev,
          [type]: false
        }));
        toast.success({
          title: "Success",
          description: response.message || `${type} deleted successfully`,
        });
      }
    } catch (error) {
      toast.error({
        title: "Error",
        description: error.message || `Failed to delete ${type}`,
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
          // Update existing item in the state
          entityHandlers[type].setData(prev => 
            prev.map(item => item.id === formData.id ? { ...item, ...formData } : item)
          );
        }
      } else {
        response = await handler.createFn(formData);
        if (response.status) {
          // Add new item to the state
          entityHandlers[type].setData(prev => [...prev, response.data]);
        }
      }
  
      if (response.status) {
        toast.success({
          title: "Success",
          description: response.message || `${type} ${isEditMode ? "updated" : "created"} successfully`,
        });
  
        setIsEditMode(false);
      }
    } catch (error) {
      toast.error({
        title: "Error",
        description: error.message || `Failed to ${isEditMode ? "update" : "create"} ${type}`,
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
        case 'country':
          response = await exportCountriesToExcel();
          break;
        case 'province':
          response = await exportProvincesToExcel();
          break;
        case 'city':
          response = await exportCitiesToExcel();
          break;
        case 'district':
          response = await exportDistrictsToExcel();
          break;
        default:
          return;
      }
      
      // Create a download link for the Excel file
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}s.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success({
        title: "Success",
        description: `${type} exported successfully`,
      });
    } catch (error) {
      toast.error({
        title: "Error",
        description: error.message || `Failed to export ${type}`,
      });
    }
  };

  const handleExportPdf = async (type) => {
    try {
      let response;
      switch (type) {
        case 'country':
          response = await exportCountriesToPdf();
          break;
        case 'province':
          response = await exportProvincesToPdf();
          break;
        case 'city':
          response = await exportCitiesToPdf();
          break;
        case 'district':
          response = await exportDistrictsToPdf();
          break;
        default:
          return;
      }
      
      // Create a download link for the PDF file
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}s.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success({
        title: "Success",
        description: `${type} exported successfully`,
      });
    } catch (error) {
      toast.error({
        title: "Error",
        description: error.message || `Failed to export ${type}`,
      });
    }
  };

  const handleImportExcel = async (type, file) => {
    try {
      let response;
      switch (type) {
        case 'country':
          response = await importCountriesFromExcel(file);
          break;
        case 'province':
          response = await importProvincesFromExcel(file);
          break;
        case 'city':
          response = await importCitiesFromExcel(file);
          break;
        case 'district':
          response = await importDistrictsFromExcel(file);
          break;
        default:
          return;
      }
      
      if (response.status) {
        // Refresh the data after successful import
        fetchData(value, true);
        toast.success({
          title: "Success",
          description: `${type} imported successfully`,
        });
      }
    } catch (error) {
      toast.error({
        title: "Error",
        description: error.message || `Failed to import ${type}`,
      });
    }
  };

  const handlePrint = (type, data, columns) => {
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      
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
                  ${columns.map(col => `<th>${col.header}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${data.map(row => `
                  <tr>
                    ${columns.map(col => `<td>${row[col.key] || ''}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

      // Write the content to the new window
      printWindow.document.write(content);
      printWindow.document.close();

      // Wait for content to load then print
      printWindow.onload = function() {
        printWindow.print();
        // Close the window after printing
        printWindow.onafterprint = function() {
          printWindow.close();
        };
      };

      toast.success({
        title: "Success",
        description: `${type} list prepared for printing`,
      });
    } catch (error) {
      toast.error({
        title: "Error",
        description: error.message || `Failed to print ${type} list`,
      });
    }
  };

  return (
    <div className="p-4">
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="address code tabs"
          >
            <Tab label="Countries" />
            <Tab label="Provinces" />
            <Tab label="Cities" />
            <Tab label="Districts" />
          </Tabs>
        </Box>

        {/* Countries Management Tab*/}
        <TabPanel value={value} index={0}>
          <Box className="p-0">
            <Typography variant="h5" component="h2" className="mb-4 pb-3">
              Countries Management
            </Typography>
            <Table
              data={countriesData}
              columns={countryColumns}
              onEdit={(row) => handleEdit("country", row)}
              onDelete={(row) => handleDelete("country", row)}
              onAdd={() => handleAddNew("country")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel('country')}
              onExportPdf={() => handleExportPdf('country')}
              onPrint={() => handlePrint('country', countriesData, countryColumns)}
              onRefresh={() => fetchData(0, true)}
              onImportExcel={(file) => handleImportExcel('country', file)}
            />
          </Box>
        </TabPanel>

        {/* Provinces Management Tab*/}
        <TabPanel value={value} index={1}>
          <Box className="p-0">
            <Typography variant="h5" component="h2" className="mb-4 pb-3">
              Provinces Management
            </Typography>
            <Table
              data={provincesData}
              columns={provinceColumns}
              onEdit={(row) => handleEdit("province", row)}
              onDelete={(row) => handleDelete("province", row)}
              onAdd={() => handleAddNew("province")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel('province')}
              onExportPdf={() => handleExportPdf('province')}
              onPrint={() => handlePrint('province', provincesData, provinceColumns)}
              onRefresh={() => fetchData(1, true)}
              onImportExcel={(file) => handleImportExcel('province', file)}
            />
          </Box>
        </TabPanel>

        {/* Cities Management Tab*/}
        <TabPanel value={value} index={2}>
          <Box className="p-0">
            <Typography variant="h5" component="h2" className="mb-4 pb-3">
              Cities Management
            </Typography>
            <Table
              data={citiesData}
              columns={cityColumns}
              onEdit={(row) => handleEdit("city", row)}
              onDelete={(row) => handleDelete("city", row)}
              onAdd={() => handleAddNew("city")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel('city')}
              onExportPdf={() => handleExportPdf('city')}
              onPrint={() => handlePrint('city', citiesData, cityColumns)}
              onRefresh={() => fetchData(2, true)}
              onImportExcel={(file) => handleImportExcel('city', file)}
            />
          </Box>
        </TabPanel>

        {/* Districts Management Tab*/}
        <TabPanel value={value} index={3}>
          <Box className="p-0">
            <Typography variant="h5" component="h2" className="mb-4 pb-3">
              Districts Management
            </Typography>
            <Table
              data={districtsData}
              columns={districtColumns}
              onEdit={(row) => handleEdit("district", row)}
              onDelete={(row) => handleDelete("district", row)}
              onAdd={() => handleAddNew("district")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel('district')}
              onExportPdf={() => handleExportPdf('district')}
              onPrint={() => handlePrint('district', districtsData, districtColumns)}
              onRefresh={() => fetchData(3, true)}
              onImportExcel={(file) => handleImportExcel('district', file)}
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