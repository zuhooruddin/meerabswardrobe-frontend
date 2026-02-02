// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
// }

// module.exports = nextConfig

// Webpack Bundle Analyzer (optional)
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  reactStrictMode: true,
  // Disable SWC minify if it causes bus errors - can fall back to Terser
  swcMinify: process.env.DISABLE_SWC !== 'true', // Can disable via env var if needed
  compress: true, // Enable gzip compression (Next.js handles this automatically)
  poweredByHeader: false, // Remove X-Powered-By header for security
  
  // SEO and Performance Headers - merged into single headers() function below
  
  // Disable ESLint during builds to avoid plugin loading errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  devIndicators: {
    buildActivity: false, // Disable build indicator in dev mode for better performance
  },
  
  publicRuntimeConfig: {
    // Available on both server and client
    theme: "DEFAULT",
  },
  
  images: {
    domains: ["100.64.6.105","idrisbookbank-dev-server.inara.tech","api.meerabs.com","s3-inara.eu-central-1.linodeobjects.com","meerabs.com"],
    formats: ['image/avif', 'image/webp'], // Enable modern image formats - AVIF provides ~50% better compression than WebP
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Optimized device sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Optimized image sizes for category icons
    minimumCacheTTL: 31536000, // Cache images for 1 year (aggressive caching)
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Reduce default quality from 75 to 70 for better compression (still visually good)
    // For hero images/sliders, use quality={60} in the component for maximum savings
    // For product images, use quality={70-75} for balance
    // For thumbnails, use quality={60-65} for small file sizes
  },
  
  // Optimize bundle size
  experimental: {
    // Disable optimizeCss if it causes build issues
    optimizeCss: process.env.DISABLE_CSS_OPT !== 'true',
  },
  
  // Enable production source maps for debugging (only for large first-party JS)
  productionBrowserSourceMaps: process.env.NODE_ENV === 'production' ? false : true,
  
  // Optimize fonts
  optimizeFonts: true,
  
  // Compiler options - remove console.log in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Target modern browsers to reduce legacy JavaScript polyfills
    if (!isServer) {
      config.target = ['web', 'es2020']; // Target ES2020+ browsers (Chrome 84+, Firefox 79+, Safari 14+)
      
      // Optimize for modern browsers - reduce polyfills
      config.resolve.alias = {
        ...config.resolve.alias,
      };
      
      // Exclude unnecessary polyfills for modern browsers
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // These are already supported in modern browsers, no polyfills needed
      };
    }
    
    // Optimize parallelism based on environment
    // Use more parallelism on Linux (production), less on Windows
    if (process.platform === 'win32') {
      config.parallelism = 1; // Windows has low file handle limits
    } else {
      // Linux can handle more parallelism, but limit to prevent memory issues
      config.parallelism = Math.min(4, require('os').cpus().length);
    }
    
    // Enable caching for production builds to reduce memory usage
    // Only disable on Windows if needed
    if (process.platform !== 'win32' && !dev) {
      // Enable caching on Linux for better performance
      if (!config.cache) {
        config.cache = {
          type: 'filesystem',
          buildDependencies: {
            config: [__filename],
          },
        };
      }
    } else if (process.platform === 'win32') {
      // Disable caching on Windows to reduce file handles
      config.cache = false;
    }
    
    // Optimize file watching to reduce open file handles in dev mode
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: /node_modules/,
        aggregateTimeout: 300,
        poll: process.platform === 'win32', // Only poll on Windows
      };
    }
    
    // Optimize module resolution
    config.resolve = {
      ...config.resolve,
      // Enable resolve cache on Linux, disable on Windows
      cache: process.platform !== 'win32',
      symlinks: true, // Enable symlinks on Linux
    };
    
    // Reduce file system operations during build
    config.infrastructureLogging = {
      level: 'error', // Only log errors to reduce I/O
    };
    
    // Production optimizations
    if (!dev && !isServer) {
      // Optimize chunk splitting to reduce unused JavaScript
      config.optimization = {
        ...config.optimization,
        usedExports: true, // Enable tree-shaking
        sideEffects: false, // Mark as side-effect free for better tree-shaking
        moduleIds: 'deterministic', // Use deterministic module IDs for better caching
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 8, // Significantly reduced to limit initial chunks (was 15)
          minSize: 50000, // Increased from 20KB to 50KB to prevent tiny chunks
          maxSize: 300000, // Increased to allow larger chunks and reduce fragmentation
          cacheGroups: {
            default: false,
            vendors: false,
            // React chunk (highest priority - most used) - keep separate
            react: {
              name: 'react',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              chunks: 'all',
              priority: 50,
              enforce: true,
              minSize: 0, // Always include React
            },
            // MUI core + icons combined to reduce chunks
            mui: {
              name: 'mui',
              test: /[\\/]node_modules[\\/]@mui[\\/]/,
              chunks: 'all',
              priority: 40,
              enforce: true,
              minSize: 0,
            },
            // Next.js framework code - combine with common vendors
            nextjs: {
              name: 'nextjs',
              test: /[\\/]node_modules[\\/](next|next-auth)[\\/]/,
              chunks: 'all',
              priority: 35,
              enforce: true,
              minSize: 0,
            },
            // Split large third-party libraries into smaller async chunks for better code splitting
            // Load heavy libraries only when needed
            charts: {
              name: 'charts',
              test: /[\\/]node_modules[\\/](apexcharts|react-apexcharts)[\\/]/,
              chunks: 'async', // Load only on pages that use charts
              priority: 31,
              enforce: true,
              reuseExistingChunk: true,
            },
            editor: {
              name: 'editor',
              test: /[\\/]node_modules[\\/](react-quill|quill)[\\/]/,
              chunks: 'async', // Load only on pages with rich text editor
              priority: 30,
              enforce: true,
              reuseExistingChunk: true,
            },
            // Keep commonly used libraries together but still async
            utils: {
              name: 'utils',
              test: /[\\/]node_modules[\\/](simplebar|react-floating-whatsapp|react-toastify|nprogress)[\\/]/,
              chunks: 'async',
              priority: 29,
              reuseExistingChunk: true,
            },
            // SWR and Axios should be in initial bundle as they're used on most pages
            api: {
              name: 'api',
              test: /[\\/]node_modules[\\/](swr|axios)[\\/]/,
              chunks: 'all', // Initial bundle - used on almost every page
              priority: 32,
              enforce: true,
              reuseExistingChunk: true,
            },
            // Form libraries - async load
            forms: {
              name: 'forms',
              test: /[\\/]node_modules[\\/](formik|yup)[\\/]/,
              chunks: 'async',
              priority: 28,
              reuseExistingChunk: true,
            },
            // All other vendors in one chunk to reduce fragmentation
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
              minChunks: 2, // Only include if used in 2+ places
              reuseExistingChunk: true,
              minSize: 10000, // At least 10KB to avoid tiny chunks
              maxSize: 200000, // Split large vendors into smaller chunks
            },
            // Common chunk for shared code - only if significantly shared
            common: {
              name: 'common',
              minChunks: 6, // Increased to reduce fragmentation (must be shared by 6+ pages)
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
              minSize: 30000, // Reduced from 50KB to capture medium-sized shared code
              maxSize: 150000, // Split if larger than 150KB
            },
          },
        },
      };
    }
    return config;
  },

  // SEO and Performance Headers - Optimized cache lifetimes
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding', // Tell CDN/proxy to vary on encoding (gzip/Brotli handled automatically by Next.js/server)
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.quilljs.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.quilljs.com https://unpkg.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; media-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://api.meerabs.com https://admin.meerabs.com https://meerabs.com; frame-ancestors 'none';",
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache headers for API images via proxy
      {
        source: '/api/image-proxy',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      // Rewrite /api/callback/google to NextAuth's callback handler
      {
        source: '/api/callback/google',
        destination: '/api/auth/callback/google',
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/Category/:slug',
        destination: '/categories/:slug',
        permanent: false,
      },
      {
        source: '/Cat/:slug',
        destination: '/categories/:slug',
        permanent: false,
      },
      
      // {
      //   source: '/product:slug(\\.html)',
      //   destination: '/',
      //   permanent: true,
      // },
      // {
      //   source: '/items.php*',
      //   destination: '/',
      //   permanent: true,
      // },
      
    ]

  },
};

// Export with bundle analyzer wrapper
module.exports = withBundleAnalyzer(nextConfig);
// '/product/:slug(\\{.*\.html$})',
