"use client";

import { useState, useEffect, Suspense } from "react";
import { Tabs, Tab, Box, Typography, CircularProgress } from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import Table from "@/components/ui/table/Table";
import ItemDrawer from "@/components/ui/drawers/ItemDrawer";
import CustomTabs from "@/components/ui/CustomTabs";
import {
  getProductLines,
  getCategories,
  getBrands,
  getItems,
  deleteProductLine,
  deleteCategory,
  deleteBrand,
  deleteItem,
  editProductLine,
  editCategory,
  editBrand,
  editItem,
  createProductLine,
  createCategory,
  createBrand,
  createItem,
  exportProductLinesToExcel,
  exportProductLinesToPdf,
  importProductLinesFromExcel,
  exportCategoriesToExcel,
  exportCategoriesToPdf,
  importCategoriesFromExcel,
  exportBrandsToExcel,
  exportBrandsToPdf,
  importBrandsFromExcel,
  exportItemsToExcel,
  exportItemsToPdf,
  importItemsFromExcel,
} from "@/API/Items";
import { useTableColumns } from "@/constants/tableColumns";
import { toast } from "@/components/ui/simple-toast";
import { useSearchParams, useRouter } from "next/navigation";

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
function ItemsPageLoading() {
  const t = useTranslations("items");
  return (
    <div className="flex justify-center items-center min-h-screen">
      <CircularProgress />
      <span className="ml-2">{t("loading")}</span>
    </div>
  );
}

// Main component wrapped with Suspense
export default function ItemsPageWrapper() {
  return (
    <Suspense fallback={<ItemsPageLoading />}>
      <ItemsPage />
    </Suspense>
  );
}

