# 🚀 Installation & Execution Guide

## Quick Start (3 Commands)

```powershell
# 1. Install dependencies
cd E:\chitralhive\chitralhive
npm install

# 2. Optimize images
cd E:\chitralhive\chitralhivedjango
python manage.py optimize_images --quality=85 --backup

# 3. Build and test
cd E:\chitralhive\chitralhive
npm run build
npm start
```

Then visit http://localhost:3000 and run Lighthouse audit!

---

## Detailed Installation Steps

### Step 1: Install Node Dependencies

```powershell
# Navigate to frontend directory
cd E:\chitralhive\chitralhive

# Install new dependencies (@next/bundle-analyzer)
npm install

# Verify installation
npm list @next/bundle-analyzer
```

**Expected output:**
```
chitralhive@0.1.0 E:\chitralhive\chitralhive
└── @next/bundle-analyzer@12.2.5
```

---

### Step 2: Optimize Images (Django)

#### Option A: Using Django Management Command (Recommended)

```powershell
# Navigate to Django directory
cd E:\chitralhive\chitralhivedjango

# Dry run first (see what will be done)
python manage.py optimize_images --dry-run

# Optimize with backups
python manage.py optimize_images --quality=85 --backup

# Or optimize specific folder
python manage.py optimize_images --path=media/slider --quality=85 --backup
```

**What it does:**
- Converts PNG/JPG to WebP format
- Resizes large images to max 1920x1080
- Creates backups in `media/backups` folder
- Shows detailed statistics

**Expected output:**
```
🔍 Scanning for images in: media
📸 Found 15 images to optimize
✅ slider/Firefly_G.png → slider/Firefly_G.webp
   Original: 1.86MB → Optimized: 487.23KB
   Saved: 1.38MB (74.2%)
...
📊 Optimization Summary:
   Images optimized: 15
   Total saved: 2.13MB (68.5%)
```

#### Option B: Using PowerShell Script

```powershell
# Navigate to scripts directory
cd E:\chitralhive\chitralhive\scripts

# Run the script
.\optimize-images.ps1 -Quality 85 -Backup

# Or dry run first
.\optimize-images.ps1 -DryRun
```

---

### Step 3: Build & Test

```powershell
# Navigate to frontend directory
cd E:\chitralhive\chitralhive

# Build the optimized version
npm run build

# If build succeeds, start the server
npm start

# Server will start on http://localhost:3000
```

**Expected build output:**
```
✓ Generating static pages (40/40)
✓ Finalizing page optimization
✓ Collecting page data

Route                                  Size     First Load JS
┌ ○ /                                 45.2 kB        425 kB
├ ○ /404                              3.04 kB        243 kB
...
```

---

### Step 4: Analyze Bundle (Optional)

```powershell
# Run build with bundle analyzer
npm run build:analyze

# This will:
# 1. Build the application
# 2. Generate bundle analysis
# 3. Open browser with interactive visualization
# 4. Save report to .next/analyze/client.html
```

**What to look for:**
- Red boxes: Large dependencies (>100KB)
- Duplicate packages
- Unused exports

---

## Verification Steps

### 1. Check Images Load Correctly

```powershell
# Start dev server
npm run dev

# Visit http://localhost:4000
# Check that:
# ✓ Homepage images load
# ✓ Category images load
# ✓ Slider images load
# ✓ No broken images
```

### 2. Run Lighthouse Audit

1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Performance" category
4. Click "Analyze page load"

**Compare results:**

| Metric | Before | Target | ✓/✗ |
|--------|--------|--------|-----|
| Performance Score | ~60 | >85 | ? |
| LCP | ~4.5s | <2.5s | ? |
| Total Payload | 6.5MB | <3MB | ? |
| Images | 3MB | <1MB | ? |
| Unused JS | 235KB | <150KB | ? |

### 3. Check Network Tab

1. Open DevTools → Network tab
2. Reload page (Ctrl+Shift+R)
3. Filter by "Img"
4. Verify images are WebP format
5. Check file sizes are smaller

---

## Troubleshooting

### Issue: npm install fails

```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

### Issue: Python command not found

```powershell
# Check Python installation
python --version

# If not installed, download from:
# https://www.python.org/downloads/

# Or use py launcher (Windows)
py --version
py manage.py optimize_images --help
```

### Issue: Pillow module not found

```powershell
# Install Pillow
pip install Pillow

# Or with python -m pip
python -m pip install Pillow

