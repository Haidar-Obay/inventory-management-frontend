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



