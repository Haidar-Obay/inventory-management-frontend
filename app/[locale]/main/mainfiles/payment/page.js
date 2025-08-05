"use client";

import { useState, useEffect, Suspense } from "react";
import { Box, CircularProgress, Tabs, Tab } from "@mui/material";
import CustomTabs from "@/components/ui/CustomTabs";
import Table from "@/components/ui/table/Table";
import { useTranslations, useLocale } from "next-intl";
import { useTableColumns } from "@/constants/tableColumns";
import {
  getPaymentTerms,
  createPaymentTerm,
  editPaymentTerm,
  deletePaymentTerm,
  exportPaymentTermsToExcel,
  exportPaymentTermsToPdf,
  getPaymentMethods,
  createPaymentMethod,
  editPaymentMethod,
  deletePaymentMethod,
  exportPaymentMethodsToExcel,
  exportPaymentMethodsToPdf,
} from "@/API/Payment";
import { useSearchParams, useRouter } from "next/navigation";
import PaymentDrawer from "@/components/ui/drawers/PaymentDrawer";
import PreviewModal from "@/components/ui/table/PreviewModal";
import { useCustomActions } from "@/components/ui/table/useCustomActions";
import { useSimpleToast } from "@/components/ui/simple-toast";
import { ActiveStatusAction } from "@/components/ui/table/ActiveStatusAction";

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

function PaymentPageLoading() {
  const t = useTranslations("payment");
  return (
    <div className="flex justify-center items-center min-h-screen">
      <CircularProgress />
      <span className="ml-2">{t("loading")}</span>
    </div>
  );
}

export default function PaymentPageWrapper() {
  return (
    <Suspense fallback={<PaymentPageLoading />}>
      <PaymentPage />
    </Suspense>
  );
}

