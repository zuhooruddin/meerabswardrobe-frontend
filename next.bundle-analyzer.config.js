/**
 * Webpack Bundle Analyzer Configuration
 * 
 * This file configures webpack-bundle-analyzer to help identify:
 * - Large dependencies
 * - Duplicate packages
 * - Unused code
 * - Optimization opportunities
 * 
 * Usage:
 *   ANALYZE=true npm run build
 */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
  analyzerMode: 'static',
  reportFilename: './analyze/client.html',
  defaultSizes: 'gzip',
  generateStatsFile: true,
  statsFilename: './analyze/stats.json',
});

module.exports = withBundleAnalyzer;





