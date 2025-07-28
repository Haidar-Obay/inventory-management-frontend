import { useCallback, useRef } from 'react';

export const useTabNavigation = (expandedSections, setExpandedSections) => {
  const fieldRefs = useRef(new Map());

  // Register a field with the navigation system (for accordion expansion)
  const registerField = useCallback((fieldId, ref, sectionId = null) => {
    fieldRefs.current.set(fieldId, { ref, sectionId });
  }, []);

  // Unregister a field
  const unregisterField = useCallback((fieldId) => {
    fieldRefs.current.delete(fieldId);
  }, []);

  // Handle field focus to expand accordion if needed
  const handleFieldFocus = useCallback((fieldId) => {
    const fieldData = fieldRefs.current.get(fieldId);
    if (fieldData?.sectionId && !expandedSections[fieldData.sectionId]) {
      setExpandedSections(prev => ({
        ...prev,
        [fieldData.sectionId]: true
      }));
    }
  }, [expandedSections, setExpandedSections]);

  return {
    registerField,
    unregisterField,
    handleFieldFocus
  };
}; 