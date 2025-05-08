import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ThemeProvider, useTheme } from '../ThemeContext';
import { THEME_STORAGE_KEY, DEFAULT_THEME } from '../../types';

// Mock component that uses the theme context
const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    vi.restoreAllMocks();
  });

  it('provides default theme when no theme is stored', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value')).toHaveTextContent(DEFAULT_THEME);
  });

  it('uses theme from localStorage if available', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'personal');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value')).toHaveTextContent('personal');
  });

  it('toggles theme correctly', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const initialTheme = screen.getByTestId('theme-value').textContent;
    fireEvent.click(screen.getByText('Toggle Theme'));

    const newTheme = screen.getByTestId('theme-value').textContent;
    expect(newTheme).not.toBe(initialTheme);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(newTheme);
  });

  it('handles localStorage errors gracefully', () => {
    // Mock console.warn to prevent noise in test output
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    // Mock localStorage.getItem to throw an error
    const mockGetItem = vi.spyOn(Storage.prototype, 'getItem');
    mockGetItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Should fall back to default theme
    expect(screen.getByTestId('theme-value')).toHaveTextContent(DEFAULT_THEME);
    expect(consoleWarnSpy).toHaveBeenCalled();
  });

  it('updates theme based on system preference when no stored theme', () => {
    // Mock matchMedia
    const matchMediaSpy = vi.fn();
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      addListener: matchMediaSpy,
      removeListener: matchMediaSpy,
      addEventListener: matchMediaSpy,
      removeEventListener: matchMediaSpy,
    }));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Simulate system theme change
    act(() => {
      const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQueryList.matches = true;
      mediaQueryList.addEventListener.mock.calls[0][1]({ matches: true });
    });

    // Should use personal theme for dark mode when no stored preference
    expect(screen.getByTestId('theme-value')).toHaveTextContent('personal');
  });

  it('respects initialTheme prop', () => {
    render(
      <ThemeProvider initialTheme="personal">
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value')).toHaveTextContent('personal');
  });

  it('throws error when useTheme is used outside provider', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleErrorSpy.mockRestore();
  });
});