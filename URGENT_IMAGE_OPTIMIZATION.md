# 🚨 URGENT: Fix Cache TTL and Large Image Payload

## Current Issues (From Lighthouse)

1. **❌ No Cache TTL** - `slider/Firefly_G….png` has "None" cache
2. **❌ Huge Image** - 1,862.7 KiB (1.8MB) PNG file
3. **❌ Slow Repeat Visits** - Images re-downloaded every time

## ✅ Quick Fix (5 Minutes)

### Step 1: Optimize the Slider Image

```powershell
# Navigate to Django directory
cd E:\chitralhive\chitralhivedjango

# Optimize slider images (creates backups automatically)
python manage.py optimize_images --path=media/slider --quality=85 --backup
```

**Expected Output:**
```
✅ slider/Firefly_G.png → slider/Firefly_G.webp
   Original: 1.86MB → Optimized: 487KB
   Saved: 1.38MB (73.8%)
```

### Step 2: Update Database (If Needed)

If your Django models store image paths, update them to use `.webp` files:

```python
# In Django admin or via management command
# Update image paths from .png to .webp
```

### Step 3: Rebuild Next.js

```powershell
cd E:\chitralhive\chitralhive
npm run build
npm start
```

### Step 4: Verify

1. **Check Network Tab:**
   - Image should be ~500KB (not 1.8MB)
   - Response header: `Cache-Control: public, max-age=31536000, immutable`
   - Format: WebP or AVIF

2. **Run Lighthouse Again:**
   - Cache TTL should show "1y" or "31536000"
   - Payload should be ~500KB instead of 1.8MB

## Why This Works

1. **Next.js Image Optimization:**
   - Automatically converts WebP → AVIF when supported
   - Adds cache headers automatically
   - Serves optimized versions

2. **Smaller File Size:**
   - PNG: 1.8MB
   - WebP: ~500KB (73% smaller)
   - AVIF: ~400KB (78% smaller)

3. **Cache Headers:**
   - Next.js Image API adds: `Cache-Control: public, max-age=31536000, immutable`
   - Browser caches for 1 year
   - Repeat visits are instant

## Expected Results

| Metric | Before | After |
|--------|--------|-------|
| **File Size** | 1,863 KiB | ~500 KiB |
| **Cache TTL** | None | 1 year |
| **Format** | PNG | WebP/AVIF |
| **Repeat Visit** | Slow | Instant |

## If Issues Persist

### Check Next.js Config

Verify `api.chitralhive.com` is in allowed domains:

```javascript
// next.config.js
images: {
  domains: ["api.chitralhive.com"], // ✅ Should be here
}
```

### Check Image URLs

Make sure images are going through Next.js Image optimization:

```javascript
// ✅ Good - Uses Next.js Image
<Image src={imgbaseurl + slider.image} ... />

// ❌ Bad - Direct img tag
<img src={imgbaseurl + slider.image} />
```

### Backend Cache Headers (Optional)

If you want cache headers on the original API images (not just optimized ones), add to your Django/nginx/apache config (see `CACHE_HEADERS_FIX.md`).

## Priority

🔴 **CRITICAL** - This single image is causing:
- 1.8MB unnecessary download
- No caching (re-downloads every visit)
- Poor Lighthouse scores

**Fix this first, then optimize other images!**

---

**Time Required:** 5 minutes  
**Impact:** 73% file size reduction + proper caching  
**Difficulty:** Easy (just run one command)





