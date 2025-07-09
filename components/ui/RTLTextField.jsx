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
  multiline,
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
      multiline={multiline}
      InputProps={updatedInputProps}
      sx={{
        ...(isRTL && {
          direction: "rtl",
          fontFamily: "var(--font-cairo), system-ui, sans-serif",
          "& .MuiInputLabel-root": {
            transformOrigin: "top right",
            left: "inherit",
            right: 0,
            fontFamily: "var(--font-cairo), system-ui, sans-serif",
          },
          "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
            transform: "translate(-14px, 14px) scale(1)",
          },
          "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
            transform: "translate(-14px, -9px) scale(0.75)",
          },
          "& .MuiOutlinedInput-input": {
            textAlign: "right",
            fontFamily: "var(--font-cairo), system-ui, sans-serif",
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
            fontFamily: "var(--font-cairo), system-ui, sans-serif",
          },
          ...(multiline && {
            "& .MuiInputBase-input": {
              textAlign: "right",
              direction: "rtl",
              fontFamily: "var(--font-cairo), system-ui, sans-serif",
            },
            "& .MuiInputBase-input::placeholder": {
              textAlign: "right",
              direction: "rtl",
              paddingRight: "8px",
              paddingLeft: "0px",
              fontFamily: "var(--font-cairo), system-ui, sans-serif",
            },
            "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
              transform: "translate(-14px, 14px) scale(1)",
              right: "0px",
              left: "auto",
            },
            "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
              transform: "translate(-14px, -9px) scale(0.75)",
              right: "0px",
              left: "auto",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              textAlign: "right",
            },
            "& .MuiOutlinedInput-root": {
              direction: "rtl",
            },
          }),
        }),
      }}
      {...props}
    />
  );
};

export default RTLTextField;
