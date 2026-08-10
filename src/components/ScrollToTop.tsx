import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Route changes should start at the top of the new page, except when the URL
 * carries a hash (e.g. "/#experience" from the top navigation on a sub-page),
 * in which case we scroll to that section once it has mounted.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
