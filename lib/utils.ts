import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Maps entity types to their correct plural form for file naming
 * @param {string} type - The singular entity type
 * @returns {string} - The correct plural form for file naming
 */
export const getPluralFileName = (type: string): string => {
  const pluralMap: Record<string, string> = {
    // Address Codes
    country: "countries",
    city: "cities",
    district: "districts",
    zone: "zones",
    
    // Items
    productLine: "product-lines",
    category: "categories",
    brand: "brands",
    item: "items",
    
    // Customer
    customerGroup: "customer-groups",
    salesman: "salesmen",
    customer: "customers",
    
    // General Files
    businessType: "business-types",
    salesChannel: "sales-channels",
    distributionChannel: "distribution-channels",
    mediaChannel: "media-channels",
    
    // Sections
    project: "projects",
    costCenter: "cost-centers",
    department: "departments",
    trade: "trades",
    companyCode: "company-codes",
    job: "jobs",
  };
  
  return pluralMap[type] || `${type}s`;
};