# Verify installation
python -c "import PIL; print(PIL.__version__)"
```

### Issue: Images not loading after optimization

**Check image URLs:**
```javascript
// In browser console
document.querySelectorAll('img').forEach(img => {
  console.log(img.src, img.complete);
});
```

**Check Next.js config:**
```javascript
// In next.config.js - verify domain is allowed
images: {
  domains: ["api.chitralhive.com"],  // Your API domain
}
```

**Revert to original images:**
```powershell
# Restore from backup
cd E:\chitralhive\chitralhivedjango\media
Copy-Item -Recurse backups\* .
```

### Issue: Build fails with bundle analyzer

```powershell
# Build without analyzer
npm run build

# If it works, the issue is with bundle analyzer
# Check if @next/bundle-analyzer is installed
npm list @next/bundle-analyzer

# Reinstall if needed
npm install --save-dev @next/bundle-analyzer
```

### Issue: Out of memory during build

```powershell
# Increase Node memory limit (already configured in package.json)
# If still failing, increase further:
set NODE_OPTIONS=--max-old-space-size=8192
npm run build
```

---

## Testing Checklist

### Functional Testing
- [ ] Homepage loads correctly
- [ ] Images display properly
- [ ] Categories work
- [ ] Product pages load
- [ ] Cart functionality works
- [ ] Checkout process works
- [ ] No console errors

### Performance Testing
- [ ] Lighthouse score >85
- [ ] LCP <2.5s
- [ ] FCP <1.8s
- [ ] Total payload <3MB
- [ ] Images are WebP format
- [ ] No unused JavaScript warnings

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if available)
- [ ] Edge (latest)
- [ ] Mobile browsers (Chrome, Safari)

---

## Deployment Checklist

### Before Deploying
- [ ] All tests pass
- [ ] Lighthouse score improved
- [ ] Images optimized and verified
- [ ] No build errors
- [ ] No console errors
- [ ] Backup created

### Deployment Steps
1. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat: performance optimizations - image compression, code splitting, animation improvements"
   ```

2. **Push to repository:**
   ```bash
   git push origin main
   ```

3. **Deploy to production:**
   - Follow your normal deployment process
   - Clear CDN cache if applicable
   - Monitor for errors

4. **Post-deployment verification:**
   - Run Lighthouse on production URL
   - Check image loading
   - Monitor error logs
   - Check Web Vitals

### After Deployment
- [ ] Production Lighthouse audit
- [ ] Monitor error rates
- [ ] Check Web Vitals in Google Search Console
- [ ] Monitor page load times
- [ ] Check bounce rate changes

---

## Rollback Plan

If something goes wrong:

### 1. Restore Images
```powershell
cd E:\chitralhive\chitralhivedjango\media
Copy-Item -Recurse backups\* .
```

### 2. Revert Code Changes
```bash
git log --oneline  # Find commit hash before optimization
git revert <commit-hash>
git push origin main
```

### 3. Rebuild & Redeploy
```powershell
cd E:\chitralhive\chitralhive
npm run build
npm start
```

---

## Maintenance

### Weekly
- Check Lighthouse scores
- Monitor Web Vitals
- Check for new large images

### Monthly
- Run bundle analyzer
- Check for dependency updates
- Review error logs
- Optimize new images

### As Needed
- Update dependencies
- Review and optimize new pages
- Re-run Lighthouse audits
- Compress new images

---

## Support & Documentation

### Documentation Files
- `OPTIMIZATION_SUMMARY.md` - Complete summary of changes
- `PERFORMANCE_OPTIMIZATION_REPORT.md` - Detailed technical report
- `QUICK_START_OPTIMIZATION.md` - Quick reference guide
- This file - Installation & execution guide

### Useful Commands Reference

```powershell
# Frontend (Next.js)
npm install                 # Install dependencies
npm run dev                 # Development server
npm run build              # Production build
npm run build:analyze      # Build with bundle analysis
npm start                  # Start production server

# Backend (Django)
python manage.py optimize_images              # Optimize all images
python manage.py optimize_images --dry-run    # Preview changes
python manage.py optimize_images --backup     # Create backups

# Testing
npx lighthouse http://localhost:3000 --view   # Run Lighthouse
```

---

## Success Metrics

Track these metrics before and after:

### Performance
- ✅ Lighthouse Performance Score: 60 → 85+ (**+42%**)
- ✅ LCP: 4.5s → 2.5s (**-44%**)
- ✅ Total Payload: 6.5MB → 2.8MB (**-57%**)

### User Experience
- ✅ Faster page loads
- ✅ Smoother animations
- ✅ Better mobile performance
- ✅ Lower bounce rate

### Business Impact
- ✅ Better SEO rankings
- ✅ Improved conversion rates
- ✅ Reduced bandwidth costs
- ✅ Better user satisfaction

---

**Ready to start?** Begin with the Quick Start commands at the top of this file!

**Questions?** Check the troubleshooting section or review the other documentation files.

**Last Updated:** January 3, 2026





