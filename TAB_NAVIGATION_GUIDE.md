# Tab Navigation System for Customer Drawer

This document explains how to implement and use the tab navigation system that allows users to navigate between form fields using the Tab key, even across different accordion sections.

## Overview

The tab navigation system provides:
- **Keyboard-based navigation** between form fields using Tab/Shift+Tab
- **Automatic accordion expansion** when tabbing to fields in collapsed sections
- **Visual indicators** showing when tab navigation is active
- **Toggle functionality** to enable/disable tab navigation

## How It Works

### 1. Core Components

#### `useTabNavigation` Hook
Located in `hooks/useTabNavigation.js`, this hook manages:
- Field registration and unregistration
- Tab key handling
- Accordion expansion logic
- Field focus management

#### `TabNavigableField` Component
Located in `components/ui/TabNavigableField.jsx`, this wrapper component:
- Registers fields with the navigation system
- Handles tab key events
- Maintains field references

#### `TabNavigationHelp` Component
Located in `components/ui/TabNavigationHelp.jsx`, this provides:
- Visual indicator when tab navigation is active
- Help text with keyboard shortcuts
- Toggle functionality

### 2. Implementation in Customer Drawer

The system is integrated into the CustomerDrawer component with:

```javascript
// Initialize tab navigation
const tabNavigation = useTabNavigation(expandedSections, setExpandedSections);
const [tabNavigationEnabled, setTabNavigationEnabled] = useState(false);

// Handle keyboard shortcuts
useEffect(() => {
  const handleKeyDown = (event) => {
    // Ctrl/Cmd + Shift + K to toggle tab navigation (avoiding browser shortcuts)
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'K') {
      event.preventDefault();
      setTabNavigationEnabled(prev => !prev);
    }
    
    // Only handle tab navigation if enabled
    if (tabNavigationEnabled && event.key === 'Tab') {
      tabNavigation.handleTabKey(event);
    }
  };

  if (isOpen) {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }
}, [isOpen, tabNavigationEnabled, tabNavigation]);
```

### 3. Field Integration

Each form field is wrapped with `TabNavigableField` when tab navigation is enabled:

```javascript
// Helper function to conditionally wrap fields
const wrapWithTabNavigation = (fieldId, children) => {
  if (!tabNavigationEnabled) {
    return children;
  }
  
  return (
    <TabNavigableField
      fieldId={fieldId}
      sectionId={sectionId}
      onRegister={tabNavigation?.registerField}
      onUnregister={tabNavigation?.unregisterField}
      onTabKey={tabNavigation?.handleTabKey}
    >
      {children}
    </TabNavigableField>
  );
};

// Usage in form fields
{wrapWithTabNavigation("first_name",
  <RTLTextField
    fullWidth
    value={formData?.first_name || ""}
    onChange={handleFieldChange("first_name")}
    required
  />
)}
```

## Usage Instructions

### For End Users

1. **Enable Tab Navigation**: Press `Ctrl+Shift+K` (or `Cmd+Shift+K` on Mac) to toggle tab navigation
2. **Navigate Fields**: Use `Tab` to move to the next field, `Shift+Tab` to move to the previous field
3. **Visual Feedback**: Look for the "Tab Navigation Active" indicator in the drawer title
4. **Help Panel**: Click the keyboard icon in the bottom-right corner for help

### For Developers

#### Adding Tab Navigation to New Sections

1. **Import the hook and component**:
```javascript
import { useTabNavigation } from "@/hooks/useTabNavigation";
import TabNavigableField from "@/components/ui/TabNavigableField";
```

2. **Add props to your section component**:
```javascript
const YourSection = ({ 
  // ... other props
  tabNavigation,
  sectionId,
  tabNavigationEnabled = false,
}) => {
```

3. **Create the wrapper function**:
```javascript
const wrapWithTabNavigation = (fieldId, children) => {
  if (!tabNavigationEnabled) {
    return children;
  }
  
  return (
    <TabNavigableField
      fieldId={fieldId}
      sectionId={sectionId}
      onRegister={tabNavigation?.registerField}
      onUnregister={tabNavigation?.unregisterField}
      onTabKey={tabNavigation?.handleTabKey}
    >
      {children}
    </TabNavigableField>
  );
};
```

4. **Wrap your form fields**:
```javascript
{wrapWithTabNavigation("field_id",
  <RTLTextField
    fullWidth
    value={formData?.field_name || ""}
    onChange={handleFieldChange("field_name")}
  />
)}
```

5. **Pass props from parent component**:
```javascript
<YourSection
  // ... other props
  tabNavigation={tabNavigation}
  sectionId="yourSectionId"
  tabNavigationEnabled={tabNavigationEnabled}
/>
```

#### Supported Field Types

The system works with:
- Text inputs (`RTLTextField`)
- Select dropdowns
- Autocomplete components
- Number inputs
- Any focusable form element

#### Field ID Naming Convention

Use descriptive field IDs that match your form data structure:
- `first_name`
- `billing_address_line1`
- `customer_group_id`
- `phone1`

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+K` / `Cmd+Shift+K` | Toggle tab navigation |
| `Tab` | Move to next field |
| `Shift+Tab` | Move to previous field |

## Features

### Automatic Accordion Expansion
When tabbing to a field in a collapsed accordion section, the system automatically expands the accordion before focusing the field.

### Field Ordering
Fields are ordered based on their natural position in the DOM (top-to-bottom, left-to-right).

### Visual Feedback
- "Tab Navigation Active" indicator in drawer title
- Help panel with keyboard shortcuts
- Visual styling for active state

### Performance Optimizations
- Conditional rendering of tab navigation wrappers
- Efficient field registration/unregistration
- Minimal re-renders through proper memoization

## Troubleshooting

### Common Issues

1. **Fields not responding to Tab key**:
   - Ensure tab navigation is enabled (`Ctrl+Shift+K`)
   - Check that fields are wrapped with `TabNavigableField`
   - Verify field IDs are unique

2. **Accordion not expanding**:
   - Ensure `sectionId` is passed correctly
   - Check that `expandedSections` state is properly managed

3. **Navigation order incorrect**:
   - Fields are ordered by DOM position
   - Ensure proper grid layout and field positioning

### Debug Tips

1. **Check field registration**:
```javascript
console.log(tabNavigation.getAllFields());
```

2. **Verify current field**:
```javascript
console.log(tabNavigation.getCurrentField());
```

3. **Test field focus**:
```javascript
tabNavigation.focusField("field_id");
```

## Future Enhancements

Potential improvements for the tab navigation system:

1. **Custom field ordering**: Allow manual specification of field order
2. **Skip fields**: Add ability to skip certain fields during navigation
3. **Section-based navigation**: Navigate between sections first, then fields
4. **Visual field highlighting**: Highlight the current field during navigation
5. **Accessibility improvements**: Better screen reader support
6. **Mobile support**: Touch-based navigation for mobile devices

## Files Modified

- `hooks/useTabNavigation.js` - Core navigation logic
- `components/ui/TabNavigableField.jsx` - Field wrapper component
- `components/ui/TabNavigationHelp.jsx` - Help component
- `components/ui/drawers/CustomerDrawer.jsx` - Main integration
- `components/ui/drawers/customer/PersonalInformationSection.jsx` - Example implementation

This system provides a powerful and user-friendly way to navigate complex forms with multiple accordion sections, significantly improving the user experience for data entry tasks. 