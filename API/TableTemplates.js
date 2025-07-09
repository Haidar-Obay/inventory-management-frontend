import tenantApiService from "./TenantApiService";

// Table Templates API functions
export const getTableTemplates = async (tableName) => {
  try {
    const response = await tenantApiService("GET", `table-templates/${tableName}`);
    return response;
  } catch (error) {
    console.error("Error fetching table templates:", error);
    throw error;
  }
};

export const getTableTemplateById = async (tableName, templateId) => {
  try {
    const response = await tenantApiService("GET", `table-templates/${tableName}/${templateId}`);
    return response;
  } catch (error) {
    console.error("Error fetching table template:", error);
    throw error;
  }
};

export const createTableTemplate = async (tableName, data) => {
  try {
    const response = await tenantApiService("POST", `table-templates/${tableName}`, data);
    return response;
  } catch (error) {
    console.error("Error creating table template:", error);
    throw error;
  }
};

export const updateTableTemplate = async (tableName, templateId, data) => {
  try {
    const response = await tenantApiService("PUT", `table-templates/${tableName}/${templateId}`, data);
    return response;
  } catch (error) {
    console.error("Error updating table template:", error);
    throw error;
  }
};

export const deleteTableTemplate = async (tableName, templateId) => {
  try {
    const response = await tenantApiService("DELETE", `table-templates/${tableName}/${templateId}`);
    return response;
  } catch (error) {
    console.error("Error deleting table template:", error);
    throw error;
  }
};

export const applyTableTemplate = async (tableName, templateId) => {
  try {
    const response = await tenantApiService("POST", `table-templates/${tableName}/${templateId}/apply`);
    return response;
  } catch (error) {
    console.error("Error applying table template:", error);
    throw error;
  }
}; 