function PaymentPage() {
  const t = useTranslations("payment");
  const commonT = useTranslations("common");
  const tableT = useTranslations("tableColumns");
  const { paymentTermsColumns, paymentMethodsColumns } = useTableColumns(tableT);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [paymentTerms, setPaymentTerms] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState("paymentTerm");
  const [drawerEdit, setDrawerEdit] = useState(false);
  const [drawerFormData, setDrawerFormData] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewRow, setPreviewRow] = useState(null);
  const { addToast } = useSimpleToast();
  const tToast = useTranslations("toast");

  // Sync tab with URL
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam !== null) {
      const tabValue = parseInt(tabParam);
      setTab(tabValue);
      localStorage.setItem("paymentLastTab", tabValue.toString());
    } else {
      const savedTab = localStorage.getItem("paymentLastTab");
      if (savedTab) {
        const tabValue = parseInt(savedTab);
        setTab(tabValue);
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tabValue.toString());
        router.push(`?${params.toString()}`);
      }
    }
  }, [searchParams, router]);

  const handleChange = (event, newValue) => {
    setTab(newValue);
    localStorage.setItem("paymentLastTab", newValue.toString());
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newValue.toString());
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    fetchData(tab);
    // eslint-disable-next-line
  }, [tab]);

  const fetchData = async (tabIndex) => {
    setLoading(true);
    try {
      if (tabIndex === 0) {
        const res = await getPaymentTerms();
        setPaymentTerms(res.data || []);
      } else {
        const res = await getPaymentMethods();
        setPaymentMethods(res.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  // Row actions
  const handlePreview = (row) => {
    setPreviewRow(row);
    setPreviewOpen(true);
  };
  const handleEdit = (row, type) => {
    setDrawerType(type);
    setDrawerEdit(true);
    setDrawerFormData(row);
    setDrawerOpen(true);
  };
  const handleAdd = (type) => {
    setDrawerType(type);
    setDrawerEdit(false);
    setDrawerFormData(null);
    setDrawerOpen(true);
  };

  useEffect(() => {
    // if (deleteRow) setDeleteOpen(true); // This line is removed
  }, []); // This useEffect is also removed



  // Custom actions for table rows
  const paymentTermsActions = useCustomActions({
    onPreview: (row) => handlePreview(row),
    onEdit: (row) => handleEdit(row, "paymentTerm"),
    onDelete: (row) => {
      // This action is removed
    },
    additionalActions: (row) => [
      ActiveStatusAction({
        row,
        editFunction: editPaymentTerm,
        onSuccess: (row, updatedData) => {
          setPaymentTerms((prev) => 
            prev.map((item) => item.id === row.id ? { ...item, active: updatedData.active } : item)
          );
          addToast({
            type: "success",
            title: tToast("success"),
            description: tToast("updateSuccess"),
            duration: 5000,
          });
        },
        onError: (row, errorMessage) => {
          addToast({
            type: "error",
            title: tToast("error"),
            description: errorMessage || tToast("updateError"),
            duration: 5000,
          });
        },
      }),
    ],
  });
  const paymentMethodsActions = useCustomActions({
    onPreview: (row) => handlePreview(row),
    onEdit: (row) => handleEdit(row, "paymentMethod"),
    onDelete: (row) => {
      // This action is removed
    },
    additionalActions: (row) => [
      ActiveStatusAction({
        row,
        editFunction: editPaymentMethod,
        onSuccess: (row, updatedData) => {
          setPaymentMethods((prev) => 
            prev.map((item) => item.id === row.id ? { ...item, active: updatedData.active } : item)
          );
          addToast({
            type: "success",
            title: tToast("success"),
            description: tToast("updateSuccess"),
            duration: 5000,
          });
        },
        onError: (row, errorMessage) => {
          addToast({
            type: "error",
            title: tToast("error"),
            description: errorMessage || tToast("updateError"),
            duration: 5000,
          });
        },
      }),
    ],
  });

  // Toolbar actions
  const handleExportExcel = async () => {
    try {
      // Determine which tab is active and get the appropriate data
      const isPaymentTermsTab = tab === 0;
      const data = isPaymentTermsTab ? paymentTerms : paymentMethods;

      // Check if data array is empty
      if (!data || data.length === 0) {
        addToast({
          type: "error",
          title: tToast("error"),
          description: tToast("noDataToExport"),
          duration: 5000,
        });
        return;
      }

      let response;
      if (isPaymentTermsTab) {
        response = await exportPaymentTermsToExcel();
      } else {
        response = await exportPaymentMethodsToExcel();
      }

      // Create a download link for the Excel file
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", isPaymentTermsTab ? "payment-terms.xlsx" : "payment-methods.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      addToast({
        type: "error",
        title: tToast("error"),
        description: error.message || tToast("exportError"),
        duration: 5000,
      });
    }
  };
  const handleExportPdf = async () => {
    try {
      // Determine which tab is active and get the appropriate data
      const isPaymentTermsTab = tab === 0;
      const data = isPaymentTermsTab ? paymentTerms : paymentMethods;

      // Check if data array is empty
      if (!data || data.length === 0) {
        addToast({
          type: "error",
          title: tToast("error"),
          description: tToast("noDataToExport"),
          duration: 5000,
        });
        return;
      }

      let response;
      if (isPaymentTermsTab) {
        response = await exportPaymentTermsToPdf();
      } else {
        response = await exportPaymentMethodsToPdf();
      }

      // Create a download link for the PDF file
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", isPaymentTermsTab ? "payment-terms.pdf" : "payment-methods.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      addToast({
        type: "error",
        title: tToast("error"),
        description: error.message || tToast("exportError"),
        duration: 5000,
      });
    }
  };
  const handlePrint = async () => {
    try {
      // Create a new window for printing
      const printWindow = window.open("", "_blank");

      // Determine which tab is active and get the appropriate data and columns
      const isPaymentTermsTab = tab === 0;
      const data = isPaymentTermsTab ? paymentTerms : paymentMethods;
      const columns = isPaymentTermsTab ? paymentTermsColumns : paymentMethodsColumns;
      const typeTitle = isPaymentTermsTab ? t("tabs.paymentTerms") : t("tabs.paymentMethods");

      // Create the HTML content for printing
      const content = `
        <html>
          <head>
            <title>${isRTL ? `${commonT("list")} ${typeTitle}` : `${typeTitle} ${commonT("list")}`}</title>
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
            <h1>${isRTL ? `${commonT("list")} ${typeTitle}` : `${typeTitle} ${commonT("list")}`}</h1>
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
    } catch (error) {
      addToast({
        type: "error",
        title: tToast("error"),
        description: error.message || tToast("printError"),
        duration: 5000,
      });
    }
  };
  const handleImportExcel = async (file) => {
    try {
      // await import logic
      addToast({
        type: "success",
        title: tToast("success"),
        description: tToast("importSuccess"),
        duration: 5000,
      });
    } catch (error) {
      addToast({
        type: "error",
        title: tToast("error"),
        description: error.message || tToast("importError"),
        duration: 5000,
      });
    }
  };
  const handleRefresh = () => {
    fetchData(tab);
    addToast({
      type: "info",
      title: tToast("info"),
      description: tToast("sidebarInfo"),
      duration: 5000,
    });
  };

  // Add/Edit handlers for PaymentDrawer
  const handleDrawerSave = async (formData) => {
    try {
      let response;
      if (drawerType === "paymentTerm") {
        const payload = { ...formData, nb_days: Number(formData.nb_days) || 0 };
        if (drawerEdit) {
          response = await editPaymentTerm(formData.id, payload);
          if (response && response.status && response.data) {
            setPaymentTerms((prev) =>
              prev.map((r) => r.id === formData.id ? response.data : r)
            );
            addToast({ type: "success", title: tToast("success"), description: tToast("updateSuccess"), duration: 5000 });
            // Don't close the drawer - let user continue editing
            // setDrawerOpen(false); // Removed this line
          } else {
            addToast({ type: "error", title: tToast("error"), description: response?.message || tToast("updateError"), duration: 5000 });
          }
        } else {
          response = await createPaymentTerm(payload);
          if (response && response.status && response.data) {
            setPaymentTerms((prev) => [...prev, response.data]);
            addToast({ type: "success", title: tToast("success"), description: tToast("createSuccess"), duration: 5000 });
            // Don't close the drawer - let user continue editing
            // setDrawerOpen(false); // Removed this line
          } else {
            addToast({ type: "error", title: tToast("error"), description: response?.message || tToast("createError"), duration: 5000 });
          }
        }
      } else {
        if (drawerEdit) {
          const payload = {
            ...formData,
            active: !!formData.active,
            is_credit_card: !!formData.is_credit_card,
            is_online_payment: !!formData.is_online_payment,
          };
          response = await editPaymentMethod(formData.id, payload);
          if (response && response.status && response.data) {
            setPaymentMethods((prev) =>
              prev.map((r) => r.id === formData.id ? response.data : r)
            );
            addToast({ type: "success", title: tToast("success"), description: tToast("updateSuccess"), duration: 5000 });
            // Don't close the drawer - let user continue editing
            // setDrawerOpen(false); // Removed this line
          } else {
            addToast({ type: "error", title: tToast("error"), description: response?.message || tToast("updateError"), duration: 5000 });
          }
        } else {
          const payload = {
            ...formData,
            active: !!formData.active,
            is_credit_card: !!formData.is_credit_card,
            is_online_payment: !!formData.is_online_payment,
          };
          response = await createPaymentMethod(payload);
          if (response && response.status && response.data) {
            setPaymentMethods((prev) => [...prev, response.data]);
            addToast({ type: "success", title: tToast("success"), description: tToast("createSuccess"), duration: 5000 });
            // Don't close the drawer - let user continue editing
            // setDrawerOpen(false); // Removed this line
          } else {
            addToast({ type: "error", title: tToast("error"), description: response?.message || tToast("createError"), duration: 5000 });
          }
        }
      }
    } catch (error) {
      addToast({ type: "error", title: tToast("error"), description: error.message || tToast("createError"), duration: 5000 });
    }
  };

  const handleDrawerSaveAndNew = async (formData) => {
    try {
      let response;
      if (drawerType === "paymentTerm") {
        const payload = { ...formData, nb_days: Number(formData.nb_days) || 0 };
        response = await createPaymentTerm(payload);
        if (response && response.status && response.data) {
          setPaymentTerms((prev) => [...prev, response.data]);
          addToast({ type: "success", title: tToast("success"), description: tToast("createSuccess"), duration: 5000 });
          setDrawerFormData({ code: '', nb_days: 0, active: false, is_credit_card: false, is_online_payment: false });
        } else {
          addToast({ type: "error", title: tToast("error"), description: response?.message || tToast("createError"), duration: 5000 });
        }
      } else {
        const payload = {
          ...formData,
          active: !!formData.active,
          is_credit_card: !!formData.is_credit_card,
          is_online_payment: !!formData.is_online_payment,
        };
        response = await createPaymentMethod(payload);
        if (response && response.status && response.data) {
          setPaymentMethods((prev) => [...prev, response.data]);
          addToast({ type: "success", title: tToast("success"), description: tToast("createSuccess"), duration: 5000 });
          setDrawerFormData({ code: '', nb_days: 0, active: false, is_credit_card: false, is_online_payment: false });
        } else {
          addToast({ type: "error", title: tToast("error"), description: response?.message || tToast("createError"), duration: 5000 });
        }
      }
    } catch (error) {
      addToast({ type: "error", title: tToast("error"), description: error.message || tToast("createError"), duration: 5000 });
    }
  };

  const handleDrawerSaveAndClose = async (formData) => {
    try {
      let response;
      if (drawerType === "paymentTerm") {
        const payload = { ...formData, nb_days: Number(formData.nb_days) || 0 };
        response = await createPaymentTerm(payload);
        if (response && response.status && response.data) {
          setPaymentTerms((prev) => [...prev, response.data]);
          addToast({ type: "success", title: tToast("success"), description: tToast("createSuccess"), duration: 5000 });
          setDrawerOpen(false);
        } else {
          addToast({ type: "error", title: tToast("error"), description: response?.message || tToast("createError"), duration: 5000 });
        }
      } else {
        const payload = {
          ...formData,
          active: !!formData.active,
          is_credit_card: !!formData.is_credit_card,
          is_online_payment: !!formData.is_online_payment,
        };
        response = await createPaymentMethod(payload);
        if (response && response.status && response.data) {
          setPaymentMethods((prev) => [...prev, response.data]);
          addToast({ type: "success", title: tToast("success"), description: tToast("createSuccess"), duration: 5000 });
          setDrawerOpen(false);
        } else {
          addToast({ type: "error", title: tToast("error"), description: response?.message || tToast("createError"), duration: 5000 });
        }
      }
    } catch (error) {
      addToast({ type: "error", title: tToast("error"), description: error.message || tToast("createError"), duration: 5000 });
    }
  };

  return (
    <Box className="p-4">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <CustomTabs
            value={tab}
            onChange={handleChange}
            aria-label="payments tabs"
            sx={{
              direction: isRTL ? "rtl" : "ltr",
            }}
          >
          <Tab label={t("paymentTerms")} />
          <Tab label={t("paymentMethods")} />
        </CustomTabs>
      </Box>
      <TabPanel value={tab} index={0}>
        <Table
          data={paymentTerms}
          columns={paymentTermsColumns}
          loading={loading}
          tableId="paymentTerms"
          customActions={paymentTermsActions.customActions}
          onCustomAction={paymentTermsActions.onCustomAction}
          onAdd={() => handleAdd("paymentTerm")}
          onExportExcel={handleExportExcel}
          onExportPdf={handleExportPdf}
          onPrint={handlePrint}
          onRefresh={handleRefresh}
          onImportExcel={handleImportExcel}
          onDelete={async (row) => {
            try {
              await deletePaymentTerm(row.id);
              setPaymentTerms((prev) => prev.filter((r) => r.id !== row.id));
              addToast({
                type: "success",
                title: tToast("success"),
                description: tToast("deleteSuccess"),
                duration: 5000,
              });
            } catch (error) {
              addToast({
                type: "error",
                title: tToast("error"),
                description: error.message || tToast("deleteError"),
                duration: 5000,
              });
            }
          }}
        />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <Table
          data={paymentMethods}
          columns={paymentMethodsColumns}
          loading={loading}
          tableId="paymentMethods"
          customActions={paymentMethodsActions.customActions}
          onCustomAction={paymentMethodsActions.onCustomAction}
          onAdd={() => handleAdd("paymentMethod")}
          onExportExcel={handleExportExcel}
          onExportPdf={handleExportPdf}
          onPrint={handlePrint}
          onRefresh={handleRefresh}
          onImportExcel={handleImportExcel}
          onDelete={async (row) => {
            try {
              await deletePaymentMethod(row.id);
              setPaymentMethods((prev) => prev.filter((r) => r.id !== row.id));
              addToast({
                type: "success",
                title: tToast("success"),
                description: tToast("deleteSuccess"),
                duration: 5000,
              });
            } catch (error) {
              addToast({
                type: "error",
                title: tToast("error"),
                description: error.message || tToast("deleteError"),
                duration: 5000,
              });
            }
          }}
        />
      </TabPanel>
      <PaymentDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        type={drawerType}
        isEdit={drawerEdit}
        initialData={drawerFormData}
        onSave={(row) => {
          if (drawerType === "paymentTerm") {
            setPaymentTerms((prev) => {
              if (drawerEdit) {
                return prev.map((r) => r.id === row.id ? row : r);
              } else {
                return [...prev, row];
              }
            });
          } else {
            setPaymentMethods((prev) => {
              if (drawerEdit) {
                return prev.map((r) => r.id === row.id ? row : r);
              } else {
                return [...prev, row];
              }
            });
          }
          // Don't close the drawer - let user continue editing
          // setDrawerOpen(false); // Removed this line
        }}
        onSaveAndNew={(row) => {
          if (drawerType === "paymentTerm") {
            setPaymentTerms((prev) => [...prev, row]);
          } else {
            setPaymentMethods((prev) => [...prev, row]);
          }
        }}
        onSaveAndClose={(row) => {
          if (drawerType === "paymentTerm") {
            setPaymentTerms((prev) => [...prev, row]);
          } else {
            setPaymentMethods((prev) => [...prev, row]);
          }
          setDrawerOpen(false);
        }}
      />
      <PreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        row={previewRow}
        columns={tab === 0 ? paymentTermsColumns : paymentMethodsColumns}
      />
    </Box>
  );
} 