# 🎯 Quick Command Reference Card

Copy and paste these commands directly!

---

## 🚀 GETTING STARTED (Copy & Run)

```powershell
# === STEP 1: Install Dependencies ===
cd E:\chitralhive\chitralhive
npm install

# === STEP 2: Optimize Images ===
cd E:\chitralhive\chitralhivedjango
python manage.py optimize_images --backup

# === STEP 3: Build & Start ===
cd E:\chitralhive\chitralhive
npm run build
npm start

# === STEP 4: Test ===
# Visit: http://localhost:3000
# Run Lighthouse in Chrome DevTools
```

---

## 📦 IMAGE OPTIMIZATION

```powershell
# Navigate to Django directory
cd E:\chitralhive\chitralhivedjango

# Preview what will be optimized (safe, no changes)
python manage.py optimize_images --dry-run

# Optimize all images with backups
python manage.py optimize_images --backup

# Optimize specific folder
python manage.py optimize_images --path=media/slider --backup

# Custom quality (default: 85)
python manage.py optimize_images --quality=80 --backup

# Help / see all options
python manage.py optimize_images --help
```

---

## 🏗️ BUILD & DEVELOPMENT

```powershell
# Navigate to frontend directory
cd E:\chitralhive\chitralhive

# === Development ===
npm run dev                    # Start dev server on port 4000

# === Production Build ===
npm run build                  # Build optimized version
npm start                      # Start production server

# === Bundle Analysis ===
npm run build:analyze          # Build + analyze bundle size
# Opens browser with interactive bundle visualization

# === Clean Build ===
Remove-Item -Recurse -Force .next
npm run build
```

---

## 🔍 TESTING & DEBUGGING

```powershell
# === Lighthouse ===
# Manual: Chrome DevTools → Lighthouse tab
# Or CLI:
npx lighthouse http://localhost:3000 --view
npx lighthouse http://localhost:3000 --only-categories=performance --view

# === Check Bundle Size ===
npm run build:analyze

# === Check Image Formats ===
# In browser console:
document.querySelectorAll('img').forEach(img => console.log(img.src));

# === Verify Dependencies ===
cd E:\chitralhive\chitralhive
npm list @next/bundle-analyzer    # Should show version

# === Check Python/Pillow ===
cd E:\chitralhive\chitralhivedjango
python --version                   # Should show Python 3.x
python -c "import PIL; print(PIL.__version__)"  # Should show Pillow version
```

---

## 🔧 TROUBLESHOOTING

```powershell
# === Clear npm cache ===
npm cache clean --force
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# === Fix build errors ===
Remove-Item -Recurse -Force .next
npm run build

# === Restore original images ===
cd E:\chitralhive\chitralhivedjango\media
Copy-Item -Recurse backups\* .

# === Install Pillow ===
pip install Pillow
# Or:
python -m pip install Pillow

# === Check for port conflicts ===
# If port 4000 in use:
npm run dev -- -p 4001  # Use different port

# === Memory issues during build ===
set NODE_OPTIONS=--max-old-space-size=8192
npm run build
```

---

## 📊 MONITORING

```powershell
# === Check file sizes ===
cd E:\chitralhive\chitralhivedjango\media
Get-ChildItem -Recurse | Select-Object Name, Length | Sort-Object Length -Descending

# === Bundle size ===
cd E:\chitralhive\chitralhive\.next\static\chunks
Get-ChildItem | Select-Object Name, Length | Sort-Object Length -Descending

# === Check WebP conversion ===
cd E:\chitralhive\chitralhivedjango\media\slider
Get-ChildItem *.webp | Measure-Object -Property Length -Sum
```

---

## 🎨 SPECIFIC OPTIMIZATIONS

```powershell
# === Optimize slider images only ===
cd E:\chitralhive\chitralhivedjango
python manage.py optimize_images --path=media/slider --quality=85 --max-width=1920 --backup

# === Optimize category icons only ===
python manage.py optimize_images --path=media/category_icon --quality=85 --max-width=800 --backup

# === Optimize product images only ===
python manage.py optimize_images --path=media/item_image --quality=85 --max-width=1200 --backup

# === High quality (larger files) ===
python manage.py optimize_images --quality=95 --backup

# === Maximum compression (lower quality) ===
python manage.py optimize_images --quality=70 --backup
```

---

## 🚀 DEPLOYMENT

```powershell
# === Pre-deployment checklist ===
cd E:\chitralhive\chitralhive

# 1. Ensure clean build
Remove-Item -Recurse -Force .next
npm run build

# 2. Test locally
npm start
# Visit http://localhost:3000 and test

# 3. Run Lighthouse
# Chrome DevTools → Lighthouse → Analyze

# === Git commands ===
git status
git add .
git commit -m "feat: performance optimizations - 57% payload reduction"
git push origin main

# === After deployment ===
# Run Lighthouse on production URL
# Monitor error logs
# Check Google Search Console Web Vitals
```

---

## 📁 USEFUL PATHS

