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



