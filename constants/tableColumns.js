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
      { header: t("description"), key: "description" },
      { header: t("actions"), key: "actions" },
    ],

    costCenterColumns: [
      { header: t("id"), key: "id" },
      { header: t("name"), key: "name" },
      { header: t("description"), key: "description" },
      { header: t("actions"), key: "actions" },
    ],

    departmentColumns: [
      { header: t("id"), key: "id" },
      { header: t("name"), key: "name" },
      { header: t("description"), key: "description" },
      { header: t("actions"), key: "actions" },
    ],

    tradesColumns: [
      { header: t("id"), key: "id" },
      { header: t("name"), key: "name" },
      { header: t("description"), key: "description" },
      { header: t("actions"), key: "actions" },
    ],

    companyCodesColumns: [
      { header: t("id"), key: "id" },
      { header: t("name"), key: "name" },
      { header: t("description"), key: "description" },
      { header: t("actions"), key: "actions" },
    ],

    jobsColumns: [
      { header: t("id"), key: "id" },
      { header: t("name"), key: "name" },
      { header: t("description"), key: "description" },
      { header: t("actions"), key: "actions" },
    ],
  };
}
