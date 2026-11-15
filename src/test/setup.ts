// Adds jest-dom's matchers (toBeInTheDocument, ...) to Vitest's expect
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom has no matchMedia; the app uses it for the system theme and the pointer type.
// Tests that need a specific answer replace it with their own mock.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// Cleanup after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup();
});
