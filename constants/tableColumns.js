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
  { header: "Name", key: "name" },
  { header: "Description", key: "description" },
  { header: "Actions", key: "actions" }
];

export const departmentColumns = [
  { header: "ID", key: "id" },
  { header: "Name", key: "name" },
  { header: "Description", key: "description" },
  { header: "Actions", key: "actions" }
];

export const tradesColumns = [
  { header: "ID", key: "id" },
  { header: "Name", key: "name" },
  { header: "Description", key: "description" },
  { header: "Actions", key: "actions" }
];

export const companyCodesColumns = [
  { header: "ID", key: "id" },
  { header: "Name", key: "name" },
  { header: "Description", key: "description" },
  { header: "Actions", key: "actions" }
];

export const jobsColumns = [
  { header: "ID", key: "id" },
  { header: "Name", key: "name" },
  { header: "Description", key: "description" },
  { header: "Actions", key: "actions" }
];