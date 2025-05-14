// Update the import path to match the correct export
import { useToast as useToastOriginal } from "@/components/ui/use-toast"

export const useToast = () => {
  return useToastOriginal()
}
