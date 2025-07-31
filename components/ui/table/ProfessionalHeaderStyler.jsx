"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { Button } from "./CustomControls";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { 
  Palette, 
  Type, 
  Bold, 
  Italic, 
  Minus, 
  Plus,
  X,
  Check
} from "lucide-react";

const ProfessionalHeaderStyler = React.memo(({
  backgroundColor,
  onBackgroundColorChange,
  fontSize,
  onFontSizeChange,
  fontStyle,
  onFontStyleChange,
  fontColor,
  onFontColorChange,
  label,
  className = ""
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempBgColor, setTempBgColor] = useState(backgroundColor);
  const [tempFontColor, setTempFontColor] = useState(fontColor);
  const [tempFontSize, setTempFontSize] = useState(fontSize);
  const [tempFontStyle, setTempFontStyle] = useState(fontStyle);
  const [activeColorPicker, setActiveColorPicker] = useState(null); // 'bg' or 'font'
  const modalRef = useRef(null);
  const { theme } = useTheme();
  const t = useTranslations();

  // Update temp values when props change
  useEffect(() => {
    setTempBgColor(backgroundColor);
  }, [backgroundColor]);

  useEffect(() => {
    setTempFontColor(fontColor);
  }, [fontColor]);

  useEffect(() => {
    setTempFontSize(fontSize);
  }, [fontSize]);

  useEffect(() => {
    setTempFontStyle(fontStyle);
  }, [fontStyle]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
        setActiveColorPicker(null);
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  // Professional color palettes with Arabic names
  const colorPalettes = {
    primary: [
      { hex: '#3B82F6', name: t('headerStyler.colors.blue') },
      { hex: '#1D4ED8', name: t('headerStyler.colors.blueDark') },
      { hex: '#1E40AF', name: t('headerStyler.colors.blueDarker') },
      { hex: '#1E3A8A', name: t('headerStyler.colors.blueDarkest') },
      { hex: '#1E293B', name: t('headerStyler.colors.slateDark') },
      { hex: '#6366F1', name: t('headerStyler.colors.indigo') },
      { hex: '#4F46E5', name: t('headerStyler.colors.indigoDark') },
      { hex: '#4338CA', name: t('headerStyler.colors.indigoDarker') },
      { hex: '#3730A3', name: t('headerStyler.colors.indigoDarkest') },
      { hex: '#312E81', name: t('headerStyler.colors.indigoDeep') },
      { hex: '#8B5CF6', name: t('headerStyler.colors.violet') },
      { hex: '#7C3AED', name: t('headerStyler.colors.violetDark') },
      { hex: '#6D28D9', name: t('headerStyler.colors.violetDarker') },
      { hex: '#5B21B6', name: t('headerStyler.colors.violetDarkest') },
      { hex: '#4C1D95', name: t('headerStyler.colors.violetDeep') },
      { hex: '#EC4899', name: t('headerStyler.colors.pink') },
      { hex: '#DB2777', name: t('headerStyler.colors.pinkDark') },
      { hex: '#BE185D', name: t('headerStyler.colors.pinkDarker') },
      { hex: '#9D174D', name: t('headerStyler.colors.pinkDarkest') },
      { hex: '#831843', name: t('headerStyler.colors.pinkDeep') }
    ],
    neutral: [
      { hex: '#F8FAFC', name: t('headerStyler.colors.slate50') },
      { hex: '#F1F5F9', name: t('headerStyler.colors.slate100') },
      { hex: '#E2E8F0', name: t('headerStyler.colors.slate200') },
      { hex: '#CBD5E1', name: t('headerStyler.colors.slate300') },
      { hex: '#94A3B8', name: t('headerStyler.colors.slate400') },
      { hex: '#64748B', name: t('headerStyler.colors.slate500') },
      { hex: '#475569', name: t('headerStyler.colors.slate600') },
      { hex: '#334155', name: t('headerStyler.colors.slate700') },
      { hex: '#1E293B', name: t('headerStyler.colors.slate800') },
      { hex: '#0F172A', name: t('headerStyler.colors.slate900') },
      { hex: '#FAFAFA', name: t('headerStyler.colors.neutral50') },
      { hex: '#F5F5F5', name: t('headerStyler.colors.neutral100') },
      { hex: '#E5E5E5', name: t('headerStyler.colors.neutral200') },
      { hex: '#D4D4D4', name: t('headerStyler.colors.neutral300') },
      { hex: '#A3A3A3', name: t('headerStyler.colors.neutral400') },
      { hex: '#737373', name: t('headerStyler.colors.neutral500') },
      { hex: '#525252', name: t('headerStyler.colors.neutral600') },
      { hex: '#404040', name: t('headerStyler.colors.neutral700') },
      { hex: '#262626', name: t('headerStyler.colors.neutral800') },
      { hex: '#171717', name: t('headerStyler.colors.neutral900') }
    ],
    accent: [
      { hex: '#10B981', name: t('headerStyler.colors.emerald') },
      { hex: '#059669', name: t('headerStyler.colors.emeraldDark') },
      { hex: '#047857', name: t('headerStyler.colors.emeraldDarker') },
      { hex: '#065F46', name: t('headerStyler.colors.emeraldDarkest') },
      { hex: '#064E3B', name: t('headerStyler.colors.emeraldDeep') },
      { hex: '#F59E0B', name: t('headerStyler.colors.amber') },
      { hex: '#D97706', name: t('headerStyler.colors.amberDark') },
      { hex: '#B45309', name: t('headerStyler.colors.amberDarker') },
      { hex: '#92400E', name: t('headerStyler.colors.amberDarkest') },
      { hex: '#78350F', name: t('headerStyler.colors.amberDeep') },
      { hex: '#EF4444', name: t('headerStyler.colors.red') },
      { hex: '#DC2626', name: t('headerStyler.colors.redDark') },
      { hex: '#B91C1C', name: t('headerStyler.colors.redDarker') },
      { hex: '#991B1B', name: t('headerStyler.colors.redDarkest') },
      { hex: '#7F1D1D', name: t('headerStyler.colors.redDeep') },
      { hex: '#06B6D4', name: t('headerStyler.colors.cyan') },
      { hex: '#0891B2', name: t('headerStyler.colors.cyanDark') },
      { hex: '#0E7490', name: t('headerStyler.colors.cyanDarker') },
      { hex: '#155E75', name: t('headerStyler.colors.cyanDarkest') },
      { hex: '#164E63', name: t('headerStyler.colors.cyanDeep') }
    ]
  };

  const handleApply = useCallback(() => {
    onBackgroundColorChange(tempBgColor);
    onFontColorChange(tempFontColor);
    onFontSizeChange(tempFontSize);
    onFontStyleChange(tempFontStyle);
    setIsModalOpen(false);
    setActiveColorPicker(null);
  }, [tempBgColor, tempFontColor, tempFontSize, tempFontStyle, onBackgroundColorChange, onFontColorChange, onFontSizeChange, onFontStyleChange]);

  const handleCancel = useCallback(() => {
    setTempBgColor(backgroundColor);
    setTempFontColor(fontColor);
    setTempFontSize(fontSize);
    setTempFontStyle(fontStyle);
    setIsModalOpen(false);
    setActiveColorPicker(null);
  }, [backgroundColor, fontColor, fontSize, fontStyle]);

  const handleColorSelect = useCallback((color, type) => {
    if (type === 'bg') {
      setTempBgColor(color);
    } else {
      setTempFontColor(color);
    }
    setActiveColorPicker(null);
  }, []);

  const handleFontSizeChange = useCallback((size) => {
    setTempFontSize(size);
  }, []);

  const handleFontStyleToggle = useCallback((style) => {
    const currentStyles = tempFontStyle.split(' ').filter(s => s);
    const hasStyle = currentStyles.includes(style);
    
    if (hasStyle) {
      const newStyles = currentStyles.filter(s => s !== style);
      setTempFontStyle(newStyles.length > 0 ? newStyles.join(' ') : 'normal');
    } else {
      const newStyles = [...currentStyles, style];
      setTempFontStyle(newStyles.join(' '));
    }
  }, [tempFontStyle]);

  const isBold = tempFontStyle.includes('bold');
  const isItalic = tempFontStyle.includes('italic');

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium mb-2 text-foreground">{label}</label>
      
      {/* Header Preview Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted transition-all duration-200 hover:shadow-sm"
        >
          <div 
            className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-sm font-medium shadow-sm"
            style={{ 
              backgroundColor: tempBgColor || (theme === 'dark' ? '#1e293b' : '#f8fafc'),
              color: tempFontColor || (theme === 'dark' ? '#e2e8f0' : '#1e293b'),
              fontSize: `${tempFontSize}px`,
              fontStyle: tempFontStyle.includes('italic') ? 'italic' : 'normal',
              fontWeight: tempFontStyle.includes('bold') ? 'bold' : 'normal'
            }}
          >
            Aa
          </div>
                     <div className="flex flex-col items-start">
             <span className="text-sm font-medium text-foreground">{t('headerStyler.headerStyle')}</span>
             <span className="text-xs text-muted-foreground">
               {tempFontSize}px • {tempFontStyle === 'normal' ? t('headerStyler.regular') : tempFontStyle}
             </span>
           </div>
          <Palette className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Professional Header Styling Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2147483648] flex items-center justify-center bg-black/50 backdrop-blur-sm" data-nextjs-scroll-focus-boundary>
          <div ref={modalRef} className="bg-background p-6 rounded-xl shadow-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Palette className="w-5 h-5 text-primary" />
                </div>
                                 <div>
                   <h3 className="text-lg font-semibold text-foreground">{t('headerStyler.title')}</h3>
                   <p className="text-sm text-muted-foreground">{t('headerStyler.subtitle')}</p>
                 </div>
              </div>
              <button
                onClick={handleCancel}
                className="rounded-full p-2 hover:bg-muted text-muted-foreground transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

                         {/* Live Preview */}
             <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border">
               <h4 className="text-sm font-medium mb-3 text-foreground">{t('headerStyler.livePreview')}</h4>
               <div 
                 className="p-4 rounded-lg border border-border text-center transition-all duration-200"
                 style={{ 
                   backgroundColor: tempBgColor || (theme === 'dark' ? '#1e293b' : '#f8fafc'),
                   color: tempFontColor || (theme === 'dark' ? '#e2e8f0' : '#1e293b'),
                   fontSize: `${tempFontSize}px`,
                   fontStyle: tempFontStyle.includes('italic') ? 'italic' : 'normal',
                   fontWeight: tempFontStyle.includes('bold') ? 'bold' : 'normal'
                 }}
               >
                 {t('headerStyler.headerTextPreview')}
               </div>
             </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Color Selection */}
              <div className="space-y-4">
                                 <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                   <Palette className="w-4 h-4" />
                   {t('headerStyler.colorSelection')}
                 </h4>

                {/* Background Color */}
                <div className="space-y-3">
                                     <div className="flex items-center justify-between">
                     <label className="text-sm font-medium text-foreground">{t('headerStyler.backgroundColor')}</label>
                     <button
                       onClick={() => setActiveColorPicker(activeColorPicker === 'bg' ? null : 'bg')}
                       className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                     >
                       {activeColorPicker === 'bg' ? t('headerStyler.closePicker') : t('headerStyler.openPicker')}
                     </button>
                   </div>
                  
                  {activeColorPicker === 'bg' && (
                    <div className="p-4 bg-muted/30 rounded-lg border border-border">
                      <HexColorPicker 
                        color={tempBgColor} 
                        onChange={setTempBgColor}
                        className="w-full"
                      />
                      <div className="mt-3">
                        <HexColorInput
                          color={tempBgColor}
                          onChange={setTempBgColor}
                          className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  )}

                                     {/* Color Palettes for Background */}
                   <div className="space-y-2">
                     <span className="text-xs text-muted-foreground">{t('headerStyler.quickColors')}</span>
                     {Object.entries(colorPalettes).map(([paletteName, colors]) => (
                       <div key={paletteName} className="flex gap-1">
                         {colors.slice(0, 8).map((colorObj) => (
                           <button
                             key={colorObj.hex}
                             onClick={() => handleColorSelect(colorObj.hex, 'bg')}
                             className={`w-6 h-6 rounded border transition-all duration-200 hover:scale-110 shadow-sm relative ${
                               tempBgColor === colorObj.hex 
                                 ? 'border-2 border-primary ring-2 ring-primary/20 scale-110' 
                                 : 'border-border hover:border-primary/50'
                             }`}
                             style={{ backgroundColor: colorObj.hex }}
                             title={`${colorObj.name} (${colorObj.hex})`}
                           >
                             {tempBgColor === colorObj.hex && (
                               <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
                               </div>
                             )}
                           </button>
                         ))}
                       </div>
                     ))}
                   </div>
                </div>

                {/* Font Color */}
                <div className="space-y-3">
                                     <div className="flex items-center justify-between">
                     <label className="text-sm font-medium text-foreground">{t('headerStyler.fontColor')}</label>
                     <button
                       onClick={() => setActiveColorPicker(activeColorPicker === 'font' ? null : 'font')}
                       className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                     >
                       {activeColorPicker === 'font' ? t('headerStyler.closePicker') : t('headerStyler.openPicker')}
                     </button>
                   </div>
                  
                  {activeColorPicker === 'font' && (
                    <div className="p-4 bg-muted/30 rounded-lg border border-border">
                      <HexColorPicker 
                        color={tempFontColor} 
                        onChange={setTempFontColor}
                        className="w-full"
                      />
                      <div className="mt-3">
                        <HexColorInput
                          color={tempFontColor}
                          onChange={setTempFontColor}
                          className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  )}

                                     {/* Color Palettes for Font */}
                   <div className="space-y-2">
                     <span className="text-xs text-muted-foreground">{t('headerStyler.quickColors')}</span>
                     {Object.entries(colorPalettes).map(([paletteName, colors]) => (
                       <div key={`font-${paletteName}`} className="flex gap-1">
                         {colors.slice(0, 8).map((colorObj) => (
                           <button
                             key={`font-${colorObj.hex}`}
                             onClick={() => handleColorSelect(colorObj.hex, 'font')}
                             className={`w-6 h-6 rounded border transition-all duration-200 hover:scale-110 shadow-sm relative ${
                               tempFontColor === colorObj.hex 
                                 ? 'border-2 border-primary ring-2 ring-primary/20 scale-110' 
                                 : 'border-border hover:border-primary/50'
                             }`}
                             style={{ backgroundColor: colorObj.hex }}
                             title={`${colorObj.name} (${colorObj.hex})`}
                           >
                             {tempFontColor === colorObj.hex && (
                               <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
                               </div>
                             )}
                           </button>
                         ))}
                       </div>
                     ))}
                   </div>
                </div>
              </div>

              {/* Typography Controls */}
              <div className="space-y-4">
                                 <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                   <Type className="w-4 h-4" />
                   {t('headerStyler.typography')}
                 </h4>

                {/* Font Size */}
                <div className="space-y-3">
                                     <label className="text-sm font-medium text-foreground">{t('headerStyler.fontSize')}</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleFontSizeChange(Math.max(10, tempFontSize - 1))}
                      className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                      disabled={tempFontSize <= 10}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1">
                      <input
                        type="range"
                        min="10"
                        max="32"
                        value={tempFontSize}
                        onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <button
                      onClick={() => handleFontSizeChange(Math.min(32, tempFontSize + 1))}
                      className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                      disabled={tempFontSize >= 32}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium text-foreground w-12 text-center">
                      {tempFontSize}px
                    </span>
                  </div>
                  
                  {/* Quick Size Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {[12, 14, 16, 18, 20, 24].map((size) => (
                      <button
                        key={size}
                        onClick={() => handleFontSizeChange(size)}
                        className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
                          tempFontSize === size 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'bg-background text-foreground border-border hover:bg-muted'
                        }`}
                      >
                        {size}px
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Style */}
                <div className="space-y-3">
                                     <label className="text-sm font-medium text-foreground">{t('headerStyler.fontStyle')}</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFontStyleToggle('bold')}
                      className={`p-3 rounded-lg border transition-colors flex items-center gap-2 ${
                        isBold 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-background text-foreground border-border hover:bg-muted'
                      }`}
                    >
                      <Bold className="w-4 h-4" />
                                             <span className="text-xs">{t('headerStyler.bold')}</span>
                    </button>
                    <button
                      onClick={() => handleFontStyleToggle('italic')}
                      className={`p-3 rounded-lg border transition-colors flex items-center gap-2 ${
                        isItalic 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-background text-foreground border-border hover:bg-muted'
                      }`}
                    >
                      <Italic className="w-4 h-4" />
                                             <span className="text-xs">{t('headerStyler.italic')}</span>
                    </button>
                  </div>
                </div>

                                 {/* Style Preview */}
                 <div className="p-3 bg-muted/30 rounded-lg border border-border">
                   <span className="text-xs text-muted-foreground block mb-2">{t('headerStyler.stylePreview')}</span>
                   <div 
                     className="text-center p-2 rounded border border-border bg-background"
                     style={{ 
                       fontSize: `${tempFontSize}px`,
                       fontStyle: isItalic ? 'italic' : 'normal',
                       fontWeight: isBold ? 'bold' : 'normal'
                     }}
                   >
                     {t('headerStyler.sampleText')}
                   </div>
                 </div>
              </div>
            </div>

                         {/* Modal Footer */}
             <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
               <Button variant="outline" size="sm" onClick={handleCancel}>
                 {t('headerStyler.cancel')}
               </Button>
               <Button variant="default" size="sm" onClick={handleApply}>
                 <Check className="w-4 h-4 mr-2" />
                 {t('headerStyler.applyChanges')}
               </Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
});

ProfessionalHeaderStyler.displayName = "ProfessionalHeaderStyler";

export default ProfessionalHeaderStyler; 