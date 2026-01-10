# Meerab's Wardrobe - Rebranding Summary

## Overview
This document summarizes the rebranding changes from **Chitral Hive** to **Meerab's Wardrobe** - a premium women's clothing ecommerce shop.

**Domain**: https://meerabs.com/  
**Admin Panel**: https://admin.meerabs.com/ or https://api.meerabs.com/admin/  
**API Base**: https://api.meerabs.com/

---

## Changes Made

### 1. SEO & Metadata Updates

#### `src/components/SEO.jsx`
- **Base URL**: Changed from `https://chitralhive.com` to `https://meerabs.com`
- **Default Description**: Updated to focus on women's fashion
  - New: "Shop premium women's clothing online in Pakistan at Meerab's Wardrobe. Discover elegant dresses, trendy tops, stylish bottoms, traditional wear, and contemporary fashion..."
- **Keywords**: Changed to women's fashion keywords
  - "women's clothing Pakistan, ladies fashion Pakistan, women's dresses online, designer clothes Pakistan, ethnic wear Pakistan, etc."
- **Site Name**: Changed from "Chitral Hive" to "Meerab's Wardrobe"
- **Social Media**: Twitter handle changed from @chitralhive to @meerabswardrobe
- **Geo Location**: Updated from Chitral-specific to Pakistan-wide
- **Brand Color**: Changed tile color from blue (#1976d2) to elegant pink-magenta (#d946a0)

#### `src/utils/OpenGraphTags.jsx`
- Updated all Open Graph and Twitter Card metadata
- Changed titles, descriptions, and social handles
- Updated base URL to meerabs.com

### 2. Configuration Files

#### `next.config.js`
- **Image Domains**: Updated from `api.chitralhive.com` to `api.meerabs.com`
- **CSP Headers**: Updated Content-Security-Policy to allow connections to new domains (api.meerabs.com, admin.meerabs.com, meerabs.com)

#### `package.json`
- **Name**: Changed from "ecommerce_frontend" to "meerabs_wardrobe_frontend"

### 3. Backend Configuration

#### `chitralhivedjango/ecommerce_backend/settings.py`
- **Allowed Hosts**: Updated to include `meerabs.com`, `api.meerabs.com`, `admin.meerabs.com`, and `www.meerabs.com`
- **Database Name**: Changed from `chitral_hive` to `meerabs_wardrobe`
- **Database User**: Changed from `chitral` to `meerabs`

#### `chitralhivedjango/inara/admin.py`
- **Admin Site Header**: Set to "Meerab's Wardrobe Admin"
- **Admin Site Title**: Set to "Meerab's Wardrobe Admin Portal"
- **Admin Index Title**: Set to "Welcome to Meerab's Wardrobe Administration"

### 4. UI Components

#### `src/components/footer/Footer.jsx`
- **Logo Alt Text**: Updated from "Meerab's Wardrobe Logo" to "Meerab's Wardrobe Logo"
- **Default Description**: Changed to "Discover premium women's fashion. Style and elegance delivered to your doorstep."
- **Copyright**: Updated to "© 2026 Meerab's Wardrobe. All rights reserved."
- **Aria Labels**: Updated for accessibility

### 5. Theme & Styling

#### `src/theme/themeColors.js`
- **Primary Color Palette**: Changed from red tones to elegant pink-magenta
  - Main: `#D946A0` (elegant pink-magenta for fashion boutique)
  - Light: `#FDF4FF` (soft lavender background)
  - Dark: `#86198F` (deep purple for contrast)
- **Action Colors**: Updated hover/focus states to use new pink-magenta theme
- **Brand Identity**: Colors now reflect modern, feminine fashion aesthetic

### 6. API & Server Configuration

#### `src/utils/backend_server_ip.jsx`
- **Server IP**: Changed from `http://chitralhive.com/api` to `https://api.meerabs.com`

#### `pages/_app.jsx` & `pages/_document.jsx`
- **Preconnect Links**: Updated API preconnect to `api.meerabs.com`
- **DNS Prefetch**: Updated to `api.meerabs.com`
- **Geo Tags**: Changed from Chitral-specific to Pakistan-wide

---

## Environment Setup Required

### Frontend Environment Variables
Create a `.env.local` file in the `chitralhive` directory with:

```bash
NEXT_PUBLIC_URL=https://meerabs.com
NEXT_PUBLIC_COMPANY_NAME=Meerab's Wardrobe
NEXT_PUBLIC_BACKEND_API_BASE=https://api.meerabs.com/
NEXT_PUBLIC_IMAGE_BASE_API_URL=https://api.meerabs.com/media/
```

### Backend Database Setup
You'll need to create the new PostgreSQL database:

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create new user
CREATE USER meerabs WITH PASSWORD 'meerabs';

-- Create new database
CREATE DATABASE meerabs_wardrobe OWNER meerabs;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE meerabs_wardrobe TO meerabs;
```

Then migrate your existing data from `chitral_hive` database to `meerabs_wardrobe`:

```bash
# Dump existing data
pg_dump -U chitral chitral_hive > chitral_backup.sql

# Restore to new database
psql -U meerabs meerabs_wardrobe < chitral_backup.sql
```

---

## Assets That Need Updating

### Logo & Branding Images
1. **Logo**: Replace `footer_logo` in the database or upload new logo
2. **OG Image**: Create new `/public/images/og-image.jpg` (1200x630px) with Meerab's Wardrobe branding
3. **Favicon**: Update `/public/favicon.ico` with new brand icon

### Social Media Graphics
- Create branded graphics for social media sharing
- Update featured images for products/categories

---

## Product Categories Suggestions

For a women's clothing store, consider these categories:
- Formal Wear
- Casual Wear
- Traditional Wear (Pakistani Suits, Sarees, etc.)
- Western Wear
- Party Dresses
- Tops & Blouses
- Bottoms (Pants, Skirts, etc.)
- Accessories
- Plus Size Collection
- Modest Wear

---

## Marketing & SEO Recommendations

### Keywords to Target
- Women's clothing Pakistan
- Ladies fashion online
- Pakistani designer wear
- Ethnic wear for women
- Party dresses Pakistan
- Formal wear ladies
- Casual wear women
- Online boutique Pakistan

### Content Strategy
1. Create blog posts about fashion trends
2. Style guides and outfit inspiration
3. Size guides and fit recommendations
4. Care instructions for different fabrics
5. Seasonal collections and lookbooks

---

## Next Steps

1. ✅ Update all code references (COMPLETED)
2. ⏳ Create/upload new logo and branding images
3. ⏳ Set up environment variables
4. ⏳ Create and migrate database
5. ⏳ Update product catalog with women's clothing items
6. ⏳ Create new social media accounts (@meerabswardrobe)
7. ⏳ Design and implement custom OG image
8. ⏳ Test all functionality with new branding
9. ⏳ Update any email templates with new branding
10. ⏳ Launch and promote!

---

## Support & Maintenance

### Color Palette Reference
- **Primary**: `#D946A0` (Pink-Magenta)
- **Primary Light**: `#FDF4FF` (Soft Lavender)
- **Primary Dark**: `#86198F` (Deep Purple)
- **Background**: `#F8FAFC` (Light)
- **Background Dark**: `#0F172A` (Dark Navy)

### Typography
The theme uses 'Outfit' font family for headings with -0.02em letter spacing for a modern, premium look.

---

## Contact Information Template

Update your contact details in the Django admin panel:
- **Business Name**: Meerab's Wardrobe
- **Email**: info@meerabs.com
- **Phone**: [Your Phone Number]
- **Address**: [Your Business Address]
- **Website**: https://meerabs.com
- **Social Media**:
  - Facebook: https://facebook.com/meerabswardrobe
  - Instagram: https://instagram.com/meerabswardrobe
  - Twitter: https://twitter.com/meerabswardrobe

---

*Last Updated: January 10, 2026*










