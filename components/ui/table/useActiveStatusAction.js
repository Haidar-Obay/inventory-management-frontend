import { useTranslations } from "next-intl";
import { ActiveStatusAction } from "./ActiveStatusAction";

export const useActiveStatusAction = ({
  onToggleActive,
  editFunction,
  onSuccess,
  onError,
  isRTL = false,
}) => {
  const t = useTranslations("table");

  const createActiveStatusAction = (row) => {
    return ActiveStatusAction({
      row,
      onToggleActive,
      editFunction,
      onSuccess,
      onError,
      isRTL,
    });
  };

  const handleToggleActive = (row) => {
    if (onToggleActive) {
      onToggleActive(row);
    }
  };

  return {
    createActiveStatusAction,
    handleToggleActive,
  };
};

export default useActiveStatusAction; 