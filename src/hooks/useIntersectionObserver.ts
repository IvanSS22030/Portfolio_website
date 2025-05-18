import { useEffect, useState, RefObject } from 'react';

interface IntersectionObserverOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

export const useIntersectionObserver = (
  ref: RefObject<Element>,
  options: IntersectionObserverOptions = {}
): boolean => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const { triggerOnce = true, ...opts } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        if (triggerOnce) {
          observer.unobserve(element);
        }
      } else if (!triggerOnce) {
        setIsIntersecting(false);
      }
    }, opts);

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, opts, triggerOnce]);

  return isIntersecting;
};
