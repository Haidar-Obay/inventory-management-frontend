/**
 * Custom error handlers for database operations
 */

export const handleDatabaseError = (error) => {
  // Check if it's a foreign key violation
  if (error.code === '23503' || error.message.includes('foreign key constraint')) {
    return {
      type: 'foreign_key_violation',
      title: 'errors.foreignKey.title',
      message: 'errors.foreignKey.message',
      details: extractForeignKeyDetails(error.message),
      severity: 'warning'
    };
  }

  // Check if it's a unique constraint violation
  if (error.code === '23505' || error.message.includes('duplicate key')) {
    return {
      type: 'unique_constraint_violation',
      title: 'errors.duplicate.title',
      message: 'errors.duplicate.message',
      severity: 'error'
    };
  }

  // Generic database error
  return {
    type: 'database_error',
    title: 'errors.database.title',
    message: 'errors.database.message',
    details: error.message,
    severity: 'error'
  };
};

/**
 * Extract meaningful details from foreign key error messages
 */
const extractForeignKeyDetails = (errorMessage) => {
  // Extract table names from the error message
  const tableMatch = errorMessage.match(/violates foreign key constraint "([^"]+)" on table "([^"]+)"/);
  
  if (tableMatch) {
    const constraintName = tableMatch[1];
    const tableName = tableMatch[2];
    
    // Map table names to user-friendly names
    const tableNames = {
      'addresses': 'Addresses',
      'customers': 'Customers',
      'items': 'Items',
      'orders': 'Orders',
      'invoices': 'Invoices',
      'countries': 'Countries',
      'cities': 'Cities',
      'zones': 'Zones',
      'districts': 'Districts',
      'customer_groups': 'Customer Groups',
      'salesmen': 'Salesmen',
      'payment_terms': 'Payment Terms',
      'payment_methods': 'Payment Methods',
      'product_lines': 'Product Lines',
      'categories': 'Categories',
      'brands': 'Brands',
      'projects': 'Projects',
      'cost_centers': 'Cost Centers',
      'departments': 'Departments',
      'trades': 'Trades',
      'company_codes': 'Company Codes',
      'jobs': 'Jobs'
    };

    const friendlyTableName = tableNames[tableName] || tableName;
    
    return {
      constraintName,
      tableName: friendlyTableName,
      message: `errors.foreignKey.details`
    };
  }

  return {
    message: 'errors.foreignKey.fallback'
  };
};

/**
 * Get user-friendly error message based on error type
 */
export const getErrorMessage = (error) => {
  const handledError = handleDatabaseError(error);
  
  switch (handledError.type) {
    case 'foreign_key_violation':
      return {
        title: handledError.title,
        message: handledError.message,
        details: handledError.details?.message || handledError.details,
        severity: handledError.severity,
        icon: '⚠️',
        actions: [
          {
            label: 'View Related Records',
            action: 'view_related',
            variant: 'outline'
          },
          {
            label: 'Cancel',
            action: 'cancel',
            variant: 'ghost'
          }
        ]
      };
      
    case 'unique_constraint_violation':
      return {
        title: handledError.title,
        message: handledError.message,
        severity: handledError.severity,
        icon: '❌',
        actions: [
          {
            label: 'OK',
            action: 'close',
            variant: 'default'
          }
        ]
      };
      
    default:
      return {
        title: handledError.title,
        message: handledError.message,
        details: handledError.details,
        severity: handledError.severity,
        icon: '💥',
        actions: [
          {
            label: 'OK',
            action: 'close',
            variant: 'default'
          }
        ]
      };
  }
}; 