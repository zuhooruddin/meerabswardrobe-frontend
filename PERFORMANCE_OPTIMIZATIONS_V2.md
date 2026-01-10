# Performance Optimizations V2 - Lighthouse Score Improvements

This document outlines the performance optimizations implemented to address the Lighthouse Performance score of 19 and improve Core Web Vitals.

## Issues Identified from Lighthouse Report

1. **Image Optimization** (Est. Savings: 12,056 KiB)
   - Large slider images (2-3 MB each) using CSS background images
   - No modern image formats (WebP/AVIF)
   - Oversized category images (1920x544 displayed as 380x108)

2. **Cache Lifetimes** (Est. Savings: 12,818 KiB)
   - No cache headers on external API images
   - Images re-downloaded on every visit

3. **Legacy JavaScript** (Est. Savings: 24 KiB)
   - Unnecessary polyfills for modern browsers
   - Array.prototype.flat, Object.fromEntries, etc.

4. **Unused JavaScript** (Est. Savings: 178 KiB)
   - Route-specific chunks loaded on homepage
   - Google Tag Manager (55.5 KiB unused)

5. **LCP Issues**
   - Element render delay: 2,250ms
   - No fetchpriority=high on LCP image
   - Lazy loading not properly configured

6. **Network Optimization**
   - Missing preconnect hints for critical origins
   - No resource prioritization

## Solutions Implemented

### 1. Image Optimization ✅

**CarouselCard4 Component:**
- ✅ Converted from CSS `background-image` to Next.js `Image` component
- ✅ Automatic WebP/AVIF conversion via Next.js Image Optimization
- ✅ Proper lazy loading with priority for first slider
- ✅ Added `fetchPriority="high"` for LCP image

**BannerCard3 Component:**
- ✅ Updated image dimensions to match display size (622x350 for 16:9 aspect ratio)
- ✅ Added proper `sizes` attribute for responsive images

**Files Modified:**
- `src/components/carousel-cards/CarouselCard4.jsx` - Complete rewrite using Next.js Image
- `src/components/banners/BannerCard3.jsx` - Fixed image dimensions and sizes

**Expected Savings:** ~12,056 KiB (90% reduction in image sizes with WebP/AVIF)

### 2. Modern Browser Targeting ✅

**Package.json:**
- ✅ Added `browserslist` configuration targeting modern browsers:
  - Chrome >= 84
  - Firefox >= 79
  - Safari >= 14
  - Edge >= 84

**Next.js Config:**
- ✅ Set webpack target to `['web', 'es2020']` for client-side builds
- ✅ Reduces unnecessary polyfills for modern JavaScript features

**Files Modified:**
- `package.json` - Added browserslist config
- `next.config.js` - Added webpack target configuration

**Expected Savings:** ~24 KiB (removes legacy polyfills)

### 3. Bundle Splitting Optimization ✅

**Next.js Config:**
- ✅ Reduced `maxInitialRequests` from 20 to 15
- ✅ Increased `minChunks` for common chunk from 2 to 3
- ✅ Added Next.js framework chunk separation
- ✅ Better async loading for route-specific code

**Files Modified:**
- `next.config.js` - Enhanced splitChunks configuration

**Expected Savings:** ~178 KiB (reduced unused JavaScript)

### 4. Network Optimization ✅

**Preconnect Hints:**
- ✅ Added preconnect to `https://api.chitralhive.com`
- ✅ Added preconnect to `https://fonts.gstatic.com`
- ✅ Added dns-prefetch for `https://fonts.googleapis.com`

**Files Modified:**
- `pages/_app.jsx` - Added preconnect hints in Head

**Expected Improvement:** Faster resource loading, reduced DNS lookup time

### 5. Google Tag Manager Optimization ✅

**Deferred Loading:**
- ✅ Increased timeout to 3 seconds
- ✅ Added duplicate script prevention
- ✅ Wait for page load event before loading
- ✅ Added `defer` attribute to script

**Files Modified:**
- `src/utils/GoogleAnalytics.jsx` - Enhanced deferral strategy

**Expected Improvement:** Reduced TBT by ~100-200ms

### 6. LCP Optimization ✅

**First Slider Image:**
- ✅ Added `priority={true}` for first slider
- ✅ Added `fetchPriority="high"` for LCP image
- ✅ Converted to Next.js Image for automatic optimization
- ✅ Proper `sizes` attribute for responsive loading

**Files Modified:**
- `src/pages-sections/market-2/Section1.jsx` - Already had priority, verified
- `src/components/carousel-cards/CarouselCard4.jsx` - Supports priority prop

**Expected Improvement:** LCP from 44.8s → ~3-5s

## Expected Performance Improvements

### Core Web Vitals

1. **First Contentful Paint (FCP)**: 2.3s → **~1.2-1.5s**
   - Image optimization (WebP/AVIF)
   - Reduced JavaScript execution
   - Better code splitting

2. **Largest Contentful Paint (LCP)**: 44.8s → **~3-5s**
   - Priority image loading with fetchPriority="high"
   - Next.js Image optimization (WebP/AVIF)
   - Proper image sizing
   - Preconnect hints

3. **Total Blocking Time (TBT)**: 1,040ms → **~300-500ms**
   - Deferred GTM loading
   - Better code splitting
   - Reduced JavaScript execution
   - Modern browser targeting (fewer polyfills)

4. **Cumulative Layout Shift (CLS)**: 0.894 → **~0.1-0.2**
   - Proper image dimensions
   - Aspect ratio preservation
   - No layout shifts from image loading

5. **Speed Index (SI)**: 7.6s → **~3-4s**
   - Faster image loading
   - Better resource prioritization

### Overall Performance Score

**Expected:** 19 → **60-75** (depending on network conditions)

### Network Savings

- **Image Size Reduction:** ~12,056 KiB (90% with WebP/AVIF)
- **JavaScript Reduction:** ~202 KiB (legacy + unused)
- **Total Estimated Savings:** ~12,258 KiB

## Additional Recommendations

### Backend Optimizations (Not in this PR)

1. **Image CDN/Storage:**
   - Serve images from CDN with proper cache headers
   - Implement image resizing API for different sizes
   - Use WebP/AVIF at source if possible

2. **API Response Caching:**
   - Add cache headers to API responses
   - Implement ETags for conditional requests
   - Use HTTP/2 Server Push for critical resources

3. **Database Optimization:**
   - Optimize queries in `getStaticProps`
   - Consider using ISR (Incremental Static Regeneration) more aggressively

### Frontend Future Optimizations

1. **Service Worker:**
   - Implement service worker for offline support
   - Cache API responses
   - Prefetch critical resources

2. **Route Prefetching:**
   - Use Next.js Link prefetching more strategically
   - Prefetch on hover for important links

3. **Font Optimization:**
   - Self-host fonts to reduce external requests
   - Use `font-display: swap` (already implemented)
   - Subset fonts to only include used characters

## Testing Recommendations

1. **Run Lighthouse again** after deployment to verify improvements
2. **Test on real devices** (especially Moto G Power as per report)
3. **Monitor Core Web Vitals** in production using Google Search Console
4. **Test on slow 4G** to verify improvements match expectations

## Notes

- All changes are backward compatible
- No breaking changes to existing functionality
- Images will automatically be optimized by Next.js Image Optimization API
- Modern browser targeting may require fallbacks if supporting very old browsers

