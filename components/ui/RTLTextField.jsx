import React from "react";
import { TextField } from "@mui/material";
import { useLocale } from "next-intl";

const RTLTextField = ({
  InputProps,
  label,
  fullWidth = true,
  variant = "outlined",
  size = "small",
  sectionListRef,
  areAllSectionsEmpty,
  ...props
}) => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const updatedInputProps = { ...InputProps };
  if (isRTL && updatedInputProps.startAdornment) {
    updatedInputProps.endAdornment = updatedInputProps.startAdornment;
    updatedInputProps.startAdornment = null;
  }

  return (
    <TextField
      label={label}
      fullWidth={fullWidth}
      variant={variant}
      size={size}
      InputProps={updatedInputProps}
      sx={{
        ...(isRTL && {
          direction: "rtl",
          "& .MuiInputLabel-root": {
            transformOrigin: "top right",
            left: "inherit",
            right: 0,
          },
          "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
            transform: "translate(-14px, 14px) scale(1)",
          },
          "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
            transform: "translate(-14px, -9px) scale(0.75)",
          },
          "& .MuiOutlinedInput-input": {
            textAlign: "right",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            textAlign: "right",
          },
          "& .MuiInputBase-adornedEnd": {
            paddingLeft: "12px",
          },
          "& .MuiInputBase-input::placeholder": {
            textAlign: "right",
            paddingRight: "8px",
            paddingLeft: "0px",
          },
        }),
      }}
      {...props}
    />
  );
};

export default RTLTextField;
