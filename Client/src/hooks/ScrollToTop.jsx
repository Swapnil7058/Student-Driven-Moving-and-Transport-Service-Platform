// ScrollToTop.jsx

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // This effect runs every time the route (pathname) changes
    window.scrollTo(0, 0); 
  }, [pathname]); // Re-run effect when pathname changes

  return null; // This component renders nothing itself
};

export default ScrollToTop;