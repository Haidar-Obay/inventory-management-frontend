import { useTranslations } from "next-intl";

export const useCustomActions = ({
  onEdit,
  onDelete,
  onDeleteConfirm,
  onPreview,
  onPreviewConfirm,
  additionalActions = [],
}) => {
  const t = useTranslations("table");

  const defaultActions = [
    {
      id: "preview",
      label: t("previewLabel") || "Preview",
      icon: `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
             <circle cx="12" cy="12" r="3"></circle>`,
      iconClassName: "text-blue-600",
      primary: true,
      action: onPreviewConfirm || onPreview, // Use confirmation handler if provided, otherwise direct preview
    },
    {
      id: "edit",
      label: t("editLabel") || "Edit",
      icon: `<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
             <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>`,
      iconClassName: "text-blue-600",
      primary: true,
      action: onEdit,
    },
    {
      id: "delete",
      label: t("deleteLabel") || "Delete",
      icon: `<path d="M3 6h18"></path>
             <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>`,
      iconClassName: "text-red-600",
      dangerous: true,
      action: onDeleteConfirm || onDelete, // Use confirmation handler if provided, otherwise direct delete
    },
  ];

  const allActions = [...defaultActions, ...additionalActions];

  const handleCustomAction = (action, row) => {
    if (action.action) {
      action.action(row);
    }
  };

  return {
    customActions: allActions,
    onCustomAction: handleCustomAction,
  };
}; 