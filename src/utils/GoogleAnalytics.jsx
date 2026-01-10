import React, { useEffect } from "react";

const GoogleAnalytics = () => {
  // Defer Google Tag Manager loading to improve initial page load performance
  // Load only after user interaction (click, scroll) or after 5 seconds
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let loaded = false;
      
      const loadAfterInteraction = () => {
        if (loaded) return;
        loaded = true;
        
        // Remove event listeners after first load
        window.removeEventListener('scroll', loadAfterInteraction);
        window.removeEventListener('mousemove', loadAfterInteraction);
        window.removeEventListener('touchstart', loadAfterInteraction);
        window.removeEventListener('click', loadAfterInteraction);
        
        // Use requestIdleCallback for better performance
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            loadGoogleAnalytics();
          }, { timeout: 2000 });
        } else {
          setTimeout(loadGoogleAnalytics, 100);
        }
      };
      
      // Load on user interaction
      window.addEventListener('scroll', loadAfterInteraction, { once: true, passive: true });
      window.addEventListener('mousemove', loadAfterInteraction, { once: true, passive: true });
      window.addEventListener('touchstart', loadAfterInteraction, { once: true, passive: true });
      window.addEventListener('click', loadAfterInteraction, { once: true });
      
      // Fallback: Load after 5 seconds if no interaction
      const timeout = setTimeout(loadAfterInteraction, 5000);
      
      return () => {
        clearTimeout(timeout);
        window.removeEventListener('scroll', loadAfterInteraction);
        window.removeEventListener('mousemove', loadAfterInteraction);
        window.removeEventListener('touchstart', loadAfterInteraction);
        window.removeEventListener('click', loadAfterInteraction);
      };
    }
  }, []);

  const loadGoogleAnalytics = () => {
    // Check if already loaded to prevent duplicate scripts
    if (document.querySelector('script[src*="googletagmanager.com"]')) {
      return;
    }
    
    // Load gtag script with defer attribute and low priority
    const script1 = document.createElement('script');
    script1.async = true;
    script1.defer = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-VVDHZDQQZC';
    // Set fetchpriority to low to reduce impact on critical resources
    if ('fetchPriority' in script1) {
      script1.fetchPriority = 'low';
    }
    document.head.appendChild(script1);

    // Load gtag config - use textContent instead of innerHTML for better performance
    const script2 = document.createElement('script');
    script2.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-VVDHZDQQZC', {
        'send_page_view': false,
        'transport_type': 'beacon'
      });
    `;
    document.head.appendChild(script2);
  };

  return null; // No SSR rendering to avoid blocking
};

export default GoogleAnalytics;
