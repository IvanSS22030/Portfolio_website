import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorBoundaryWithTheme from '../ErrorBoundary';
import { ThemeProvider } from '../../context/ThemeContext';

// Mock component that throws an error
const ThrowError = () => {
  throw new Error('Test error');
};

// Mock window.location.reload
const mockReload = vi.fn();
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true,
});

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ThemeProvider>
        <ErrorBoundaryWithTheme>
          <div data-testid="test-child">Test Content</div>
        </ErrorBoundaryWithTheme>
      </ThemeProvider>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders error UI in professional theme when there is an error', () => {
    // Suppress console.error for this test
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ThemeProvider>
        <ErrorBoundaryWithTheme>
          <ThrowError />
        </ErrorBoundaryWithTheme>
      </ThemeProvider>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Reload Page')).toBeInTheDocument();

    // Clean up
    consoleError.mockRestore();
  });

  it('reloads the page when reload button is clicked', () => {
    // Suppress console.error for this test
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ThemeProvider>
        <ErrorBoundaryWithTheme>
          <ThrowError />
        </ErrorBoundaryWithTheme>
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Reload Page'));
    expect(mockReload).toHaveBeenCalled();

    // Clean up
    consoleError.mockRestore();
  });
});