import { useMemo } from 'react';

// Table columns configuration for countries
export const countryColumns = [
  { key: "id", header: "ID", type: "text" },
  { key: "name", header: "Name", type: "text" },
  { key: "created_at", header: "Created At", type: "date" },
  { key: "updated_at", header: "Updated At", type: "date" }
];

// Table columns configuration for cities
export const cityColumns = [
  { key: "id", header: "ID", type: "text" },
  { key: "name", header: "Name", type: "text" },
  { key: "created_at", header: "Created At", type: "date" },
  { key: "updated_at", header: "Updated At", type: "date" }
];

// Table columns configuration for provinces
export const provinceColumns = [
  { key: "id", header: "ID", type: "text" },
  { key: "name", header: "Name", type: "text" },
  { key: "created_at", header: "Created At", type: "date" },
  { key: "updated_at", header: "Updated At", type: "date" }
];

export const districtColumns = [
  { key: "id", header: "ID", type: "text" },
  { key: "name", header: "Name", type: "text" },
  { key: "created_at", header: "Created At", type: "date" },
  { key: "updated_at", header: "Updated At", type: "date" }
];


export const projectColumns = [
  { header: "ID", key: "id" },
  { header: "Name", key: "name" },
  { header: "Start Date", key: "start_date", type: "date" },
  { header: "End Date", key: "end_date", type: "date" },
  { header: "Expected Date", key: "expected_date", type: "date" },
  { header: "Customer ID", key: "customer_id", type: "text" },
  { header: "Created At", key: "created_at", type: "date" },
  { header: "Updated At", key: "updated_at", type: "date" }
];

export const costCenterColumns = [
  { header: "ID", key: "id" },
  { header: "Code", key: "code" },
  { header: "Name", key: "name" },
  { header: "Sub Of", key: "sub_cost_center_of", type: "text" },
  { header: "Active", key: "active", type: "boolean" },
  { header: "Created At", key: "created_at", type: "date" },
  { header: "Updated At", key: "updated_at", type: "date" }
];

export const departmentColumns = [
  { header: "ID", key: "id" },
  { header: "Code", key: "code" },
  { header: "Name", key: "name" },
  { header: "Sub Of", key: "sub_department_of", type: "text" },
  { header: "Active", key: "active", type: "boolean" },
  { header: "Created At", key: "created_at", type: "date" },
  { header: "Updated At", key: "updated_at", type: "date" },
];

export const tradesColumns = [
  { header: "ID", key: "id" },
  { header: "Code", key: "code" },
  { header: "Name", key: "name" },
  { header: "Active", key: "active", type: "boolean" },
  { header: "Created At", key: "created_at", type: "date" },
  { header: "Updated At", key: "updated_at", type: "date" },
];

export const companyCodesColumns = [
  { header: "ID", key: "id" },
  { header: "Code", key: "code" },
  { header: "Name", key: "name" },
  { header: "Created At", key: "created_at", type: "date" },
  { header: "Updated At", key: "updated_at", type: "date" },
];

export const jobsColumns = [
  { header: "ID", key: "id" },
  { header: "Description", key: "description" },
  { header: "Project ID", key: "project_id" },
  { header: "Start Date", key: "start_date", type: "date" },
  { header: "Expected Date", key: "expected_date", type: "date" },
  { header: "End Date", key: "end_date", type: "date" },
  { header: "Created At", key: "created_at", type: "date" },
  { header: "Updated At", key: "updated_at", type: "date" },
];

export const productLinesColumns = [
  { header: "ID", key: "id" },
  { header: "Code", key: "code" },
  { header: "Name", key: "name" },
  { header: "Active", key: "active", type: "boolean" },
  { header: "Created At", key: "created_at", type: "date" },
  { header: "Updated At", key: "updated_at", type: "date" },
];

export const categoriesColumns = [
  { header: "ID", key: "id" },
  { header: "Code", key: "code" },
  { header: "Name", key: "name" },
  { header: "Sub Of", key: "sub_category_of" },
  { header: "Active", key: "active", type: "boolean" },
  { header: "Created At", key: "created_at", type: "date" },
  { header: "Updated At", key: "updated_at", type: "date" },
];

export const brandsColumns = [
  { header: "ID", key: "id" },
  { header: "Code", key: "code" },
  { header: "Name", key: "name" },
  { header: "Sub Of", key: "sub_brand_of" },
  { header: "Active", key: "active", type: "boolean" },
  { header: "Created At", key: "created_at", type: "date" },
  { header: "Updated At", key: "updated_at", type: "date" },
];

export const itemsColumns = [
  { header: "ID", key: "id" },
  { header: "Code", key: "code" },
  { header: "Name", key: "name" },
  { header: "Product Line", key: "product_line_name" },
  { header: "Category", key: "category_name" },
  { header: "Brand", key: "brand_name" },
  { header: "Active", key: "active", type: "boolean" },
  { header: "Created At", key: "created_at", type: "date" },
  { header: "Updated At", key: "updated_at", type: "date" },
];

