"use client";

import { useState, useEffect, Suspense } from "react";
import { Tabs, Tab, Box, Typography, CircularProgress } from "@mui/material";
import Table from "@/components/ui/table/Table";
import SectionDrawer from "@/components/ui/drawers/SectionDrawer";
import { toast } from "@/components/ui/simple-toast";
import { useSearchParams, useRouter } from "next/navigation";

// Placeholder for API functions - to be implemented later
const getProjects = async () => ({ data: [] });
const getCostCenters = async () => ({ data: [] });
const getDepartments = async () => ({ data: [] });
const getTrades = async () => ({ data: [] });
const getCompanyCodes = async () => ({ data: [] });
const getJobs = async () => ({ data: [] });

// Placeholder for table columns - to be customized later
const projectColumns = [
  { header: "ID", key: "id" },
  { header: "Name", key: "name" },
  { header: "Description", key: "description" },
  { header: "Actions", key: "actions" }
];

const costCenterColumns = [
  { header: "ID", key: "id" },
  { header: "Name", key: "name" },
  { header: "Description", key: "description" },
  { header: "Actions", key: "actions" }
];

const departmentColumns = [
  { header: "ID", key: "id" },
  { header: "Name", key: "name" },
  { header: "Description", key: "description" },
  { header: "Actions", key: "actions" }
];

const tradesColumns = [
  { header: "ID", key: "id" },
  { header: "Name", key: "name" },
  { header: "Description", key: "description" },
  { header: "Actions", key: "actions" }
];

const companyCodesColumns = [
  { header: "ID", key: "id" },
  { header: "Name", key: "name" },
  { header: "Description", key: "description" },
  { header: "Actions", key: "actions" }
];

const jobsColumns = [
  { header: "ID", key: "id" },
  { header: "Name", key: "name" },
  { header: "Description", key: "description" },
  { header: "Actions", key: "actions" }
];

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
function SectionsPageLoading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <CircularProgress />
      <span className="ml-2">Loading sections...</span>
    </div>
  );
}

// Main component wrapped with Suspense
export default function SectionsPageWrapper() {
  return (
    <Suspense fallback={<SectionsPageLoading />}>
      <SectionsPage />
    </Suspense>
  );
}

