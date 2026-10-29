import { useEffect, useState } from 'react';

// A mouse or trackpad: hover works. Phones and tablets don't match.
const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

export const useHasFinePointer = () => {
  const [hasFinePointer, setHasFinePointer] = useState(
    () => window.matchMedia?.(FINE_POINTER_QUERY).matches ?? false
  );

  useEffect(() => {
    if (!window.matchMedia) return;
    const mediaQuery = window.matchMedia(FINE_POINTER_QUERY);
    const handleChange = () => setHasFinePointer(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return hasFinePointer;
};
