import React from 'react';
import { Button } from './button.tsx';
import { 
  PlusIcon, 
  FileSpreadsheetIcon, 
  FileTextIcon, 
  PrinterIcon, 
  
  RefreshCwIcon 
} from 'lucide-react';

export function ActionToolbar({ 
  onAdd, 
  onExportExcel, 
  onExportPdf, 
  onPrint, 

  onRefresh,
  className = ""
}) {
  return (
    <div className={`flex flex-wrap items-center gap-2 mb-0 ${className}`}>
      {onAdd && (
        <Button 
          onClick={onAdd}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-sm h-8"
        >
          <PlusIcon size={16} />
          <span>Add New</span>
        </Button>
      )}
      
      {onExportExcel && (
        <Button 
          onClick={onExportExcel}
          className="flex items-center gap-1 bg-green-700 hover:bg-green-800 text-white border border-gray-300 px-3 py-2 text-sm h-8"
        >
          <FileSpreadsheetIcon size={16} />
          <span>Export Excel</span>
        </Button>
      )}
      
      {onExportPdf && (
        <Button 
          onClick={onExportPdf}
          className="flex items-center gap-1 bg-red-700 hover:bg-red-800 text-white border border-gray-300 px-3 py-2 text-sm h-8"
        >
          <FileTextIcon size={16} />
          <span>Export PDF</span>
        </Button>
      )}
      
      {onPrint && (
        <Button 
          onClick={onPrint}
          className="flex items-center gap-1 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 px-3 py-2 text-sm h-8"
        >
          <PrinterIcon size={16} />
          <span>Print</span>
        </Button>
      )}
      
      
      {onRefresh && (
        <Button 
          onClick={onRefresh}
          className="flex items-center gap-1 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 px-3 py-2 text-sm h-8"
        >
          <RefreshCwIcon size={16} />
          <span>Refresh</span>
        </Button>
      )}
    </div>
  );
} 