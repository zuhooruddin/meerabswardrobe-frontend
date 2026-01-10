/**
 * Lazy load CSS files to improve initial page load performance
 */
export const lazyLoadCSS = (href) => {
  if (typeof window === 'undefined') return;
  
  // Check if stylesheet is already loaded
  const existingLink = document.querySelector(`link[href="${href}"]`);
  if (existingLink) return;
  
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.media = 'print';
  link.onload = function() {
    this.media = 'all';
  };
  document.head.appendChild(link);
};

// Load heavy CSS only when needed
export const loadQuillCSS = () => lazyLoadCSS('/_next/static/css/react-quill.css');
export const loadSimplebarCSS = () => lazyLoadCSS('/_next/static/css/simplebar.css');

