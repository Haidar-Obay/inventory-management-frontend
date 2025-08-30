"use client";

import { useState, useEffect, Suspense } from "react";
import { Tabs, Tab, Box, Typography, CircularProgress } from "@mui/material";
import CustomTabs from "@/components/ui/CustomTabs";
import { useTranslations, useLocale } from "next-intl";
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
function UserManagementPageLoading() {
  const t = useTranslations("settings");
  return (
    <div className="flex justify-center items-center min-h-screen">
      <CircularProgress />
      <span className="ml-2">{t("loading")}</span>
    </div>
  );
}

// Main component wrapped with Suspense
export default function UserManagementPageWrapper() {
  return (
    <Suspense fallback={<UserManagementPageLoading />}>
      <UserManagementPage />
    </Suspense>
  );
}

// The actual component that uses useSearchParams
function UserManagementPage() {
  const t = useTranslations("settings");
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [value, setValue] = useState(0);

  // Initialize tab value from URL or localStorage
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab !== null) {
      const tabValue = parseInt(tab);
      setValue(tabValue);
      if (typeof window !== 'undefined') {
        localStorage.setItem("userManagementLastTab", tabValue.toString());
      }
    } else {
      // If no URL parameter, try to get from localStorage
      if (typeof window !== 'undefined') {
        const savedTab = localStorage.getItem("userManagementLastTab");
        if (savedTab) {
          const tabValue = parseInt(savedTab);
          setValue(tabValue);
          // Update URL to match localStorage
          const params = new URLSearchParams(searchParams.toString());
          params.set("tab", tabValue.toString());
          router.push(`?${params.toString()}`);
        }
      }
    }
  }, [searchParams, router]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem("userManagementLastTab", newValue.toString());
    }
    // Update URL with new tab value
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newValue.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="p-4">
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <CustomTabs
            value={value}
            onChange={handleChange}
            aria-label="user management tabs"
            sx={{
              direction: isRTL ? "rtl" : "ltr",
            }}
          >
            <Tab label={t("userManagement")} />
            <Tab label={t("permission")} />
            <Tab label={t("roleManagement")} />
          </CustomTabs>
        </Box>

        {/* User Management Tab */}
        <TabPanel value={value} index={0}>
          <Box className="p-0">
            <Typography variant="h6" className="mb-4">
              {t("userManagement")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage system users, their accounts, and basic information.
            </Typography>
          </Box>
        </TabPanel>

        {/* Permission Tab */}
        <TabPanel value={value} index={1}>
          <Box className="p-0">
            <Typography variant="h6" className="mb-4">
              {t("permission")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Configure and manage user permissions and access rights.
            </Typography>
          </Box>
        </TabPanel>

        {/* Role Management Tab */}
        <TabPanel value={value} index={2}>
          <Box className="p-0">
            <Typography variant="h6" className="mb-4">
              {t("roleManagement")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create, edit, and manage user roles and their associated permissions.
            </Typography>
          </Box>
        </TabPanel>
      </Box>
    </div>
  );
}
