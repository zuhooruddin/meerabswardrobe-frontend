/**
 * Unused Images and Files Cleanup Script
 * 
 * This script scans your codebase for image references and identifies unused images/files
 * in the public/assets directory that can be safely removed.
 * 
 * Usage:
 *   - Dry run (check only, no deletion):  node script.js
 *   - Delete unused files:                 node script.js --delete
 *   - Using npm scripts:                   npm run cleanup:check    (dry run)
 *                                         npm run cleanup:remove   (delete)
 * 
 * The script will:
 *   1. Scan all code files (JS, JSX, TS, TSX, CSS, JSON) for image references
 *   2. List all images in public/assets directory
 *   3. Identify which images are not referenced in code
 *   4. Generate a report (unused-images-report.json)
 *   5. Optionally delete unused images (if --delete flag is used)
 * 
 * Note: Always run in dry-run mode first to review what will be deleted!
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Directories to scan for code files
  codeDirectories: [
    path.join(__dirname, 'src'),
    path.join(__dirname, 'pages'),
    path.join(__dirname, 'styles'),
  ],
  // Directories containing assets to check
  assetDirectories: [
    path.join(__dirname, 'public', 'assets'),
  ],
  // File extensions to scan for image references
  codeExtensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.json'],
  // Image file extensions
  imageExtensions: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.avif'],
  // Files/directories to ignore
  ignorePatterns: [
    'node_modules',
    '.next',
    '.git',
    'package-lock.json',
    'package.json',
    'script.js',
  ],
  // Dry run mode (set to false to actually delete files)
  // Can be overridden via command line: node script.js --delete
  dryRun: true,
};

// Statistics
const stats = {
  totalImages: 0,
  usedImages: 0,
  unusedImages: 0,
  deletedFiles: 0,
  errors: [],
};

/**
 * Recursively get all files in a directory
 */
