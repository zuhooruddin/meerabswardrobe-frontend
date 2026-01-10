# Meerab's Wardrobe - Setup Checklist

**Domain**: https://meerabs.com/  
**Admin Panel**: https://api.meerabs.com/admin/  
**API Base**: https://api.meerabs.com/

## Pre-Launch Checklist

### 1. Environment Configuration
- [ ] Create `.env.local` file with these variables:
  ```bash
  NEXT_PUBLIC_URL=https://meerabs.com
  NEXT_PUBLIC_COMPANY_NAME=Meerab's Wardrobe
  NEXT_PUBLIC_BACKEND_API_BASE=https://api.meerabs.com/
  NEXT_PUBLIC_IMAGE_BASE_API_URL=https://api.meerabs.com/media/
  ```

### 2. Database Setup
- [ ] Create PostgreSQL user: `meerabs`
- [ ] Create database: `meerabs_wardrobe`
- [ ] Migrate existing data (if any) from old database
- [ ] Run Django migrations: `python manage.py migrate`
- [ ] Create superuser: `python manage.py createsuperuser`

### 3. Branding Assets
- [ ] Design new logo for Meerab's Wardrobe
- [ ] Upload logo to Django admin panel (Footer Logo field)
- [ ] Create OG image (1200x630px) at `/public/images/og-image.jpg`
- [ ] Replace favicon at `/public/favicon.ico`
- [ ] Update any product images to reflect women's clothing

### 4. Content Updates
- [ ] Update About Us page content
- [ ] Update FAQ page with women's fashion Q&A
- [ ] Review and update Privacy Policy
- [ ] Review and update Return Policy (especially sizing/fit info)
- [ ] Update Contact Us page information

### 5. Product Catalog
- [ ] Create women's clothing categories:
  - [ ] Formal Wear
  - [ ] Casual Wear
  - [ ] Traditional Wear
  - [ ] Western Wear
  - [ ] Party Dresses
  - [ ] Tops & Blouses
  - [ ] Bottoms (Pants, Skirts)
  - [ ] Plus Size
  - [ ] Accessories
- [ ] Upload product images
- [ ] Add size charts for clothing items
- [ ] Set up inventory management
- [ ] Configure pricing and currency (PKR)

### 6. Social Media Setup
- [ ] Create Facebook page: @meerabswardrobe
- [ ] Create Instagram account: @meerabswardrobe
- [ ] Create Twitter account: @meerabswardrobe
- [ ] Update social media links in Django admin footer settings
- [ ] Create branded cover photos for all platforms

### 7. Email Configuration
- [ ] Update email templates with new branding
- [ ] Test order confirmation emails
- [ ] Test password reset emails
- [ ] Test newsletter subscription emails
- [ ] Update sender name to "Meerab's Wardrobe"

### 8. Payment Gateway
- [ ] Set up payment gateway (Stripe/JazzCash/EasyPaisa)
- [ ] Test payment flow
- [ ] Configure shipping costs
- [ ] Set up tax calculations (if applicable)

### 9. Testing
- [ ] Test homepage loading
- [ ] Test product browsing and filtering
- [ ] Test product detail pages
- [ ] Test add to cart functionality
- [ ] Test checkout process
- [ ] Test user registration and login
- [ ] Test password reset
- [ ] Test order tracking
- [ ] Test mobile responsiveness
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)

### 10. SEO & Analytics
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics
- [ ] Set up Facebook Pixel (optional)
- [ ] Verify all meta tags are showing correctly
- [ ] Test Open Graph images on Facebook/Twitter
- [ ] Set up Google My Business (if physical location)

### 11. Legal & Compliance
- [ ] Ensure Privacy Policy is comprehensive
- [ ] Ensure Terms & Conditions are updated
- [ ] Add GDPR compliance notice (if targeting EU)
- [ ] Set up cookie consent banner (optional)
- [ ] Ensure payment security compliance

### 12. Performance Optimization
- [ ] Run Lighthouse audit
- [ ] Optimize all images (WebP format recommended)
- [ ] Test page load speeds
- [ ] Verify caching is working
- [ ] Test CDN configuration (if using)

### 13. Domain & Hosting
- [ ] Purchase domain: meerabs.com
- [ ] Configure DNS settings (point to your hosting)
- [ ] Set up SSL certificate (HTTPS) - required!
- [ ] Configure subdomains:
  - [ ] api.meerabs.com → Backend server
  - [ ] admin.meerabs.com → Django admin (or use api.meerabs.com/admin/)
  - [ ] www.meerabs.com → Redirect to meerabs.com
- [ ] Set up email hosting for info@meerabs.com

### 14. Backup & Security
- [ ] Set up automated database backups
- [ ] Set up automated code backups
- [ ] Configure firewall rules
- [ ] Enable Django security settings in production
- [ ] Change all default passwords
- [ ] Review and update Django SECRET_KEY

### 15. Marketing Launch
- [ ] Prepare launch announcement
- [ ] Create promotional graphics
- [ ] Plan social media launch campaign
- [ ] Prepare email marketing campaign
- [ ] Set up promotional offers/coupons
- [ ] Create launch video/photos

---

## Post-Launch Monitoring

### Week 1
- [ ] Monitor error logs daily
- [ ] Check analytics daily
- [ ] Respond to customer inquiries within 24 hours
- [ ] Monitor social media engagement
- [ ] Track conversion rates

### Month 1
- [ ] Review top-selling products
- [ ] Analyze customer feedback
- [ ] Optimize underperforming pages
- [ ] A/B test different elements
- [ ] Plan content calendar for next month

### Ongoing
- [ ] Regular content updates (blog posts, new arrivals)
- [ ] Seasonal collections and promotions
- [ ] Customer satisfaction surveys
- [ ] Regular security updates
- [ ] Database optimization

---

## Quick Commands Reference

### Development
```bash
# Frontend (Next.js)
cd chitralhive
npm install
npm run dev  # Runs on port 4000

# Backend (Django)
cd chitralhivedjango
pip install -r requirements.txt
python manage.py runserver 8000
```

### Production Build
```bash
# Frontend
cd chitralhive
npm run build
npm start

# Backend
cd chitralhivedjango
gunicorn ecommerce_backend.wsgi:application
```

### Database
```bash
# Create database
psql -U postgres
CREATE DATABASE meerabs_wardrobe OWNER meerabs;

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

---

## Support Resources

- **Documentation**: See REBRANDING_SUMMARY.md for detailed changes
- **Theme Colors**: See src/theme/themeColors.js
- **API Endpoints**: Check chitralhivedjango/ecommerce_backend/urls.py

---

*Checklist created: January 10, 2026*










