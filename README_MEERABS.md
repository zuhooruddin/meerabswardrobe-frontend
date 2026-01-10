# 👗 Meerab's Wardrobe - Ecommerce Platform

> Premium Women's Fashion Ecommerce Platform for Pakistan

---

## 🌐 Live URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Main Website** | https://meerabs.com | Customer-facing storefront |
| **API Server** | https://api.meerabs.com | Backend REST API |
| **Admin Panel** | https://api.meerabs.com/admin/ | Django admin interface |
| **Admin Alt** | https://admin.meerabs.com | Alternative admin URL |

---

## 📋 Quick Links to Documentation

- **[REBRANDING_SUMMARY.md](./REBRANDING_SUMMARY.md)** - Complete list of all changes made during rebranding
- **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** - Step-by-step setup and launch checklist
- **[DJANGO_ADMIN_GUIDE.md](./DJANGO_ADMIN_GUIDE.md)** - Comprehensive Django admin panel guide
- **[INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)** - Technical installation instructions

---

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ 
- Python 3.8+
- PostgreSQL 12+
- npm or yarn

### Frontend (Next.js)

```bash
cd chitralhive
npm install
npm run dev  # Development server on port 4000
npm run build  # Production build
npm start  # Start production server
```

### Backend (Django)

```bash
cd chitralhivedjango
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 8000
```

---

## 🎨 Brand Identity

### Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Primary** | `#D946A0` | Buttons, links, accents |
| **Primary Light** | `#FDF4FF` | Backgrounds, hover states |
| **Primary Dark** | `#86198F` | Dark mode, emphasis |
| **Background** | `#F8FAFC` | Light mode background |
| **Dark Background** | `#0F172A` | Dark mode background |

### Typography
- **Font Family**: 'Outfit', sans-serif
- **Letter Spacing**: -0.02em (for headings)

### Logo
- Location: Upload via Django Admin → Site Settings → Site Logo
- Recommended size: 200x60px (transparent background)
- Format: PNG or SVG

---

## 🛠️ Environment Configuration

Create `.env.local` in `chitralhive` directory:

```bash
# Production
NEXT_PUBLIC_URL=https://meerabs.com
NEXT_PUBLIC_COMPANY_NAME=Meerab's Wardrobe
NEXT_PUBLIC_BACKEND_API_BASE=https://api.meerabs.com/
NEXT_PUBLIC_IMAGE_BASE_API_URL=https://api.meerabs.com/media/

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional: Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

---

## 📊 Database Setup

### PostgreSQL Configuration

```sql
-- Connect as postgres user
sudo -u postgres psql

-- Create user
CREATE USER meerabs WITH PASSWORD 'your_secure_password';

-- Create database
CREATE DATABASE meerabs_wardrobe OWNER meerabs;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE meerabs_wardrobe TO meerabs;

-- Exit
\q
```

### Run Migrations

```bash
cd chitralhivedjango
python manage.py migrate
```

---

## 👨‍💼 Admin Panel Access

### Create Admin User

```bash
python manage.py createsuperuser
```

### Login
1. Navigate to https://api.meerabs.com/admin/
2. Enter your superuser credentials
3. Configure Site Settings (see DJANGO_ADMIN_GUIDE.md)

### Must-Configure Settings
- ✅ Site Name: "Meerab's Wardrobe"
- ✅ Site Logo & Footer Logo
- ✅ Contact Information (phone, email)
- ✅ Social Media Links
- ✅ Footer Description
- ✅ Shipping Settings
- ✅ Payment Gateway Configuration

---

## 📦 Product Management

### Recommended Categories
- Formal Wear
- Casual Wear
- Traditional Wear (Suits, Sarees)
- Western Wear
- Party Dresses
- Tops & Blouses
- Bottoms
- Plus Size Collection
- Accessories
- Sale Items

### Product Image Guidelines
- **Resolution**: Minimum 1000x1000px
- **Format**: JPEG or WebP
- **Aspect Ratio**: 1:1 or 4:5
- **File Size**: Under 500KB
- **Background**: White or clean
- **Shots**: Front, back, side, details

---

## 🚢 Deployment

### Frontend (Next.js)

```bash
# Build
npm run build

# Start
npm start

# Or use PM2
pm2 start npm --name "meerabs-frontend" -- start
```

### Backend (Django)

```bash
# Using Gunicorn
gunicorn ecommerce_backend.wsgi:application --bind 0.0.0.0:8000