// The actual component that uses useSearchParams
function SectionsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [projectsData, setProjectsData] = useState([]);
  const [costCentersData, setCostCentersData] = useState([]);
  const [departmentsData, setDepartmentsData] = useState([]);
  const [tradesData, setTradesData] = useState([]);
  const [companyCodesData, setCompanyCodesData] = useState([]);
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeDrawerType, setActiveDrawerType] = useState("");
  const [formData, setFormData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [dataFetched, setDataFetched] = useState({
    projects: false,
    costCenters: false,
    departments: false,
    trades: false,
    companyCodes: false,
    jobs: false
  });

  // Initialize tab value from URL or localStorage
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab !== null) {
      const tabValue = parseInt(tab);
      setValue(tabValue);
      localStorage.setItem("sectionsLastTab", tabValue.toString());
    } else {
      const savedTab = localStorage.getItem("sectionsLastTab");
      if (savedTab) {
        const tabValue = parseInt(savedTab);
        setValue(tabValue);
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tabValue.toString());
        router.push(`?${params.toString()}`);
      }
    }
  }, [searchParams, router]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    localStorage.setItem("sectionsLastTab", newValue.toString());
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
        case 0: // Projects
          if (!force && dataFetched.projects) {
            setLoading(false);
            return;
          }
          response = await getProjects();
          setProjectsData(response.data || []);
          dataType = 'projects';
          break;
        case 1: // Cost Centers
          if (!force && dataFetched.costCenters) {
            setLoading(false);
            return;
          }
          response = await getCostCenters();
          setCostCentersData(response.data || []);
          dataType = 'costCenters';
          break;
        case 2: // Departments
          if (!force && dataFetched.departments) {
            setLoading(false);
            return;
          }
          response = await getDepartments();
          setDepartmentsData(response.data || []);
          dataType = 'departments';
          break;
        case 3: // Trades
          if (!force && dataFetched.trades) {
            setLoading(false);
            return;
          }
          response = await getTrades();
          setTradesData(response.data || []);
          dataType = 'trades';
          break;
        case 4: // Company Codes
          if (!force && dataFetched.companyCodes) {
            setLoading(false);
            return;
          }
          response = await getCompanyCodes();
          setCompanyCodesData(response.data || []);
          dataType = 'companyCodes';
          break;
        case 5: // Jobs
          if (!force && dataFetched.jobs) {
            setLoading(false);
            return;
          }
          response = await getJobs();
          setJobsData(response.data || []);
          dataType = 'jobs';
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
    project: {
      setData: setProjectsData,
      deleteFn: async () => ({ status: true }),
      editFn: async () => ({ status: true }),
      createFn: async () => ({ status: true, data: {} }),
    },
    costCenter: {
      setData: setCostCentersData,
      deleteFn: async () => ({ status: true }),
      editFn: async () => ({ status: true }),
      createFn: async () => ({ status: true, data: {} }),
    },
    department: {
      setData: setDepartmentsData,
      deleteFn: async () => ({ status: true }),
      editFn: async () => ({ status: true }),
      createFn: async () => ({ status: true, data: {} }),
    },
    trade: {
      setData: setTradesData,
      deleteFn: async () => ({ status: true }),
      editFn: async () => ({ status: true }),
      createFn: async () => ({ status: true, data: {} }),
    },
    companyCode: {
      setData: setCompanyCodesData,
      deleteFn: async () => ({ status: true }),
      editFn: async () => ({ status: true }),
      createFn: async () => ({ status: true, data: {} }),
    },
    job: {
      setData: setJobsData,
      deleteFn: async () => ({ status: true }),
      editFn: async () => ({ status: true }),
      createFn: async () => ({ status: true, data: {} }),
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
        setDataFetched(prev => ({
          ...prev,
          [type]: false
        }));
        toast.success({
          title: "Success",
          description: `${type} deleted successfully`,
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
          handler.setData(prev => 
            prev.map(item => item.id === formData.id ? { ...item, ...formData } : item)
          );
        }
      } else {
        response = await handler.createFn(formData);
        if (response.status) {
          handler.setData(prev => [...prev, response.data]);
        }
      }
  
      if (response.status) {
        toast.success({
          title: "Success",
          description: `${type} ${isEditMode ? "updated" : "created"} successfully`,
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
      // Placeholder for export functionality
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
      // Placeholder for export functionality
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
      // Placeholder for import functionality
      fetchData(value, true);
      toast.success({
        title: "Success",
        description: `${type} imported successfully`,
      });
    } catch (error) {
      toast.error({
        title: "Error",
        description: error.message || `Failed to import ${type}`,
      });
    }
  };

  const handlePrint = (type, data, columns) => {
    try {
      const printWindow = window.open('', '_blank');
      
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

      printWindow.document.write(content);
      printWindow.document.close();

      printWindow.onload = function() {
        printWindow.print();
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
            aria-label="sections tabs"
          >
            <Tab label="Projects" />
            <Tab label="Cost Centers" />
            <Tab label="Departments" />
            <Tab label="Trades" />
            <Tab label="Company Codes" />
            <Tab label="Jobs" />
          </Tabs>
        </Box>

        {/* Projects Tab */}
        <TabPanel value={value} index={0}>
          <Box className="p-0">
            <Typography variant="h5" component="h2" className="mb-4 pb-3">
              Projects Management
            </Typography>
            <Table
              data={projectsData}
              columns={projectColumns}
              onEdit={(row) => handleEdit("project", row)}
              onDelete={(row) => handleDelete("project", row)}
              onAdd={() => handleAddNew("project")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel('project')}
              onExportPdf={() => handleExportPdf('project')}
              onPrint={() => handlePrint('project', projectsData, projectColumns)}
              onRefresh={() => fetchData(0, true)}
              onImportExcel={(file) => handleImportExcel('project', file)}
            />
          </Box>
        </TabPanel>

        {/* Cost Centers Tab */}
        <TabPanel value={value} index={1}>
          <Box className="p-0">
            <Typography variant="h5" component="h2" className="mb-4 pb-3">
              Cost Centers Management
            </Typography>
            <Table
              data={costCentersData}
              columns={costCenterColumns}
              onEdit={(row) => handleEdit("costCenter", row)}
              onDelete={(row) => handleDelete("costCenter", row)}
              onAdd={() => handleAddNew("costCenter")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel('costCenter')}
              onExportPdf={() => handleExportPdf('costCenter')}
              onPrint={() => handlePrint('costCenter', costCentersData, costCenterColumns)}
              onRefresh={() => fetchData(1, true)}
              onImportExcel={(file) => handleImportExcel('costCenter', file)}
            />
          </Box>
        </TabPanel>

        {/* Departments Tab */}
        <TabPanel value={value} index={2}>
          <Box className="p-0">
            <Typography variant="h5" component="h2" className="mb-4 pb-3">
              Departments Management
            </Typography>
            <Table
              data={departmentsData}
              columns={departmentColumns}
              onEdit={(row) => handleEdit("department", row)}
              onDelete={(row) => handleDelete("department", row)}
              onAdd={() => handleAddNew("department")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel('department')}
              onExportPdf={() => handleExportPdf('department')}
              onPrint={() => handlePrint('department', departmentsData, departmentColumns)}
              onRefresh={() => fetchData(2, true)}
              onImportExcel={(file) => handleImportExcel('department', file)}
            />
          </Box>
        </TabPanel>

        {/* Trades Tab */}
        <TabPanel value={value} index={3}>
          <Box className="p-0">
            <Typography variant="h5" component="h2" className="mb-4 pb-3">
              Trades Management
            </Typography>
            <Table
              data={tradesData}
              columns={tradesColumns}
              onEdit={(row) => handleEdit("trade", row)}
              onDelete={(row) => handleDelete("trade", row)}
              onAdd={() => handleAddNew("trade")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel('trade')}
              onExportPdf={() => handleExportPdf('trade')}
              onPrint={() => handlePrint('trade', tradesData, tradesColumns)}
              onRefresh={() => fetchData(3, true)}
              onImportExcel={(file) => handleImportExcel('trade', file)}
            />
          </Box>
        </TabPanel>

        {/* Company Codes Tab */}
        <TabPanel value={value} index={4}>
          <Box className="p-0">
            <Typography variant="h5" component="h2" className="mb-4 pb-3">
              Company Codes Management
            </Typography>
            <Table
              data={companyCodesData}
              columns={companyCodesColumns}
              onEdit={(row) => handleEdit("companyCode", row)}
              onDelete={(row) => handleDelete("companyCode", row)}
              onAdd={() => handleAddNew("companyCode")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel('companyCode')}
              onExportPdf={() => handleExportPdf('companyCode')}
              onPrint={() => handlePrint('companyCode', companyCodesData, companyCodesColumns)}
              onRefresh={() => fetchData(4, true)}
              onImportExcel={(file) => handleImportExcel('companyCode', file)}
            />
          </Box>
        </TabPanel>

        {/* Jobs Tab */}
        <TabPanel value={value} index={5}>
          <Box className="p-0">
            <Typography variant="h5" component="h2" className="mb-4 pb-3">
              Jobs Management
            </Typography>
            <Table
              data={jobsData}
              columns={jobsColumns}
              onEdit={(row) => handleEdit("job", row)}
              onDelete={(row) => handleDelete("job", row)}
              onAdd={() => handleAddNew("job")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel('job')}
              onExportPdf={() => handleExportPdf('job')}
              onPrint={() => handlePrint('job', jobsData, jobsColumns)}
              onRefresh={() => fetchData(5, true)}
              onImportExcel={(file) => handleImportExcel('job', file)}
            />
          </Box>
        </TabPanel>

        {/* Section Drawer */}
        <SectionDrawer
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
