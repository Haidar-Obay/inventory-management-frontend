import tenantApiService from './TenantApiService';

// Product Lines API functions
export const getProductLines = async () => {
  try {
    const response = await tenantApiService('GET', 'product-lines');
    return response;
  } catch (error) {
    console.error('Error fetching product lines:', error);
    throw error;
  }
};

export const getProductLineById = async (id) => {
  try {
    const response = await tenantApiService('GET', `product-lines/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching product line:', error);
    throw error;
  }
};

export const createProductLine = async (data) => {
  try {
    const response = await tenantApiService('POST', 'product-lines', data);
    return response;
  } catch (error) {
    console.error('Error creating product line:', error);
    throw error;
  }
};

export const editProductLine = async (id, data) => {
  try {
    const response = await tenantApiService('PUT', `product-lines/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error editing product line:', error);
    throw error;
  }
};

export const deleteProductLine = async (id) => {
  try {
    const response = await tenantApiService('DELETE', `product-lines/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting product line:', error);
    throw error;
  }
};

export const exportProductLinesToExcel = async () => {
  try {
    const response = await tenantApiService('GET', 'exportExcell/product-lines');
    return response;
  } catch (error) {
    console.error('Error exporting product lines to Excel:', error);
    throw error;
  }
};

export const exportProductLinesToPdf = async () => {
  try {
    const response = await tenantApiService('GET', 'exportPdf/product-lines');
    return response;
  } catch (error) {
    console.error('Error exporting product lines to PDF:', error);
    throw error;
  }
};

export const importProductLinesFromExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await tenantApiService('POST', 'importFromExcel/product-lines', formData);
    return response;
  } catch (error) {
    console.error('Error importing product lines from Excel:', error);
    throw error;
  }
};

// // Function to get only product line names for dropdowns
// export const getProductLineNames = async () => {
//   try {
//     const response = await tenantApiService('GET', 'names/product-lines');
//     return response;
//   } catch (error) {
//     console.error('Error fetching product line names:', error);
//     throw error;
//   }
// };

// Categories API functions
export const getCategories = async () => {
  try {
    const response = await tenantApiService('GET', 'categories');
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await tenantApiService('GET', `categories/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

export const createCategory = async (data) => {
  try {
    const response = await tenantApiService('POST', 'categories', data);
    return response;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const editCategory = async (id, data) => {
  try {
    const response = await tenantApiService('PUT', `categories/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error editing category:', error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await tenantApiService('DELETE', `categories/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export const exportCategoriesToExcel = async () => {
  try {
    const response = await tenantApiService('GET', 'exportExcell/categories');
    return response;
  } catch (error) {
    console.error('Error exporting categories to Excel:', error);
    throw error;
  }
};

export const exportCategoriesToPdf = async () => {
  try {
    const response = await tenantApiService('GET', 'exportPdf/categories');
    return response;
  } catch (error) {
    console.error('Error exporting categories to PDF:', error);
    throw error;
  }
};

export const importCategoriesFromExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await tenantApiService('POST', 'importFromExcel/categories', formData);
    return response;
  } catch (error) {
    console.error('Error importing categories from Excel:', error);
    throw error;
  }
};

// Function to get only category names for dropdowns
export const getCategoryNames = async () => {
  try {
    const response = await tenantApiService('GET', 'names/categories');
    return response;
  } catch (error) {
    console.error('Error fetching category names:', error);
    throw error;
  }
};

// Brands API functions
export const getBrands = async () => {
  try {
    const response = await tenantApiService('GET', 'brands');
    return response;
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
};

export const getBrandById = async (id) => {
  try {
    const response = await tenantApiService('GET', `brands/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching brand:', error);
    throw error;
  }
};

export const createBrand = async (data) => {
  try {
    const response = await tenantApiService('POST', 'brands', data);
    return response;
  } catch (error) {
    console.error('Error creating brand:', error);
    throw error;
  }
};

export const editBrand = async (id, data) => {
  try {
    const response = await tenantApiService('PUT', `brands/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error editing brand:', error);
    throw error;
  }
};

export const deleteBrand = async (id) => {
  try {
    const response = await tenantApiService('DELETE', `brands/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting brand:', error);
    throw error;
  }
};

export const exportBrandsToExcel = async () => {
  try {
    const response = await tenantApiService('GET', 'exportExcell/brands');
    return response;
  } catch (error) {
    console.error('Error exporting brands to Excel:', error);
    throw error;
  }
};

export const exportBrandsToPdf = async () => {
  try {
    const response = await tenantApiService('GET', 'exportPdf/brands');
    return response;
  } catch (error) {
    console.error('Error exporting brands to PDF:', error);
    throw error;
  }
};

export const importBrandsFromExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await tenantApiService('POST', 'importFromExcel/brands', formData);
    return response;
  } catch (error) {
    console.error('Error importing brands from Excel:', error);
    throw error;
  }
};

// Function to get only brand names for dropdowns
export const getBrandNames = async () => {
  try {
    const response = await tenantApiService('GET', 'names/brands');
    return response;
  } catch (error) {
    console.error('Error fetching brand names:', error);
    throw error;
  }
};

// Items API functions
export const getItems = async () => {
  try {
    const response = await tenantApiService('GET', 'items');
    return response;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export const getItemById = async (id) => {
  try {
    const response = await tenantApiService('GET', `items/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching item:', error);
    throw error;
  }
};

export const createItem = async (data) => {
  try {
    const response = await tenantApiService('POST', 'items', data);
    return response;
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

export const editItem = async (id, data) => {
  try {
    const response = await tenantApiService('PUT', `items/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error editing item:', error);
    throw error;
  }
};

export const deleteItem = async (id) => {
  try {
    const response = await tenantApiService('DELETE', `items/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

export const exportItemsToExcel = async () => {
  try {
    const response = await tenantApiService('GET', 'exportExcell/items');
    return response;
  } catch (error) {
    console.error('Error exporting items to Excel:', error);
    throw error;
  }
};

export const exportItemsToPdf = async () => {
  try {
    const response = await tenantApiService('GET', 'exportPdf/items');
    return response;
  } catch (error) {
    console.error('Error exporting items to PDF:', error);
    throw error;
  }
};

export const importItemsFromExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await tenantApiService('POST', 'importFromExcel/items', formData);
    return response;
  } catch (error) {
    console.error('Error importing items from Excel:', error);
    throw error;
  }
}; 