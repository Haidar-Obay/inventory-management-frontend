"use client";

import { useState, useEffect } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import Table from "@/components/ui/table/Table";
import AddressCodeDrawer from "@/components/drawers/AddressCodeDrawer";
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
  editDistrict,
  deleteDistrict,
  createCountry,
  createProvince,
  createCity,
  createDistrict,
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

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch all data
      const [
        countriesResponse,
        provincesResponse,
        citiesResponse,
        districtsResponse,
      ] = await Promise.all([
        getCountries(),
        getProvinces(),
        getCities(),
        getDistricts(),
      ]);

      // Set data directly without transformation
      setCountriesData(countriesResponse.data || []);
      setProvincesData(provincesResponse.data || []);
      setCitiesData(citiesResponse.data || []);
      setDistrictsData(districtsResponse.data || []);

      toast.success({
        title: "Success",
        description: "All data fetched successfully",
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

  useEffect(() => {
    fetchData();
  }, []);

  // Handle edit functions
  const handleEditCountry = (row) => {
    setFormData({
      id: row.id,
      name: row.name,
    });
    setActiveDrawerType("country");
    setIsEditMode(true);
    setIsDrawerOpen(true);
  };

  const handleEditCity = (row) => {
    setFormData({
      id: row.id,
      name: row.name,
    });
    setActiveDrawerType("city");
    setIsEditMode(true);
    setIsDrawerOpen(true);
  };

  const handleEditProvince = (row) => {
    setFormData({
      id: row.id,
      name: row.name,
    });
    setActiveDrawerType("province");
    setIsEditMode(true);
    setIsDrawerOpen(true);
  };

  const handleEditDistrict = (row) => {
    setFormData({
      id: row.id,
      name: row.name,
    });
    setActiveDrawerType("district");
    setIsEditMode(true);
    setIsDrawerOpen(true);
  };

  // Handle delete functions
  const handleDeleteCountry = async (row) => {
    try {
      const response = await deleteCountry(row.id);
      if (response.status) {
        setCountriesData((prevData) =>
          prevData.filter((item) => item.id !== row.id)
        );
        toast.success({
          title: "Success",
          description: response.message || "Country deleted successfully",
        });
      }
    } catch (error) {
      toast.error({
        title: "Error",
        description: error.message || "Failed to delete country",
      });
    }
  };

  const handleDeleteCity = async (row) => {
    try {
      const response = await deleteCity(row.id);
      if (response.status) {
        setCitiesData((prevData) =>
          prevData.filter((item) => item.id !== row.id)
        );
        toast.success({
          title: "Success",
          description: response.message || "City deleted successfully",
        });
      }
    } catch (error) {
      toast.error({
        title: "Error",
        description: error.message || "Failed to delete city",
      });
    }
  };

  const handleDeleteProvince = async (row) => {
    try {
      const response = await deleteProvince(row.id);
      if (response.status) {
        setProvincesData((prevData) =>
          prevData.filter((item) => item.id !== row.id)
        );
        toast.success({
          title: "Success",
          description: response.message || "Province deleted successfully",
        });
      }
    } catch (error) {
      toast.error({
        title: "Error",
        description: error.message || "Failed to delete province",
      });
    }
  };

  const handleDeleteDistrict = async (row) => {
    try {
      const response = await deleteDistrict(row.id);
      if (response.status) {
        setDistrictsData((prevData) =>
          prevData.filter((item) => item.id !== row.id)
        );
        toast.success({
          title: "Success",
          description: response.message || "District deleted successfully",
        });
      }
    } catch (error) {
      toast.error({
        title: "Error",
        description: error.message || "Failed to delete district",
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
    try {
      if (!formData.name) {
        toast.error({
          title: "Error",
          description: "Name field is required",
        });
        return;
      }

      let response;
      const formattedData = {
        name: formData.name,
      };

      if (isEditMode) {
        switch (activeDrawerType) {
          case "country":
            response = await editCountry(formData.id, formattedData);
            if (response.status) {
              setCountriesData((prevData) =>
                prevData.map((item) =>
                  item.id === formData.id ? { ...item, ...formattedData } : item
                )
              );
            }
            break;
          case "province":
            response = await editProvince(formData.id, formattedData);
            if (response.status) {
              setProvincesData((prevData) =>
                prevData.map((item) =>
                  item.id === formData.id ? { ...item, ...formattedData } : item
                )
              );
            }
            break;
          case "city":
            response = await editCity(formData.id, formattedData);
            if (response.status) {
              setCitiesData((prevData) =>
                prevData.map((item) =>
                  item.id === formData.id ? { ...item, ...formattedData } : item
                )
              );
            }
            break;
          case "district":
            response = await editDistrict(formData.id, formattedData);
            if (response.status) {
              setDistrictsData((prevData) =>
                prevData.map((item) =>
                  item.id === formData.id ? { ...item, ...formattedData } : item
                )
              );
            }
            break;
          default:
            throw new Error("Invalid type");
        }
      } else {
        switch (activeDrawerType) {
          case "country":
            response = await createCountry(formattedData);
            if (response.status) {
              setCountriesData((prevData) => [...prevData, response.data]);
            }
            break;
          case "province":
            response = await createProvince(formattedData);
            if (response.status) {
              setProvincesData((prevData) => [...prevData, response.data]);
            }
            break;
          case "city":
            response = await createCity(formattedData);
            if (response.status) {
              setCitiesData((prevData) => [...prevData, response.data]);
            }
            break;
          case "district":
            response = await createDistrict(formattedData);
            if (response.status) {
              setDistrictsData((prevData) => [...prevData, response.data]);
            }
            break;
          default:
            throw new Error("Invalid type");
        }
      }

      if (response.status) {
        toast.success({
          title: "Success",
          description:
            response.message ||
            `${isEditMode ? "Updated" : "Created"} successfully`,
        });
      }
    } catch (error) {
      toast.error({
        title: "Error",
        description:
          error.message ||
          `Failed to ${isEditMode ? "update" : "create"} ${activeDrawerType}`,
      });
    }
  };

  const handleSaveAndNew = async () => {
    await handleSave();
    if (isEditMode) {
      setIsEditMode(false);
      setFormData({});
    }
  };

  const handleSaveAndClose = async () => {
    await handleSave();
    handleCloseDrawer();
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
              onEdit={handleEditCountry}
              onDelete={handleDeleteCountry}
              onAdd={() => handleAddNew("country")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => {}}
              onExportPdf={() => {}}
              onPrint={() => {}}
              onRefresh={fetchData}
              onImportExcel={() => {}}
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
              onEdit={handleEditProvince}
              onDelete={handleDeleteProvince}
              onAdd={() => handleAddNew("province")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => {}}
              onExportPdf={() => {}}
              onPrint={() => {}}
              onRefresh={fetchData}
              onImportExcel={() => {}}
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
              onEdit={handleEditCity}
              onDelete={handleDeleteCity}
              onAdd={() => handleAddNew("city")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => {}}
              onExportPdf={() => {}}
              onPrint={() => {}}
              onRefresh={fetchData}
              onImportExcel={() => {}}
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
              onEdit={handleEditDistrict}
              onDelete={handleDeleteDistrict}
              onAdd={() => handleAddNew("district")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => {}}
              onExportPdf={() => {}}
              onPrint={() => {}}
              onRefresh={fetchData}
              onImportExcel={() => {}}
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