function getAllFiles(dirPath, fileList = []) {
  if (!fs.existsSync(dirPath)) {
    return fileList;
  }

  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    // Skip ignored patterns
    if (CONFIG.ignorePatterns.some((pattern) => filePath.includes(pattern))) {
      return;
    }

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Get all image files from asset directories
 */
function getAllImageFiles() {
  const imageFiles = new Set();

  CONFIG.assetDirectories.forEach((assetDir) => {
    if (!fs.existsSync(assetDir)) {
      console.log(`⚠️  Asset directory not found: ${assetDir}`);
      return;
    }

    const files = getAllFiles(assetDir);
    files.forEach((file) => {
      const ext = path.extname(file).toLowerCase();
      if (CONFIG.imageExtensions.includes(ext)) {
        // Store both absolute and relative paths
        const relativePath = path.relative(path.join(__dirname, 'public'), file);
        const publicPath = '/' + relativePath.replace(/\\/g, '/');
        const fileName = path.basename(file);
        const dirName = path.dirname(file);

        imageFiles.add({
          absolutePath: file,
          relativePath: publicPath,
          fileName: fileName,
          dirPath: dirName,
          // Also check variations of the path
          variations: [
            publicPath,
            publicPath.replace(/^\/assets\//, '/assets/images/'),
            publicPath.replace(/^\/assets\/images\//, '/assets/'),
            fileName,
            path.basename(file, ext), // filename without extension
          ],
        });
      }
    });
  });

  return imageFiles;
}

/**
 * Extract image references from code files
 */
function extractImageReferences(filePath) {
  const references = new Set();

  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Match various image reference patterns
    const patterns = [
      // String literals with image extensions
      /['"`]([^'"`]*\.(png|jpg|jpeg|gif|svg|webp|ico|avif))['"`]/gi,
      // require() or import statements
      /(?:require|import|from)\s*\(?['"`]([^'"`]*\.(png|jpg|jpeg|gif|svg|webp|ico|avif))['"`]/gi,
      // CSS url() references
      /url\s*\(['"]?([^'"`)]*\.(png|jpg|jpeg|gif|svg|webp|ico|avif))['"]?\)/gi,
      // Next.js Image src
      /src\s*[:=]\s*['"`]([^'"`]*\.(png|jpg|jpeg|gif|svg|webp|ico|avif))['"`]/gi,
      // Background image URLs
      /background(?:-image)?\s*[:=]\s*['"`]?([^'"`)]*\.(png|jpg|jpeg|gif|svg|webp|ico|avif))['"`]?/gi,
      // Path references (partial matches)
      /['"`]([^'"`]*\/assets\/[^'"`]*)['"`]/gi,
      /['"`]([^'"`]*\/images\/[^'"`]*)['"`]/gi,
    ];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const ref = match[1] || match[0];
        if (ref) {
          // Normalize the reference
          const normalized = ref
            .replace(/['"`]/g, '')
            .replace(/^\.\//, '')
            .replace(/^\/\//, '/')
            .trim();

          if (normalized) {
            references.add(normalized);
            // Also add filename-only version
            const fileName = path.basename(normalized);
            if (fileName) {
              references.add(fileName);
            }
            // Add path without leading slash
            if (normalized.startsWith('/')) {
              references.add(normalized.substring(1));
            }
          }
        }
      }
    });
  } catch (error) {
    stats.errors.push(`Error reading ${filePath}: ${error.message}`);
  }

  return references;
}

/**
 * Check if an image is used in codebase
 */
function isImageUsed(imageInfo, allReferences) {
  // Check all variations of the image path
  for (const variation of imageInfo.variations) {
    if (allReferences.has(variation)) {
      return true;
    }
    // Also check if any reference contains the filename
    for (const ref of allReferences) {
      if (ref.includes(imageInfo.fileName) || ref.includes(variation)) {
        return true;
      }
    }
  }

  // Check if the relative path is referenced
  if (allReferences.has(imageInfo.relativePath)) {
    return true;
  }

  // Check if filename without extension is referenced
  const nameWithoutExt = path.basename(imageInfo.fileName, path.extname(imageInfo.fileName));
  if (allReferences.has(nameWithoutExt)) {
    return true;
  }

  return false;
}

/**
 * Main function
 */
function main() {
  // Check command line arguments
  const args = process.argv.slice(2);
  const shouldDelete = args.includes('--delete') || args.includes('-d');
  const dryRun = !shouldDelete && CONFIG.dryRun;

  console.log('🔍 Scanning for unused images and files...\n');
  console.log(`Mode: ${dryRun ? 'DRY RUN (no files will be deleted)' : 'LIVE (files will be deleted)'}\n`);

  // Step 1: Get all image files
  console.log('📁 Collecting all image files...');
  const allImages = getAllImageFiles();
  stats.totalImages = allImages.size;
  console.log(`   Found ${stats.totalImages} image files\n`);

  // Step 2: Get all code files
  console.log('📝 Scanning code files for image references...');
  const allCodeFiles = [];
  CONFIG.codeDirectories.forEach((codeDir) => {
    if (fs.existsSync(codeDir)) {
      const files = getAllFiles(codeDir).filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return CONFIG.codeExtensions.includes(ext);
      });
      allCodeFiles.push(...files);
    }
  });
  console.log(`   Scanning ${allCodeFiles.length} code files...`);

  // Step 3: Extract all image references from code
  const allReferences = new Set();
  allCodeFiles.forEach((file) => {
    const refs = extractImageReferences(file);
    refs.forEach((ref) => allReferences.add(ref));
  });
  console.log(`   Found ${allReferences.size} image references in code\n`);

  // Step 4: Identify unused images
  console.log('🔎 Identifying unused images...');
  const unusedImages = [];
  const usedImages = [];

  allImages.forEach((imageInfo) => {
    if (isImageUsed(imageInfo, allReferences)) {
      usedImages.push(imageInfo);
      stats.usedImages++;
    } else {
      unusedImages.push(imageInfo);
      stats.unusedImages++;
    }
  });

  // Step 5: Display results
  console.log('\n📊 Results:');
  console.log(`   Total images: ${stats.totalImages}`);
  console.log(`   Used images: ${stats.usedImages}`);
  console.log(`   Unused images: ${stats.unusedImages}\n`);

  if (unusedImages.length > 0) {
    console.log('🗑️  Unused images:');
    unusedImages.forEach((img, index) => {
      console.log(`   ${index + 1}. ${img.relativePath}`);
    });
    console.log('');

    // Step 6: Delete unused images (if not dry run)
    if (!dryRun) {
      console.log('🗑️  Deleting unused images...');
      unusedImages.forEach((img) => {
        try {
          if (fs.existsSync(img.absolutePath)) {
            fs.unlinkSync(img.absolutePath);
            stats.deletedFiles++;
            console.log(`   ✓ Deleted: ${img.relativePath}`);
          }
        } catch (error) {
          stats.errors.push(`Error deleting ${img.absolutePath}: ${error.message}`);
          console.log(`   ✗ Error deleting ${img.relativePath}: ${error.message}`);
        }
      });
      console.log(`\n   Deleted ${stats.deletedFiles} files\n`);
    } else {
      console.log('💡 Run with CONFIG.dryRun = false to actually delete these files\n');
    }
  } else {
    console.log('✅ No unused images found!\n');
  }

  // Display errors if any
  if (stats.errors.length > 0) {
    console.log('⚠️  Errors encountered:');
    stats.errors.forEach((error) => {
      console.log(`   - ${error}`);
    });
    console.log('');
  }

  // Summary
  console.log('📈 Summary:');
  console.log(`   Total images scanned: ${stats.totalImages}`);
  console.log(`   Used: ${stats.usedImages}`);
  console.log(`   Unused: ${stats.unusedImages}`);
  if (!CONFIG.dryRun) {
    console.log(`   Deleted: ${stats.deletedFiles}`);
  }
  console.log('');

  // Generate report file
  const reportPath = path.join(__dirname, 'unused-images-report.json');
  const report = {
    timestamp: new Date().toISOString(),
    dryRun: dryRun,
    stats: {
      totalImages: stats.totalImages,
      usedImages: stats.usedImages,
      unusedImages: stats.unusedImages,
      deletedFiles: dryRun ? 0 : stats.deletedFiles,
    },
    unusedImages: unusedImages.map((img) => ({
      path: img.relativePath,
      absolutePath: img.absolutePath,
      fileName: img.fileName,
    })),
    errors: stats.errors,
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📄 Report saved to: ${reportPath}`);
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main, CONFIG };

