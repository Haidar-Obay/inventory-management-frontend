"use client";

import { useState, useEffect, Suspense } from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  CircularProgress,
  Button,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";
import Table from "@/components/ui/table/Table";
import SectionDrawer from "@/components/ui/drawers/SectionDrawer";
import CustomTabs from "@/components/ui/CustomTabs";
import { toast } from "@/components/ui/simple-toast";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  getProjects,
  getCostCenters,
  getDepartments,
  getTrades,
  getCompanyCodes,
  getJobs,
  deleteProject,
  deleteCostCenter,
  deleteDepartment,
  deleteTrade,
  deleteCompanyCode,
  deleteJob,
  editProject,
  editCostCenter,
  editDepartment,
  editTrade,
  editCompanyCode,
  editJob,
  createProject,
  createCostCenter,
  createDepartment,
  createTrade,
  createCompanyCode,
  createJob,
  exportProjectsToExcel,
  exportProjectsToPdf,
  importProjectsFromExcel,
  exportCostCentersToExcel,
  exportCostCentersToPdf,
  importCostCentersFromExcel,
  exportJobsToExcel,
  exportJobsToPdf,
  importJobsFromExcel,
  exportTradesToExcel,
  exportTradesToPdf,
  importTradesFromExcel,
  exportCompanyCodesToExcel,
  exportCompanyCodesToPdf,
  importCompanyCodesFromExcel,
  exportDepartmentsToExcel,
  exportDepartmentsToPdf,
  importDepartmentsFromExcel,
} from "@/API/Sections";
import { useTableColumns } from "@/constants/tableColumns";
import { useCustomActions } from "@/components/ui/table/useCustomActions";
import { ActiveStatusAction } from "@/components/ui/table/ActiveStatusAction";
import { getPluralFileName } from "@/lib/utils";

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
  const t = useTranslations("sections");
  return (
    <div className="flex justify-center items-center min-h-screen">
      <CircularProgress />
      <span className="ml-2">{t("loading")}</span>
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
  const t = useTranslations("sections");
  const commonT = useTranslations("common");
  const tableT = useTranslations("tableColumns");
  const toastT = useTranslations("toast");
  const {
    projectColumns,
    costCenterColumns,
    departmentColumns,
    tradesColumns,
    companyCodesColumns,
    jobsColumns,
  } = useTableColumns(tableT);
  const locale = useLocale();
  const isRTL = locale === "ar";
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
  const [editData, setEditData] = useState(undefined);
  const [dataFetched, setDataFetched] = useState({
    projects: false,
    costCenters: false,
    departments: false,
    trades: false,
    companyCodes: false,
    jobs: false,
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
          dataType = "projects";
          break;
        case 1: // Cost Centers
          if (!force && dataFetched.costCenters) {
            setLoading(false);
            return;
          }
          response = await getCostCenters();
          setCostCentersData(response.data || []);
          dataType = "costCenters";
          break;
        case 2: // Departments
          if (!force && dataFetched.departments) {
            setLoading(false);
            return;
          }
          response = await getDepartments();
          setDepartmentsData(response.data || []);
          dataType = "departments";
          break;
        case 3: // Trades
          if (!force && dataFetched.trades) {
            setLoading(false);
            return;
          }
          response = await getTrades();
          setTradesData(response.data || []);
          dataType = "trades";
          break;
        case 4: // Company Codes
          if (!force && dataFetched.companyCodes) {
            setLoading(false);
            return;
          }
          response = await getCompanyCodes();
          setCompanyCodesData(response.data || []);
          dataType = "companyCodes";
          break;
        case 5: // Jobs
          if (!force && dataFetched.jobs) {
            setLoading(false);
            return;
          }
          response = await getJobs();
          setJobsData(response.data || []);
          dataType = "jobs";
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
    project: {
      setData: setProjectsData,
      deleteFn: deleteProject,
      editFn: editProject,
      createFn: createProject,
    },
    costCenter: {
      setData: setCostCentersData,
      deleteFn: deleteCostCenter,
      editFn: editCostCenter,
      createFn: createCostCenter,
    },
    department: {
      setData: setDepartmentsData,
      deleteFn: deleteDepartment,
      editFn: editDepartment,
      createFn: createDepartment,
    },
    trade: {
      setData: setTradesData,
      deleteFn: deleteTrade,
      editFn: editTrade,
      createFn: createTrade,
    },
    companyCode: {
      setData: setCompanyCodesData,
      deleteFn: deleteCompanyCode,
      editFn: editCompanyCode,
      createFn: createCompanyCode,
    },
    job: {
      setData: setJobsData,
      deleteFn: deleteJob,
      editFn: editJob,
      createFn: createJob,
    },
  };

  const handleEdit = (type, row) => {
    setEditData(row);
    setActiveDrawerType(type);
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

  const handleToggleActive = async (type, row) => {
    try {
      const updatedData = { ...row, active: !row.active };
      const response = await entityHandlers[type].editFn(row.id, updatedData);
      if (response.status) {
        entityHandlers[type].setData((prev) =>
          prev.map((item) =>
            item.id === row.id ? { ...item, active: !item.active } : item
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
    setActiveDrawerType(type);
    setEditData(null);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setActiveDrawerType("");
    setEditData(null);
  };

  // Simple handlers for the independent drawer
  const handleSave = (newData) => {
    // Update local state directly
    if (newData) {
      const setDataFunction = entityHandlers[activeDrawerType]?.setData;
      if (setDataFunction) {
        setDataFunction(prev => {
          // If editing, replace the item; if creating, add new item
          if (editData) {
            return prev.map(item => item.id === newData.id ? newData : item);
          } else {
            return [...prev, newData];
          }
        });
      }
    }
    // Don't close the drawer - let user continue editing
    // handleCloseDrawer(); // Removed this line
  };

  const handleSaveAndNew = async (newData) => {
    // Update local state directly without closing drawer
    if (newData) {
      const setDataFunction = entityHandlers[activeDrawerType]?.setData;
      if (setDataFunction) {
        setDataFunction(prev => {
          // If editing, replace the item; if creating, add new item
          if (editData) {
            return prev.map(item => item.id === newData.id ? newData : item);
          } else {
            return [...prev, newData];
          }
        });
      }
    }
    // Reset editData to null for new entry (drawer will clear fields)
    setEditData(null);
    // Don't close the drawer - let the drawer handle clearing fields
  };

  const handleSaveAndClose = async (newData) => {
    await handleSave(newData);
  };

  const handleExportExcel = async (type) => {
    try {
      // Check if the table is empty before exporting
      let dataArray;
      switch (type) {
        case "project":
          dataArray = projectsData;
          break;
        case "costCenter":
          dataArray = costCentersData;
          break;
        case "job":
          dataArray = jobsData;
          break;
        case "trade":
          dataArray = tradesData;
          break;
        case "companyCode":
          dataArray = companyCodesData;
          break;
        case "department":
          dataArray = departmentsData;
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
        case "project":
          response = await exportProjectsToExcel();
          break;
        case "costCenter":
          response = await exportCostCentersToExcel();
          break;
        case "job":
          response = await exportJobsToExcel();
          break;
        case "trade":
          response = await exportTradesToExcel();
          break;
        case "companyCode":
          response = await exportCompanyCodesToExcel();
          break;
        case "department":
          response = await exportDepartmentsToExcel();
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
        case "project":
          dataArray = projectsData;
          break;
        case "costCenter":
          dataArray = costCentersData;
          break;
        case "job":
          dataArray = jobsData;
          break;
        case "trade":
          dataArray = tradesData;
          break;
        case "companyCode":
          dataArray = companyCodesData;
          break;
        case "department":
          dataArray = departmentsData;
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
        case "project":
          response = await exportProjectsToPdf();
          break;
        case "costCenter":
          response = await exportCostCentersToPdf();
          break;
        case "job":
          response = await exportJobsToPdf();
          break;
        case "trade":
          response = await exportTradesToPdf();
          break;
        case "companyCode":
          response = await exportCompanyCodesToPdf();
          break;
        case "department":
          response = await exportDepartmentsToPdf();
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
        case "project":
          response = await importProjectsFromExcel(file);
          break;
        case "costCenter":
          response = await importCostCentersFromExcel(file);
          break;
        case "job":
          response = await importJobsFromExcel(file);
          break;
        case "trade":
          response = await importTradesFromExcel(file);
          break;
        case "companyCode":
          response = await importCompanyCodesFromExcel(file);
          break;
        case "department":
          response = await importDepartmentsFromExcel(file);
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
        `management.${type}`
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
  const projectActions = useCustomActions({
    onEdit: (row) => handleEdit("project", row),
    onDelete: (row) => handleDelete("project", row),
    onPreview: (row) => {
      // Preview functionality can be added here
    },
  });

  const costCenterActions = useCustomActions({
    onEdit: (row) => handleEdit("costCenter", row),
    onDelete: (row) => handleDelete("costCenter", row),
    onPreview: (row) => {
      // Preview functionality can be added here
    },
    additionalActions: (row) => [
      ActiveStatusAction({
        row,
        editFunction: entityHandlers.costCenter.editFn,
        onSuccess: (row, updatedData) => {
          entityHandlers.costCenter.setData((prev) =>
            prev.map((item) =>
              item.id === row.id ? { ...item, active: updatedData.active } : item
            )
          );
          toast.success({
            title: toastT("success"),
            description: toastT("costCenter.updateSuccess"),
          });
        },
        onError: (row, errorMessage) => {
          toast.error({
            title: toastT("error"),
            description: errorMessage || toastT("costCenter.updateError"),
          });
        },
      }),
    ],
  });

  const departmentActions = useCustomActions({
    onEdit: (row) => handleEdit("department", row),
    onDelete: (row) => handleDelete("department", row),
    onPreview: (row) => {
      // Preview functionality can be added here
    },
    additionalActions: (row) => [
      ActiveStatusAction({
        row,
        editFunction: entityHandlers.department.editFn,
        onSuccess: (row, updatedData) => {
          entityHandlers.department.setData((prev) =>
            prev.map((item) =>
              item.id === row.id ? { ...item, active: updatedData.active } : item
            )
          );
          toast.success({
            title: toastT("success"),
            description: toastT("department.updateSuccess"),
          });
        },
        onError: (row, errorMessage) => {
          toast.error({
            title: toastT("error"),
            description: errorMessage || toastT("department.updateError"),
          });
        },
      }),
    ],
  });

  const tradesActions = useCustomActions({
    onEdit: (row) => handleEdit("trade", row),
    onDelete: (row) => handleDelete("trade", row),
    onPreview: (row) => {
      // Preview functionality can be added here
    },
    additionalActions: (row) => [
      ActiveStatusAction({
        row,
        editFunction: entityHandlers.trade.editFn,
        onSuccess: (row, updatedData) => {
          entityHandlers.trade.setData((prev) =>
            prev.map((item) =>
              item.id === row.id ? { ...item, active: updatedData.active } : item
            )
          );
          toast.success({
            title: toastT("success"),
            description: toastT("trade.updateSuccess"),
          });
        },
        onError: (row, errorMessage) => {
          toast.error({
            title: toastT("error"),
            description: errorMessage || toastT("trade.updateError"),
          });
        },
      }),
    ],
  });

  const companyCodesActions = useCustomActions({
    onEdit: (row) => handleEdit("companyCode", row),
    onDelete: (row) => handleDelete("companyCode", row),
    onPreview: (row) => {
      // Preview functionality can be added here
    },
  });

  const jobsActions = useCustomActions({
    onEdit: (row) => handleEdit("job", row),
    onDelete: (row) => handleDelete("job", row),
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
            aria-label="address code tabs"
            sx={{
              direction: isRTL ? "rtl" : "ltr",
            }}
          >
            <Tab label={t("tabs.projects")} />
            <Tab label={t("tabs.costCenters")} />
            <Tab label={t("tabs.departments")} />
            <Tab label={t("tabs.trades")} />
            <Tab label={t("tabs.companyCodes")} />
            <Tab label={t("tabs.jobs")} />
          </CustomTabs>
        </Box>

        {/* Projects Tab */}
        <TabPanel value={value} index={0}>
          <Box className="p-0">
            <Table
              data={projectsData}
              columns={projectColumns}
              onAdd={() => handleAddNew("project")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("project")}
              onExportPdf={() => handleExportPdf("project")}
              onPrint={() =>
                handlePrint("project", projectsData, projectColumns)
              }
              onRefresh={() => fetchData(0, true)}
              onImportExcel={(file) => handleImportExcel("project", file)}
              tableId="projects"
              customActions={projectActions.customActions}
              onCustomAction={projectActions.onCustomAction}
              onDelete={(row) => handleDelete("project", row)}
            />
          </Box>
        </TabPanel>

        {/* Cost Centers Tab */}
        <TabPanel value={value} index={1}>
          <Box className="p-0">
            <Table
              data={costCentersData}
              columns={costCenterColumns}
              onAdd={() => handleAddNew("costCenter")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("costCenter")}
              onExportPdf={() => handleExportPdf("costCenter")}
              onPrint={() =>
                handlePrint("costCenter", costCentersData, costCenterColumns)
              }
              onRefresh={() => fetchData(1, true)}
              onImportExcel={(file) => handleImportExcel("costCenter", file)}
              tableId="costCenters"
              customActions={costCenterActions.customActions}
              onCustomAction={costCenterActions.onCustomAction}
              onDelete={(row) => handleDelete("costCenter", row)}
            />
          </Box>
        </TabPanel>

        {/* Departments Tab */}
        <TabPanel value={value} index={2}>
          <Box className="p-0">
            <Table
              data={departmentsData}
              columns={departmentColumns}
              onAdd={() => handleAddNew("department")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("department")}
              onExportPdf={() => handleExportPdf("department")}
              onPrint={() =>
                handlePrint("department", departmentsData, departmentColumns)
              }
              onRefresh={() => fetchData(2, true)}
              onImportExcel={(file) => handleImportExcel("department", file)}
              tableId="departments"
              customActions={departmentActions.customActions}
              onCustomAction={departmentActions.onCustomAction}
              onDelete={(row) => handleDelete("department", row)}
            />
          </Box>
        </TabPanel>

        {/* Trades Tab */}
        <TabPanel value={value} index={3}>
          <Box className="p-0">
            <Table
              data={tradesData}
              columns={tradesColumns}
              onAdd={() => handleAddNew("trade")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("trade")}
              onExportPdf={() => handleExportPdf("trade")}
              onPrint={() => handlePrint("trade", tradesData, tradesColumns)}
              onRefresh={() => fetchData(3, true)}
              onImportExcel={(file) => handleImportExcel("trade", file)}
              tableId="trades"
              customActions={tradesActions.customActions}
              onCustomAction={tradesActions.onCustomAction}
              onDelete={(row) => handleDelete("trade", row)}
            />
          </Box>
        </TabPanel>

        {/* Company Codes Tab */}
        <TabPanel value={value} index={4}>
          <Box className="p-0">
            <Table
              data={companyCodesData}
              columns={companyCodesColumns}
              onAdd={() => handleAddNew("companyCode")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("companyCode")}
              onExportPdf={() => handleExportPdf("companyCode")}
              onPrint={() =>
                handlePrint(
                  "companyCode",
                  companyCodesData,
                  companyCodesColumns
                )
              }
              onRefresh={() => fetchData(4, true)}
              onImportExcel={(file) => handleImportExcel("companyCode", file)}
              tableId="companyCodes"
              customActions={companyCodesActions.customActions}
              onCustomAction={companyCodesActions.onCustomAction}
              onDelete={(row) => handleDelete("companyCode", row)}
            />
          </Box>
        </TabPanel>

        {/* Jobs Tab */}
        <TabPanel value={value} index={5}>
          <Box className="p-0">
            <Table
              data={jobsData}
              columns={jobsColumns}
              onAdd={() => handleAddNew("job")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("job")}
              onExportPdf={() => handleExportPdf("job")}
              onPrint={() => handlePrint("job", jobsData, jobsColumns)}
              onRefresh={() => fetchData(5, true)}
              onImportExcel={(file) => handleImportExcel("job", file)}
              tableId="jobs"
              customActions={jobsActions.customActions}
              onCustomAction={jobsActions.onCustomAction}
              onDelete={(row) => handleDelete("job", row)}
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
          editData={editData}
        />
      </Box>
    </div>
  );
}
