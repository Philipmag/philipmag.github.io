import { useEffect, useRef, useState } from "react";
import { Accessibility, X, Contrast, RotateCcw } from "lucide-react";
import {
  useAccessibility,
  type TextSize,
} from "@/contexts/AccessibilityContext";
export function AccessibilityToggle() {
  const { settings, setTextSize, toggleContrastMode, resetSettings } =
    useAccessibility();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", keyboard);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", keyboard);
    };
  }, [open]);
  const options: { value: TextSize; label: string }[] = [
    { value: "normal", label: "Standard (18px)" },
    { value: "large", label: "Large (20px)" },
    { value: "extra-large", label: "Extra large (22px)" },
  ];
  return (
    <div className="relative" ref={root}>
      <button
        ref={trigger}
        type="button"
        className="icon-button"
        aria-label="Text size and contrast"
        title="Text size and contrast"
        aria-expanded={open}
        aria-controls="accessibility-options"
        onClick={() => setOpen(!open)}
      >
        <Accessibility size={20} />
      </button>
      {open && (
        <section
          id="accessibility-options"
          className="accessibility-panel"
          aria-label="Accessibility settings"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg">Reading settings</h2>
            <button
              type="button"
              className="icon-button"
              aria-label="Close reading settings"
              onClick={() => {
                setOpen(false);
                trigger.current?.focus();
              }}
            >
              <X size={18} />
            </button>
          </div>
          <fieldset>
            <legend className="mb-3">Text size</legend>
            <div className="grid gap-2">
              {options.map(option => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={settings.textSize === option.value}
                  onClick={() => setTextSize(option.value)}
                  className={`button ${settings.textSize === option.value ? "" : "button-secondary"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
          <button
            type="button"
            className="button button-secondary w-full mt-5"
            aria-pressed={settings.contrastMode === "high-contrast"}
            onClick={toggleContrastMode}
          >
            <Contrast size={18} />
            {settings.contrastMode === "high-contrast"
              ? "High contrast on"
              : "Turn on high contrast"}
          </button>
          <button
            type="button"
            className="text-link mt-4 inline-flex items-center gap-2"
            onClick={resetSettings}
          >
            <RotateCcw size={18} />
            Reset settings
          </button>
          <p className="text-sm text-muted-foreground mt-4">
            Settings are saved on this device when storage is available
          </p>
        </section>
      )}
    </div>
  );
}
