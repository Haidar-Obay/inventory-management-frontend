import tenantApiService from './TenantApiService';

// Project API functions
export const getProjects = async () => {
  try {
    const response = await tenantApiService('GET', 'projects');
    return response;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const getProjectById = async (id) => {
  try {
    const response = await tenantApiService('GET', `projects/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

export const createProject = async (data) => {
  try {
    const response = await tenantApiService('POST', 'projects', data);
    return response;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const editProject = async (id, data) => {
  try {
    const response = await tenantApiService('PUT', `projects/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error editing project:', error);
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    const response = await tenantApiService('DELETE', `projects/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

export const exportProjectsToExcel = async () => {
  try {
    const response = await tenantApiService('GET', 'exportExcell/projects');
    return response;
  } catch (error) {
    console.error('Error exporting projects to Excel:', error);
    throw error;
  }
};

export const exportProjectsToPdf = async () => {
  try {
    const response = await tenantApiService('GET', 'exportPdf/projects');
    return response;
  } catch (error) {
    console.error('Error exporting projects to PDF:', error);
    throw error;
  }
};

export const importProjectsFromExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await tenantApiService('POST', 'importFromExcel/projects', formData);
    return response;
  } catch (error) {
    console.error('Error importing projects from Excel:', error);
    throw error;
  }
};

// Function to get only project names for dropdowns
export const getProjectNames = async () => {
  try {
    const response = await tenantApiService('GET', 'names/projects');
    return response;
  } catch (error) {
    console.error('Error fetching project names:', error);
    throw error;
  }
};

// Cost Center API functions
export const getCostCenters = async () => {
  try {
    const response = await tenantApiService('GET', 'cost-centers');
    return response;
  } catch (error) {
    console.error('Error fetching cost centers:', error);
    throw error;
  }
};

export const getCostCenterById = async (id) => {
  try {
    const response = await tenantApiService('GET', `cost-centers/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching cost center:', error);
    throw error;
  }
};

export const createCostCenter = async (data) => {
  try {
    const response = await tenantApiService('POST', 'cost-centers', data);
    return response;
  } catch (error) {
    console.error('Error creating cost center:', error);
    throw error;
  }
};

export const editCostCenter = async (id, data) => {
  try {
    const response = await tenantApiService('PUT', `cost-centers/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error editing cost center:', error);
    throw error;
  }
};

export const deleteCostCenter = async (id) => {
  try {
    const response = await tenantApiService('DELETE', `cost-centers/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting cost center:', error);
    throw error;
  }
};

export const exportCostCentersToExcel = async () => {
  try {
    const response = await tenantApiService('GET', 'exportExcell/cost-centers');
    return response;
  } catch (error) {
    console.error('Error exporting cost centers to Excel:', error);
    throw error;
  }
};

export const exportCostCentersToPdf = async () => {
  try {
    const response = await tenantApiService('GET', 'exportPdf/cost-centers');
    return response;
  } catch (error) {
    console.error('Error exporting cost centers to PDF:', error);
    throw error;
  }
};

export const importCostCentersFromExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await tenantApiService('POST', 'importFromExcel/cost-centers', formData);
    return response;
  } catch (error) {
    console.error('Error importing cost centers from Excel:', error);
    throw error;
  }
};

// Function to get only cost center names for dropdowns
export const getCostCenterNames = async () => {
  try {
    const response = await tenantApiService('GET', 'names/cost-centers');
    return response;
  } catch (error) {
    console.error('Error fetching cost center names:', error);
    throw error;
  }
};

// Department API functions
export const getDepartments = async () => {
  try {
    const response = await tenantApiService('GET', 'departments');
    return response;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

export const getDepartmentById = async (id) => {
  try {
    const response = await tenantApiService('GET', `departments/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching department:', error);
    throw error;
  }
};

export const createDepartment = async (data) => {
  try {
    const response = await tenantApiService('POST', 'departments', data);
    return response;
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};

export const editDepartment = async (id, data) => {
  try {
    const response = await tenantApiService('PUT', `departments/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error editing department:', error);
    throw error;
  }
};

export const deleteDepartment = async (id) => {
  try {
    const response = await tenantApiService('DELETE', `departments/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
};

export const exportDepartmentsToExcel = async () => {
  try {
    const response = await tenantApiService('GET', 'exportExcell/departments');
    return response;
  } catch (error) {
    console.error('Error exporting departments to Excel:', error);
    throw error;
  }
};

export const exportDepartmentsToPdf = async () => {
  try {
    const response = await tenantApiService('GET', 'exportPdf/departments');
    return response;
  } catch (error) {
    console.error('Error exporting departments to PDF:', error);
    throw error;
  }
};

export const importDepartmentsFromExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await tenantApiService('POST', 'importFromExcel/departments', formData);
    return response;
  } catch (error) {
    console.error('Error importing departments from Excel:', error);
    throw error;
  }
};

// Function to get only department names for dropdowns
export const getDepartmentNames = async () => {
  try {
    const response = await tenantApiService('GET', 'names/departments');
    return response;
  } catch (error) {
    console.error('Error fetching department names:', error);
    throw error;
  }
};

// Trade API functions
export const getTrades = async () => {
  try {
    const response = await tenantApiService('GET', 'trades');
    return response;
  } catch (error) {
    console.error('Error fetching trades:', error);
    throw error;
  }
};

export const getTradeById = async (id) => {
  try {
    const response = await tenantApiService('GET', `trades/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching trade:', error);
    throw error;
  }
};

export const createTrade = async (data) => {
  try {
    const response = await tenantApiService('POST', 'trades', data);
    return response;
  } catch (error) {
    console.error('Error creating trade:', error);
    throw error;
  }
};

export const editTrade = async (id, data) => {
  try {
    const response = await tenantApiService('PUT', `trades/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error editing trade:', error);
    throw error;
  }
};

export const deleteTrade = async (id) => {
  try {
    const response = await tenantApiService('DELETE', `trades/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting trade:', error);
    throw error;
  }
};

export const exportTradesToExcel = async () => {
  try {
    const response = await tenantApiService('GET', 'exportExcell/trades');
    return response;
  } catch (error) {
    console.error('Error exporting trades to Excel:', error);
    throw error;
  }
};

export const exportTradesToPdf = async () => {
  try {
    const response = await tenantApiService('GET', 'exportPdf/trades');
    return response;
  } catch (error) {
    console.error('Error exporting trades to PDF:', error);
    throw error;
  }
};

export const importTradesFromExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await tenantApiService('POST', 'importFromExcel/trades', formData);
    return response;
  } catch (error) {
    console.error('Error importing trades from Excel:', error);
    throw error;
  }
};

// Company Code API functions
export const getCompanyCodes = async () => {
  try {
    const response = await tenantApiService('GET', 'company-codes');
    return response;
  } catch (error) {
    console.error('Error fetching company codes:', error);
    throw error;
  }
};

export const getCompanyCodeById = async (id) => {
  try {
    const response = await tenantApiService('GET', `company-codes/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching company code:', error);
    throw error;
  }
};

export const createCompanyCode = async (data) => {
  try {
    const response = await tenantApiService('POST', 'company-codes', data);
    return response;
  } catch (error) {
    console.error('Error creating company code:', error);
    throw error;
  }
};

export const editCompanyCode = async (id, data) => {
  try {
    const response = await tenantApiService('PUT', `company-codes/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error editing company code:', error);
    throw error;
  }
};

export const deleteCompanyCode = async (id) => {
  try {
    const response = await tenantApiService('DELETE', `company-codes/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting company code:', error);
    throw error;
  }
};

export const exportCompanyCodesToExcel = async () => {
  try {
    const response = await tenantApiService('GET', 'exportExcell/company-codes');
    return response;
  } catch (error) {
    console.error('Error exporting company codes to Excel:', error);
    throw error;
  }
};

export const exportCompanyCodesToPdf = async () => {
  try {
    const response = await tenantApiService('GET', 'exportPdf/company-codes');
    return response;
  } catch (error) {
    console.error('Error exporting company codes to PDF:', error);
    throw error;
  }
};

export const importCompanyCodesFromExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await tenantApiService('POST', 'importFromExcel/company-codes', formData);
    return response;
  } catch (error) {
    console.error('Error importing company codes from Excel:', error);
    throw error;
  }
};

// Jobs API functions
export const getJobs = async () => {
  try {
    const response = await tenantApiService('GET', 'jobs');
    return response;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export const getJobById = async (id) => {
  try {
    const response = await tenantApiService('GET', `jobs/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching job:', error);
    throw error;
  }
};

export const createJob = async (data) => {
  try {
    const response = await tenantApiService('POST', 'jobs', data);
    return response;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

export const editJob = async (id, data) => {
  try {
    const response = await tenantApiService('PUT', `jobs/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error editing job:', error);
    throw error;
  }
};

export const deleteJob = async (id) => {
  try {
    const response = await tenantApiService('DELETE', `jobs/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

export const exportJobsToExcel = async () => {
  try {
    const response = await tenantApiService('GET', 'exportExcell/jobs');
    return response;
  } catch (error) {
    console.error('Error exporting jobs to Excel:', error);
    throw error;
  }
};

export const exportJobsToPdf = async () => {
  try {
    const response = await tenantApiService('GET', 'exportPdf/jobs');
    return response;
  } catch (error) {
    console.error('Error exporting jobs to PDF:', error);
    throw error;
  }
};

export const importJobsFromExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await tenantApiService('POST', 'importFromExcel/jobs', formData);
    return response;
  } catch (error) {
    console.error('Error importing jobs from Excel:', error);
    throw error;
  }
};



