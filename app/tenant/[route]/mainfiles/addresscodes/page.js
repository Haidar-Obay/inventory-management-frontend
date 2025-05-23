"use client"

import { useState, useEffect } from "react"
import { Tabs, Tab, Box, Typography } from '@mui/material'
import Table from "@/components/ui/table.jsx"
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
} from "@/API/geographyApi"
import { countryColumns, cityColumns, provinceColumns, districtColumns } from "@/constants/tableColumns"
import { toast } from "@/components/ui/simple-toast"

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
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function AddressCodesPage() {
  const [value, setValue] = useState(0);
  const [countriesData, setCountriesData] = useState([]);
  const [provincesData, setProvincesData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [districtsData, setDistrictsData] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchData = async () => {
    try {
      // Fetch all data
      const [countriesResponse, provincesResponse, citiesResponse, districtsResponse] = await Promise.all([
        getCountries(),
        getProvinces(),
        getCities(),
        getDistricts()
      ]);
 
      // Set data directly without transformation
      setCountriesData(countriesResponse.data || []);
      setProvincesData(provincesResponse.data || []);
      setCitiesData(citiesResponse.data || []);
      setDistrictsData(districtsResponse.data || []);

      toast.success({
        title: "Success",
        description: "All data fetched successfully"
      });

    } catch (error) {
      toast.error({
        title: "Error",
        description: error.message || "Failed to fetch data"
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle edit functions
  const handleEditCountry = async (row) => {
    try {
      if (!row.id) {
        throw new Error('Invalid data: Missing ID');
      }

      const response = await editCountry(row.id, {
        name: row.name
      });

      if (response.status) {
        toast.success({
          title: "Success",
          description: response.message || "Country updated successfully"
        });
        fetchData();
      }
    } catch (error) {
      toast.error({
        title: "Error",
        description: error.message || "Failed to update country"
      });
    }
  };

  const handleEditCity = async (row) => {
    try {
      if (!row.id) {
        throw new Error('Invalid data: Missing ID');
      }

      const response = await editCity(row.id, {
        name: row.name
      });

      if (response.status) {
        toast.success({
          title: "Success",
          description: response.message || "City updated successfully"
        });
        fetchData();
      }
    } catch (error) {
      toast.error({
        title: "Error",
        description: error.message || "Failed to update city"
      });
    }
  };

  const handleEditProvince = async (row) => {
    try {
      if (!row.id) {
        throw new Error('Invalid data: Missing ID');
      }

      const response = await editProvince(row.id, {
        name: row.name
      });

      if (response.status) {
        toast.success({
          title: "Success",
          description: response.message || "Province updated successfully"
        });
        fetchData();
      }
    } catch (error) {
      toast.error({
        title: "Error",
        description: error.message || "Failed to update province"
      });
    }
  };

  const handleEditDistrict = async (row) => {
    try {
      if (!row.id) {
        throw new Error('Invalid data: Missing ID');
      }

      const response = await editDistrict(row.id, {
        name: row.name
      });

      if (response.status) {
        toast.success({
          title: "Success",
          description: response.message || "District updated successfully"
        });
        fetchData();
      }
    } catch (error) {
      toast.error({
        title: "Error",
        description: error.message || "Failed to update district"
      });
    }
  };

  // Handle delete functions
  const handleDeleteCountry = async (row) => {
    try {
      const response = await deleteCountry(row.id);
      if (response.status) {
        setCountriesData(prevData => prevData.filter(item => item.id !== row.id));
        toast.success({
          title: "Success",
          description: response.message || "Country deleted successfully"
        });
      }
    } catch (error) {
      toast.error({
        title: "Error",
        description: error.message || "Failed to delete country"
      });
    }
  };

  const handleDeleteCity = async (row) => {
    try {
      const response = await deleteCity(row.id);
      if (response.status) {
        setCitiesData(prevData => prevData.filter(item => item.id !== row.id));
        toast.success({
          title: "Success",
          description: response.message || "City deleted successfully"
        });
      }
    } catch (error) {
      toast.error({
        title: "Error",
        description: error.message || "Failed to delete city"
      });
    }
  };

  const handleDeleteProvince = async (row) => {
    try {
      const response = await deleteProvince(row.id);
      if (response.status) {
        setProvincesData(prevData => prevData.filter(item => item.id !== row.id));
        toast.success({
          title: "Success",
          description: response.message || "Province deleted successfully"
        });
      }
    } catch (error) {
      toast.error({
        title: "Error",
        description: error.message || "Failed to delete province"
      });
    }
  };

  const handleDeleteDistrict = async (row) => {
    try {
      const response = await deleteDistrict(row.id);
      if (response.status) {
        setDistrictsData(prevData => prevData.filter(item => item.id !== row.id));
        toast.success({
          title: "Success",
          description: response.message || "District deleted successfully"
        });
      }
    } catch (error) {
      toast.error({
        title: "Error",
        description: error.message || "Failed to delete district"
      });
    }
  };

  return (
    <div className="p-4">
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="address code tabs">
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
            />
          </Box>
        </TabPanel>

      </Box>
    </div>
  );
}
