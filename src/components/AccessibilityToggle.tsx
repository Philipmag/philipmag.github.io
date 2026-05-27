import React, { useState } from 'react';
import { useAccessibility, type TextSize } from '@/contexts/AccessibilityContext';
import { Button } from '@/components/ui/button';
import { 
  Accessibility, 
  X, 
  Plus, 
  Minus,
  Contrast,
  RotateCcw
} from 'lucide-react';

export const AccessibilityToggle: React.FC = () => {
  const { settings, setTextSize, toggleContrastMode, resetSettings } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  const textSizeOptions: { label: string; value: TextSize }[] = [
    { label: 'Normal', value: 'normal' },
    { label: 'Large', value: 'large' },
    { label: 'Extra Large', value: 'extra-large' },
  ];

  const handleTextSizeChange = (size: TextSize) => {
    setTextSize(size);
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-accent/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Accessibility options"
        title="Accessibility settings"
      >
        <Accessibility className="w-5 h-5 text-foreground" />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-lg shadow-lg z-50 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Accessibility</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-accent/10 rounded transition-colors"
              aria-label="Close accessibility panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Text Size Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Text Size
            </label>
            <div className="space-y-2">
              {textSizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleTextSizeChange(option.value)}
                  className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    settings.textSize === option.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Preview: <span className={`text-${settings.textSize === 'normal' ? 'base' : settings.textSize === 'large' ? 'lg' : 'xl'}`}>
                Sample text
              </span>
            </p>
          </div>

          {/* Contrast Mode Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Display Mode
            </label>
            <button
              onClick={toggleContrastMode}
              className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                settings.contrastMode === 'high-contrast'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Contrast className="w-4 h-4" />
              {settings.contrastMode === 'high-contrast' ? 'High Contrast On' : 'High Contrast Off'}
            </button>
            <p className="text-xs text-muted-foreground mt-2">
              Increases contrast for better visibility
            </p>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              resetSettings();
              setIsOpen(false);
            }}
            className="w-full px-3 py-2 rounded-md text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Default
          </button>

          {/* Info */}
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Your settings are saved automatically
          </p>
        </div>
      )}

      {/* Overlay to close panel when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};
