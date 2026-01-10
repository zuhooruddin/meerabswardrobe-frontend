#!/bin/bash
# Image Optimization Script for Chitral Hive
# This script compresses large images using WebP format

echo "🖼️  Starting image optimization for Chitral Hive..."

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo "❌ cwebp is not installed. Installing..."
    echo "On Ubuntu/Debian: sudo apt-get install webp"
    echo "On Mac: brew install webp"
    echo "On Windows: Download from https://developers.google.com/speed/webp/download"
    exit 1
fi

# Base directory
MEDIA_DIR="../chitralhivedjango/media"

# Create backup directory
BACKUP_DIR="${MEDIA_DIR}/backups"
mkdir -p "$BACKUP_DIR"

echo "📁 Processing images in: $MEDIA_DIR"
echo "💾 Backups will be saved to: $BACKUP_DIR"
echo ""

# Counter for statistics
COUNT=0
TOTAL_ORIGINAL=0
TOTAL_OPTIMIZED=0

# Function to optimize image
optimize_image() {
    local input_file="$1"
    local filename=$(basename "$input_file")
    local dirname=$(dirname "$input_file")
    local extension="${filename##*.}"
    local basename="${filename%.*}"
    local output_file="${dirname}/${basename}.webp"
    
    # Skip if WebP already exists and is smaller
    if [ -f "$output_file" ]; then
        original_size=$(stat -f%z "$input_file" 2>/dev/null || stat -c%s "$input_file" 2>/dev/null)
        webp_size=$(stat -f%z "$output_file" 2>/dev/null || stat -c%s "$output_file" 2>/dev/null)
        
        if [ "$webp_size" -lt "$original_size" ]; then
            echo "⏭️  Skipping $filename (WebP already exists)"
            return
        fi
    fi
    
    # Get original file size
    original_size=$(stat -f%z "$input_file" 2>/dev/null || stat -c%s "$input_file" 2>/dev/null)
    original_size_mb=$(echo "scale=2; $original_size / 1048576" | bc)
    
    # Skip small images (< 100KB)
    if [ "$original_size" -lt 102400 ]; then
        echo "⏭️  Skipping $filename (already small: ${original_size_mb}MB)"
        return
    fi
    
    echo "🔄 Processing: $filename (${original_size_mb}MB)"
    
    # Backup original file
    cp "$input_file" "${BACKUP_DIR}/${filename}.backup"
    
    # Convert to WebP with quality 85
    cwebp -q 85 -m 6 -quiet "$input_file" -o "$output_file"
    
    # Get optimized file size
    optimized_size=$(stat -f%z "$output_file" 2>/dev/null || stat -c%s "$output_file" 2>/dev/null)
    optimized_size_mb=$(echo "scale=2; $optimized_size / 1048576" | bc)
    
    # Calculate savings
    savings=$((original_size - optimized_size))
    savings_mb=$(echo "scale=2; $savings / 1048576" | bc)
    savings_percent=$(echo "scale=1; ($savings / $original_size) * 100" | bc)
    
    echo "✅ Optimized: ${original_size_mb}MB → ${optimized_size_mb}MB (saved ${savings_mb}MB, ${savings_percent}%)"
    
    # Update statistics
    COUNT=$((COUNT + 1))
    TOTAL_ORIGINAL=$((TOTAL_ORIGINAL + original_size))
    TOTAL_OPTIMIZED=$((TOTAL_OPTIMIZED + optimized_size))
}

# Process slider images (highest priority - these are huge!)
echo "🎨 Processing slider images..."
if [ -d "${MEDIA_DIR}/slider" ]; then
    for img in "${MEDIA_DIR}/slider"/*.{png,jpg,jpeg,PNG,JPG,JPEG}; do
        [ -f "$img" ] && optimize_image "$img"
    done
fi

# Process category icons
echo "📦 Processing category icons..."
if [ -d "${MEDIA_DIR}/category_icon" ]; then
    for img in "${MEDIA_DIR}/category_icon"/*.{png,jpg,jpeg,PNG,JPG,JPEG}; do
        [ -f "$img" ] && optimize_image "$img"
    done
fi

# Process product images
echo "🛍️  Processing product images..."
if [ -d "${MEDIA_DIR}/item_image" ]; then
    for img in "${MEDIA_DIR}/item_image"/*.{png,jpg,jpeg,PNG,JPG,JPEG}; do
        [ -f "$img" ] && optimize_image "$img"
    done
fi

# Calculate total savings
TOTAL_ORIGINAL_MB=$(echo "scale=2; $TOTAL_ORIGINAL / 1048576" | bc)
TOTAL_OPTIMIZED_MB=$(echo "scale=2; $TOTAL_OPTIMIZED / 1048576" | bc)
TOTAL_SAVINGS=$((TOTAL_ORIGINAL - TOTAL_OPTIMIZED))
TOTAL_SAVINGS_MB=$(echo "scale=2; $TOTAL_SAVINGS / 1048576" | bc)
TOTAL_SAVINGS_PERCENT=$(echo "scale=1; ($TOTAL_SAVINGS / $TOTAL_ORIGINAL) * 100" | bc)

# Print summary
echo ""
echo "=================================================="
echo "📊 Optimization Summary"
echo "=================================================="
echo "Images optimized: $COUNT"
echo "Original total size: ${TOTAL_ORIGINAL_MB}MB"
echo "Optimized total size: ${TOTAL_OPTIMIZED_MB}MB"
echo "Total saved: ${TOTAL_SAVINGS_MB}MB (${TOTAL_SAVINGS_PERCENT}%)"
echo "=================================================="
echo ""
echo "✨ Next steps:"
echo "1. Update Django models to use WebP images"
echo "2. Update image references in database"
echo "3. Test the site to ensure images load correctly"
echo "4. Remove original PNG/JPG files after verification"
echo ""
echo "💡 Tip: You can safely delete the original files if the WebP versions look good"
echo "   The original files are backed up in: $BACKUP_DIR"