# Or use PM2
pm2 start gunicorn --name "meerabs-backend" -- ecommerce_backend.wsgi:application --bind 0.0.0.0:8000
```

### Nginx Configuration Example

```nginx
# Frontend
server {
    listen 80;
    server_name meerabs.com www.meerabs.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API
server {
    listen 80;
    server_name api.meerabs.com;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /media/ {
        alias /path/to/chitralhivedjango/media/;
    }
    
    location /static/ {
        alias /path/to/chitralhivedjango/static/;
    }
}
```

---

## 🔒 Security Checklist

- [ ] Change DEBUG to False in production
- [ ] Use strong SECRET_KEY
- [ ] Enable HTTPS/SSL certificates
- [ ] Set CSRF_COOKIE_SECURE = True
- [ ] Set SESSION_COOKIE_SECURE = True
- [ ] Configure firewall
- [ ] Regular backups
- [ ] Update dependencies regularly
- [ ] Use environment variables for secrets
- [ ] Implement rate limiting
- [ ] Enable CORS properly

---

## 📱 Social Media Setup

| Platform | Username | URL |
|----------|----------|-----|
| Facebook | @meerabswardrobe | https://facebook.com/meerabswardrobe |
| Instagram | @meerabswardrobe | https://instagram.com/meerabswardrobe |
| Twitter | @meerabswardrobe | https://twitter.com/meerabswardrobe |
| YouTube | @meerabswardrobe | https://youtube.com/@meerabswardrobe |

**Note**: Create these accounts and update URLs in Django Admin → Site Settings

---

## 📈 Analytics & SEO

### Google Analytics
Add tracking ID in environment variables:
```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### SEO Tasks
- [ ] Submit sitemap to Google Search Console (meerabs.com/sitemap.xml)
- [ ] Verify domain in Google Search Console
- [ ] Create Google My Business listing
- [ ] Optimize product titles and descriptions
- [ ] Add structured data (already implemented)
- [ ] Set up Google Merchant Center (for Shopping ads)
- [ ] Create Facebook Business Page
- [ ] Set up Facebook Pixel (optional)

---

## 🛟 Support & Troubleshooting

### Common Issues

#### Frontend won't start
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### Backend database error
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U meerabs -d meerabs_wardrobe -h localhost
```

#### Images not loading
1. Check MEDIA_URL in settings.py
2. Verify nginx serves /media/ correctly
3. Check file permissions: `chmod -R 755 media/`

### Log Locations
- Frontend: Check terminal output or PM2 logs
- Backend Django: `chitralhivedjango/sys/logs/`
- Nginx: `/var/log/nginx/`
- PostgreSQL: `/var/log/postgresql/`

---

## 📞 Contact & Support

### Business Contact
- **Email**: info@meerabs.com
- **Website**: https://meerabs.com
- **Support**: [Configure in Django Admin]

### Technical Support
- Check documentation files in this directory
- Review Django logs for errors
- Check browser console for frontend errors

---

## 📝 Development Commands

### Frontend
```bash
npm run dev          # Development server
npm run build        # Production build
npm start           # Start production
npm run lint        # Run ESLint
```

### Backend
```bash
python manage.py runserver           # Dev server
python manage.py makemigrations      # Create migrations
python manage.py migrate             # Apply migrations
python manage.py createsuperuser     # Create admin
python manage.py collectstatic       # Collect static files
python manage.py shell               # Django shell
```

---

## 🎯 Next Steps After Setup

1. ✅ Configure environment variables
2. ✅ Set up database
3. ✅ Create superuser
4. ✅ Login to admin panel
5. ✅ Configure Site Settings
6. ✅ Upload logo and branding assets
7. ✅ Create product categories
8. ✅ Add initial products
9. ✅ Configure shipping and payment
10. ✅ Test checkout flow
11. ✅ Set up SSL certificates
12. ✅ Deploy to production
13. ✅ Submit sitemap to search engines
14. ✅ Launch marketing campaign!

---

## 📚 Technology Stack

### Frontend
- **Framework**: Next.js 12
- **UI Library**: Material-UI (MUI) 5
- **Styling**: Emotion, Styled Components
- **State Management**: React Context, SWR
- **Authentication**: NextAuth.js

### Backend
- **Framework**: Django 4.1
- **API**: Django REST Framework
- **Authentication**: JWT, OAuth (Google)
- **Database**: PostgreSQL
- **Task Queue**: Celery (optional)

### Infrastructure
- **Web Server**: Nginx
- **Process Manager**: PM2 or Gunicorn
- **Cache**: Redis (optional)
- **CDN**: (Configure as needed)

---

## 📄 License & Credits

**Project**: Meerab's Wardrobe Ecommerce Platform  
**Rebranded**: January 10, 2026  
**Framework**: Next.js + Django REST Framework

---

## 🎉 Launch Checklist

Before going live:
- [ ] All environment variables set
- [ ] Database configured and migrated
- [ ] Admin panel accessible
- [ ] Site settings configured
- [ ] Products added
- [ ] Payment gateway tested
- [ ] Shipping configured
- [ ] Email notifications working
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] Analytics installed
- [ ] SEO configured
- [ ] Social media accounts created
- [ ] Backup system in place
- [ ] Security hardening complete
- [ ] Performance testing done
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing done

---

**Ready to launch? 🚀**

For detailed setup instructions, see [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)

---

*Last Updated: January 10, 2026*

