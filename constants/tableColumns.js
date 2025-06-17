// Table columns configuration
export function useTableColumns(t) {
  return {
    countryColumns: [
      { key: "id", header: t("id"), type: "text" },
      { key: "name", header: t("name"), type: "text" },
      { key: "created_at", header: t("createdAt"), type: "date" },
      { key: "updated_at", header: t("updatedAt"), type: "date" },
    ],

    cityColumns: [
      { key: "id", header: t("id"), type: "text" },
      { key: "name", header: t("name"), type: "text" },
      { key: "created_at", header: t("createdAt"), type: "date" },
      { key: "updated_at", header: t("updatedAt"), type: "date" },
    ],

    provinceColumns: [
      { key: "id", header: t("id"), type: "text" },
      { key: "name", header: t("name"), type: "text" },
      { key: "created_at", header: t("createdAt"), type: "date" },
      { key: "updated_at", header: t("updatedAt"), type: "date" },
    ],

    districtColumns: [
      { key: "id", header: t("id"), type: "text" },
      { key: "name", header: t("name"), type: "text" },
      { key: "created_at", header: t("createdAt"), type: "date" },
      { key: "updated_at", header: t("updatedAt"), type: "date" },
    ],

    projectColumns: [
      { header: t("id"), key: "id" },
      { header: t("name"), key: "name" },
      { header: t("startDate"), key: "start_date", type: "date" },
      { header: t("endDate"), key: "end_date", type: "date" },
      { header: t("expectedDate"), key: "expected_date", type: "date" },
      { header: t("customerId"), key: "customer_id", type: "text" },
      { header: t("createdAt"), key: "created_at", type: "date" },
      { header: t("updatedAt"), key: "updated_at", type: "date" },
    ],

    costCenterColumns: [
      { header: t("id"), key: "id" },
      { header: t("code"), key: "code" },
      { header: t("name"), key: "name" },
      { header: t("subOf"), key: "sub_cost_center_of", type: "text" },
      { header: t("active"), key: "active", type: "boolean" },
      { header: t("createdAt"), key: "created_at", type: "date" },
      { header: t("updatedAt"), key: "updated_at", type: "date" },
    ],

    departmentColumns: [
      { header: t("id"), key: "id" },
      { header: t("code"), key: "code" },
      { header: t("name"), key: "name" },
      { header: t("subOf"), key: "sub_department_of", type: "text" },
      { header: t("active"), key: "active", type: "boolean" },
      { header: t("createdAt"), key: "created_at", type: "date" },
      { header: t("updatedAt"), key: "updated_at", type: "date" },
    ],

    tradesColumns: [
      { header: t("id"), key: "id" },
      { header: t("code"), key: "code" },
      { header: t("name"), key: "name" },
      { header: t("active"), key: "active", type: "boolean" },
      { header: t("createdAt"), key: "created_at", type: "date" },
      { header: t("updatedAt"), key: "updated_at", type: "date" },
    ],

    companyCodesColumns: [
      { header: t("id"), key: "id" },
      { header: t("code"), key: "code" },
      { header: t("name"), key: "name" },
      { header: t("createdAt"), key: "created_at", type: "date" },
      { header: t("updatedAt"), key: "updated_at", type: "date" },
    ],

    jobsColumns: [
      { header: t("id"), key: "id" },
      { header: t("description"), key: "description" },
      { header: t("projectId"), key: "project_id" },
      { header: t("startDate"), key: "start_date", type: "date" },
      { header: t("expectedDate"), key: "expected_date", type: "date" },
      { header: t("endDate"), key: "end_date", type: "date" },
      { header: t("createdAt"), key: "created_at", type: "date" },
      { header: t("updatedAt"), key: "updated_at", type: "date" },
    ],

    productLinesColumns: [
      { header: t("id"), key: "id" },
      { header: t("code"), key: "code" },
      { header: t("name"), key: "name" },
      { header: t("active"), key: "active", type: "boolean" },
      { header: t("createdAt"), key: "created_at", type: "date" },
      { header: t("updatedAt"), key: "updated_at", type: "date" },
    ],

    categoriesColumns: [
      { header: t("id"), key: "id" },
      { header: t("code"), key: "code" },
      { header: t("name"), key: "name" },
      { header: t("subOf"), key: "sub_category_of" },
      { header: t("active"), key: "active", type: "boolean" },
      { header: t("createdAt"), key: "created_at", type: "date" },
      { header: t("updatedAt"), key: "updated_at", type: "date" },
    ],

    brandsColumns: [
      { header: t("id"), key: "id" },
      { header: t("code"), key: "code" },
      { header: t("name"), key: "name" },
      { header: t("subOf"), key: "sub_brand_of" },
      { header: t("active"), key: "active", type: "boolean" },
      { header: t("createdAt"), key: "created_at", type: "date" },
      { header: t("updatedAt"), key: "updated_at", type: "date" },
    ],

    itemsColumns: [
      { header: t("id"), key: "id" },
      { header: t("code"), key: "code" },
      { header: t("name"), key: "name" },
      { header: t("productLine"), key: "product_line_name" },
      { header: t("category"), key: "category_name" },
      { header: t("brand"), key: "brand_name" },
      { header: t("active"), key: "active", type: "boolean" },
      { header: t("createdAt"), key: "created_at", type: "date" },
      { header: t("updatedAt"), key: "updated_at", type: "date" },
    ],
  };
}
