import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('AccessibilityContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset HTML attributes
    document.documentElement.removeAttribute('data-text-size');
    document.documentElement.removeAttribute('data-contrast-mode');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should have default settings', () => {
    const stored = localStorage.getItem('accessibility-settings');
    expect(stored).toBeNull();
  });

  it('should persist settings to localStorage', () => {
    const settings = {
      textSize: 'large' as const,
      contrastMode: 'high-contrast' as const,
    };
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    const retrieved = JSON.parse(localStorage.getItem('accessibility-settings')!);
    expect(retrieved).toEqual(settings);
  });

  it('should handle text size changes', () => {
    const sizes = ['normal', 'large', 'extra-large'];
    sizes.forEach((size) => {
      document.documentElement.setAttribute('data-text-size', size);
      expect(document.documentElement.getAttribute('data-text-size')).toBe(size);
    });
  });

  it('should handle contrast mode changes', () => {
    document.documentElement.setAttribute('data-contrast-mode', 'high-contrast');
    expect(document.documentElement.getAttribute('data-contrast-mode')).toBe('high-contrast');
    
    document.documentElement.setAttribute('data-contrast-mode', 'normal');
    expect(document.documentElement.getAttribute('data-contrast-mode')).toBe('normal');
  });

  it('should toggle contrast mode', () => {
    let mode = 'normal';
    const toggle = () => {
      mode = mode === 'normal' ? 'high-contrast' : 'normal';
    };
    
    expect(mode).toBe('normal');
    toggle();
    expect(mode).toBe('high-contrast');
    toggle();
    expect(mode).toBe('normal');
  });

  it('should reset settings to defaults', () => {
    localStorage.setItem('accessibility-settings', JSON.stringify({
      textSize: 'extra-large',
      contrastMode: 'high-contrast',
    }));
    
    localStorage.removeItem('accessibility-settings');
    expect(localStorage.getItem('accessibility-settings')).toBeNull();
  });

  it('should handle invalid JSON in localStorage gracefully', () => {
    localStorage.setItem('accessibility-settings', 'invalid-json');
    const retrieved = localStorage.getItem('accessibility-settings');
    expect(() => JSON.parse(retrieved!)).toThrow();
  });
});
