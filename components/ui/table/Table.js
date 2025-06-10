export function Table({
  data = [],
  columns = [],
  onEdit,
  onDelete,
  onAdd = () => {},
  onExportExcel = () => {},
  onImportExcel = () => {},
  onExportPdf = () => {},
  onPrint = () => {},
  onRefresh = () => {},
  enableCellEditing = false,
  loading = false,
}) {
  const {
    visibleColumns,
    setVisibleColumns,
    getVisibleColumns,
    handleColumnVisibilityToggle,
    resetColumnVisibility,
  } = useTableLogic({
    data,
    columns,
    onEdit,
    onDelete,
    onAdd,
    onExportExcel,
    onImportExcel,
    onExportPdf,
    onPrint,
    onRefresh,
    enableCellEditing,
    loading,
  });

  const renderColumnVisibilityModal = () => {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Column Visibility</h3>
          <button
            onClick={resetColumnVisibility}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Reset to Default
          </button>
        </div>
        <div className="space-y-2">
          {columns.map((column) => (
            <div key={column.key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`column-${column.key}`}
                checked={visibleColumns[column.key]}
                onChange={() => handleColumnVisibilityToggle(column.key)}
                className="rounded border-gray-300"
              />
              <label htmlFor={`column-${column.key}`} className="text-sm">
                {column.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTableHeader = () => {
    return (
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          {getVisibleColumns().map((column) => (
            <th
              key={column.key}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              style={{ width: columnWidths[column.key] }}
            >
              <div className="flex items-center justify-between">
                <span>{column.label}</span>
                <div className="flex items-center space-x-2">
                  {column.sortable && (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      {sortConfig.key === column.key ? (
                        sortConfig.direction === "asc" ? (
                          <ChevronUpIcon className="h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4" />
                        )
                      ) : (
                        <ChevronUpDownIcon className="h-4 w-4" />
                      )}
                    </button>
                  )}
                  <div
                    className="w-1 h-full cursor-col-resize hover:bg-blue-500"
                    onMouseDown={(e) => handleResizeStart(e, column.key)}
                  />
                </div>
              </div>
            </th>
          ))}
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
    );
  };

  const renderTableBody = () => {
    return (
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
        {paginatedData.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
            {getVisibleColumns().map((column) => (
              <td
                key={column.key}
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
              >
                {renderCell(row, column)}
              </td>
            ))}
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              {renderActions(row)}
            </td>
          </tr>
        ))}
      </tbody>
    );
  };
} 