// The actual component that uses useSearchParams
function ItemsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [productLinesData, setProductLinesData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [brandsData, setBrandsData] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeDrawerType, setActiveDrawerType] = useState("");
  const [formData, setFormData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [dataFetched, setDataFetched] = useState({
    productLines: false,
    categories: false,
    brands: false,
    items: false,
  });

  const t = useTranslations("items");
  const tableT = useTranslations("tableColumns");
  const toastT = useTranslations("toast");

  const {
    productLinesColumns,
    categoriesColumns,
    brandsColumns,
    itemsColumns,
  } = useTableColumns(tableT);

  // Initialize tab value from URL or localStorage
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab !== null) {
      const tabValue = parseInt(tab);
      setValue(tabValue);
      localStorage.setItem("itemsLastTab", tabValue.toString());
    } else {
      // If no URL parameter, try to get from localStorage
      const savedTab = localStorage.getItem("itemsLastTab");
      if (savedTab) {
        const tabValue = parseInt(savedTab);
        setValue(tabValue);
        // Update URL to match localStorage
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tabValue.toString());
        router.push(`?${params.toString()}`);
      }
    }
  }, [searchParams, router]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    localStorage.setItem("itemsLastTab", newValue.toString());
    // Update URL with new tab value
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
        case 0: // Product Lines
          if (!force && dataFetched.productLines) {
            setLoading(false);
            return;
          }
          response = await getProductLines();
          setProductLinesData(response.data || []);
          dataType = "productLines";
          break;
        case 1: // Categories
          if (!force && dataFetched.categories) {
            setLoading(false);
            return;
          }
          response = await getCategories();
          setCategoriesData(response.data || []);
          dataType = "categories";
          break;
        case 2: // Brands
          if (!force && dataFetched.brands) {
            setLoading(false);
            return;
          }
          response = await getBrands();
          setBrandsData(response.data || []);
          dataType = "brands";
          break;
        case 3: // Items
          if (!force && dataFetched.items) {
            setLoading(false);
            return;
          }
          response = await getItems();
          setItemsData(response.data || []);
          dataType = "items";
          break;
      }

      if (dataType) {
        setDataFetched((prev) => ({
          ...prev,
          [dataType]: true,
        }));
      }

      toast.success({
        title: toastT("success"),
        description: toastT("dataFetchedSuccessfully"),
      });
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
    productLine: {
      setData: setProductLinesData,
      deleteFn: deleteProductLine,
      editFn: editProductLine,
      createFn: createProductLine,
    },
    category: {
      setData: setCategoriesData,
      deleteFn: deleteCategory,
      editFn: editCategory,
      createFn: createCategory,
    },
    brand: {
      setData: setBrandsData,
      deleteFn: deleteBrand,
      editFn: editBrand,
      createFn: createBrand,
    },
    item: {
      setData: setItemsData,
      deleteFn: deleteItem,
      editFn: editItem,
      createFn: createItem,
    },
  };

  const handleEdit = (type, row) => {
    setFormData({
      id: row.id,
      name: row.name,
      code: row.code,
      active: row.active,
      subcategory_of: row.subcategory_of,
      sub_brand_of: row.sub_brand_of,
      product_line_id: row.product_line_id,
      category_id: row.category_id,
      brand_id: row.brand_id,
    });
    setActiveDrawerType(type);
    setIsEditMode(true);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (type, row) => {
    try {
      const response = await entityHandlers[type].deleteFn(row.id);
      if (response.status) {
        entityHandlers[type].setData((prev) =>
          prev.filter((item) => item.id !== row.id)
        );
        // Reset the fetched state for the modified data type
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

  const handleAddNew = (type) => {
    setActiveDrawerType(type);
    setIsEditMode(false);
    // Set default values for new items
    const defaultData = {
      active: true, // Default to active for new items
      subcategory_of: "", // Default empty for categories
      sub_brand_of: "", // Default empty for brands
    };
    setFormData(defaultData);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setActiveDrawerType("");
    setFormData({});
    setIsEditMode(false);
  };

  const handleFormDataChange = (data) => {
    setFormData(data);
  };

  const handleSave = async () => {
    const type = activeDrawerType;
    const handler = entityHandlers[type];

    try {
      // Prepare the data with proper types
      const preparedData = {
        ...formData,
        active: formData.active === "true" || formData.active === true,
        // Ensure subcategory_of and sub_brand_of are properly set
        subcategory_of: formData.subcategory_of || null,
        sub_brand_of: formData.sub_brand_of || null,
      };

      let response;
      if (isEditMode) {
        response = await handler.editFn(formData.id, preparedData);
        if (response.status) {
          // Update existing item in the state
          entityHandlers[type].setData((prev) =>
            prev.map((item) =>
              item.id === formData.id ? { ...item, ...formData } : item
            )
          );
        }
      } else {
        response = await handler.createFn(preparedData);
        if (response.status) {
          // Add new item to the state
          entityHandlers[type].setData((prev) => [...prev, response.data]);
        }
      }

      if (response.status) {
        toast.success({
          title: toastT("success"),
          description: toastT(
            isEditMode ? `${type}.updateSuccess` : `${type}.createSuccess`
          ),
        });

        setIsEditMode(false);
      }
    } catch (error) {
      toast.error({
        title: toastT("error"),
        description:
          error.message ||
          toastT(isEditMode ? `${type}.updateError` : `${type}.createError`),
      });
    }
  };

  const handleSaveAndNew = async () => {
    await handleSave();
    setFormData({});
    if (isEditMode) {
      setIsEditMode(false);
      setFormData({});
    }
  };

  const handleSaveAndClose = async () => {
    await handleSave();
    handleCloseDrawer();
  };

  const handleExportExcel = async (type) => {
    try {
      let response;
      switch (type) {
        case "productLine":
          response = await exportProductLinesToExcel();
          break;
        case "category":
          response = await exportCategoriesToExcel();
          break;
        case "brand":
          response = await exportBrandsToExcel();
          break;
        case "item":
          response = await exportItemsToExcel();
          break;
        default:
          return;
      }

      // Create a download link for the Excel file
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}s.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success({
        title: toastT("success"),
        description: toastT(`${type}.exportSuccess`),
      });
    } catch (error) {
      toast.error({
        title: toastT("error"),
        description: error.message || toastT(`${type}.exportError`),
      });
    }
  };

  const handleExportPdf = async (type) => {
    try {
      let response;
      switch (type) {
        case "productLine":
          response = await exportProductLinesToPdf();
          break;
        case "category":
          response = await exportCategoriesToPdf();
          break;
        case "brand":
          response = await exportBrandsToPdf();
          break;
        case "item":
          response = await exportItemsToPdf();
          break;
        default:
          return;
      }

      // Create a download link for the PDF file
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}s.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success({
        title: toastT("success"),
        description: toastT(`${type}.exportSuccess`),
      });
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
        case "productLine":
          response = await importProductLinesFromExcel(file);
          break;
        case "category":
          response = await importCategoriesFromExcel(file);
          break;
        case "brand":
          response = await importBrandsFromExcel(file);
          break;
        case "item":
          response = await importItemsFromExcel(file);
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
        `management.${type === "productLine" ? "productLines" : type === "category" ? "categories" : type === "brand" ? "brands" : "items"}`
      );

      // Create the HTML content for printing
      const content = `
        <html>
          <head>
            <title>${typeTitle} List</title>
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
            <h1>${typeTitle} List</h1>
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

      toast.success({
        title: toastT("success"),
        description: toastT(`${type}.printSuccess`),
      });
    } catch (error) {
      toast.error({
        title: toastT("error"),
        description: error.message || toastT(`${type}.printError`),
      });
    }
  };

  return (
    <div className="p-4">
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <CustomTabs
            value={value}
            onChange={handleChange}
            aria-label="items tabs"
          >
            <Tab label={t("tabs.productLines")} />
            <Tab label={t("tabs.categories")} />
            <Tab label={t("tabs.brands")} />
            <Tab label={t("tabs.items")} />
          </CustomTabs>
        </Box>

        {/* Product Lines Management Tab*/}
        <TabPanel value={value} index={0}>
          <Box className="p-0">
            <Table
              data={productLinesData}
              columns={productLinesColumns}
              onEdit={(row) => handleEdit("productLine", row)}
              onDelete={(row) => handleDelete("productLine", row)}
              onAdd={() => handleAddNew("productLine")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("productLine")}
              onExportPdf={() => handleExportPdf("productLine")}
              onPrint={() =>
                handlePrint(
                  "productLine",
                  productLinesData,
                  productLinesColumns
                )
              }
              onRefresh={() => fetchData(0, true)}
              onImportExcel={(file) => handleImportExcel("productLine", file)}
              tableId="productLines"
            />
          </Box>
        </TabPanel>

        {/* Categories Management Tab*/}
        <TabPanel value={value} index={1}>
          <Box className="p-0">
            <Table
              data={categoriesData}
              columns={categoriesColumns}
              onEdit={(row) => handleEdit("category", row)}
              onDelete={(row) => handleDelete("category", row)}
              onAdd={() => handleAddNew("category")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("category")}
              onExportPdf={() => handleExportPdf("category")}
              onPrint={() =>
                handlePrint("category", categoriesData, categoriesColumns)
              }
              onRefresh={() => fetchData(1, true)}
              onImportExcel={(file) => handleImportExcel("category", file)}
              tableId="categories"
            />
          </Box>
        </TabPanel>

        {/* Brands Management Tab*/}
        <TabPanel value={value} index={2}>
          <Box className="p-0">
            <Table
              data={brandsData}
              columns={brandsColumns}
              onEdit={(row) => handleEdit("brand", row)}
              onDelete={(row) => handleDelete("brand", row)}
              onAdd={() => handleAddNew("brand")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("brand")}
              onExportPdf={() => handleExportPdf("brand")}
              onPrint={() => handlePrint("brand", brandsData, brandsColumns)}
              onRefresh={() => fetchData(2, true)}
              onImportExcel={(file) => handleImportExcel("brand", file)}
              tableId="brands"
            />
          </Box>
        </TabPanel>

        {/* Items Management Tab*/}
        <TabPanel value={value} index={3}>
          <Box className="p-0">
            <Table
              data={itemsData}
              columns={itemsColumns}
              onEdit={(row) => handleEdit("item", row)}
              onDelete={(row) => handleDelete("item", row)}
              onAdd={() => handleAddNew("item")}
              loading={loading}
              enableCellEditing={false}
              onExportExcel={() => handleExportExcel("item")}
              onExportPdf={() => handleExportPdf("item")}
              onPrint={() => handlePrint("item", itemsData, itemsColumns)}
              onRefresh={() => fetchData(3, true)}
              onImportExcel={(file) => handleImportExcel("item", file)}
              tableId="items"
            />
          </Box>
        </TabPanel>

        {/* Item Drawer */}
        <ItemDrawer
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          type={activeDrawerType}
          onSave={handleSave}
          onSaveAndNew={handleSaveAndNew}
          onSaveAndClose={handleSaveAndClose}
          formData={formData}
          onFormDataChange={handleFormDataChange}
          isEdit={isEditMode}
        />
      </Box>
    </div>
  );
}
