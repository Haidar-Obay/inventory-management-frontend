"use client";

import React from "react";

const HelpGridRow = ({ row, columns, formatValue }) => {
  return (
    <tr className="hover:bg-muted/50">
      {columns.map((column) => (
        <td key={column.key} className="px-4 py-3 text-sm text-foreground">
          {formatValue(row[column.key], column)}
        </td>
      ))}
    </tr>
  );
};

export default HelpGridRow;
