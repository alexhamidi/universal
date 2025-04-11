import { useCallback } from 'react';

export const useScrollToSection = () => {
  return useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      // Update URL without a page reload
      window.history.pushState({}, '', `/#${sectionId}`);
    }
  }, []);
};