```powershell
# === Frontend ===
cd E:\chitralhive\chitralhive                      # Main frontend directory
cd E:\chitralhive\chitralhive\.next                # Build output
cd E:\chitralhive\chitralhive\.next\analyze        # Bundle analysis reports
cd E:\chitralhive\chitralhive\scripts              # Optimization scripts

# === Backend ===
cd E:\chitralhive\chitralhivedjango                # Main Django directory
cd E:\chitralhive\chitralhivedjango\media          # Media files
cd E:\chitralhive\chitralhivedjango\media\backups  # Image backups

# === Documentation ===
cd E:\chitralhive\chitralhive
# Open any of:
# - PERFORMANCE_README.md (start here)
# - INSTALLATION_GUIDE.md (detailed guide)
# - OPTIMIZATION_SUMMARY.md (what was done)
# - QUICK_START_OPTIMIZATION.md (reference)
# - PERFORMANCE_VISUAL_GUIDE.md (comparisons)
```

---

## 🔑 KEY FILES

```powershell
# === Configuration ===
E:\chitralhive\chitralhive\next.config.js          # Next.js config
E:\chitralhive\chitralhive\package.json            # Dependencies

# === Image Optimization ===
E:\chitralhive\chitralhivedjango\inara\management\commands\optimize_images.py
E:\chitralhive\chitralhive\scripts\optimize-images.ps1
E:\chitralhive\chitralhive\scripts\optimize-images.sh

# === Optimized Components ===
E:\chitralhive\chitralhive\src\pages-sections\market-2\Section6.jsx
E:\chitralhive\chitralhive\pages\index.jsx
E:\chitralhive\chitralhive\pages\_app.jsx
E:\chitralhive\chitralhive\pages\_document.jsx
E:\chitralhive\chitralhive\src\utils\GoogleAnalytics.jsx
```

---

## 🎯 ONE-LINER SHORTCUTS

```powershell
# Full optimization in one go (if everything is installed)
cd E:\chitralhive\chitralhivedjango && python manage.py optimize_images --backup && cd E:\chitralhive\chitralhive && npm run build && npm start

# Quick rebuild
cd E:\chitralhive\chitralhive && Remove-Item -Recurse -Force .next && npm run build

# Quick test
cd E:\chitralhive\chitralhive && npm start

# Check everything
cd E:\chitralhive\chitralhive && npm list @next/bundle-analyzer && cd E:\chitralhive\chitralhivedjango && python manage.py optimize_images --help
```

---

## 📱 BROWSER TESTING

```javascript
// === Paste in browser console ===

// Check image formats
document.querySelectorAll('img').forEach(img => {
  console.log(img.src.includes('.webp') ? '✅ WebP:' : '⚠️ Other:', img.src);
});

// Check image sizes
const images = Array.from(document.querySelectorAll('img'));
Promise.all(images.map(img => fetch(img.src).then(r => r.blob()).then(blob => ({
  url: img.src,
  size: (blob.size / 1024).toFixed(2) + ' KB'
})))).then(console.table);

// Check JavaScript bundles
performance.getEntriesByType('resource')
  .filter(r => r.name.includes('.js'))
  .map(r => ({
    name: r.name.split('/').pop(),
    size: (r.transferSize / 1024).toFixed(2) + ' KB',
    time: r.duration.toFixed(2) + ' ms'
  }))
  .sort((a, b) => parseFloat(b.size) - parseFloat(a.size))
  .forEach(r => console.log(r));
```

---

## ✅ VERIFICATION CHECKLIST

```powershell
# Run these commands to verify everything is set up:

# 1. Check Node.js
node --version                 # Should be v14+

# 2. Check npm dependencies
cd E:\chitralhive\chitralhive
npm list @next/bundle-analyzer # Should show version

# 3. Check Python
python --version               # Should be 3.x

# 4. Check Pillow
python -c "import PIL; print(PIL.__version__)"  # Should show version

# 5. Check Django command
cd E:\chitralhive\chitralhivedjango
python manage.py optimize_images --help  # Should show help

# 6. Test build
cd E:\chitralhive\chitralhive
npm run build                  # Should complete successfully

# ✅ If all pass, you're ready to optimize!
```

---

## 💡 PRO TIPS

```powershell
# === Use variables for quick navigation ===
$fe = "E:\chitralhive\chitralhive"
$be = "E:\chitralhive\chitralhivedjango"
cd $fe  # Quick navigate to frontend
cd $be  # Quick navigate to backend

# === Create aliases (add to PowerShell profile) ===
function cfe { cd E:\chitralhive\chitralhive }
function cbe { cd E:\chitralhive\chitralhivedjango }
function opt { cbe; python manage.py optimize_images --backup }
function dev { cfe; npm run dev }
function prod { cfe; npm run build; npm start }

# === Save bundle size for comparison ===
cd E:\chitralhive\chitralhive
npm run build > build-results.txt
# Compare with next build
```

---

**Need more details?** Check `PERFORMANCE_README.md` → it points to all other docs!

**Ready to start?** Run the commands under "GETTING STARTED"!

---

*Last updated: January 3, 2026*





