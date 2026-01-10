# Django Admin Panel Configuration Guide
## Meerab's Wardrobe

---

## Accessing the Admin Panel

### URLs
- **Production**: https://api.meerabs.com/admin/
- **Alternative**: https://admin.meerabs.com/admin/ (if subdomain is configured)
- **Local Development**: http://localhost:8000/admin/

### Admin Credentials
You'll need to create a superuser account first (see below).

---

## Initial Setup

### 1. Create Superuser Account

```bash
cd chitralhivedjango
python manage.py createsuperuser
```

You'll be prompted for:
- Username
- Email address
- Password

### 2. Login to Admin Panel

1. Navigate to https://api.meerabs.com/admin/
2. Enter your superuser credentials
3. You should see "Welcome to Meerab's Wardrobe Administration"

---

## Configuring Site Settings

### Navigate to Site Settings

1. Login to Django Admin
2. Look for **Site Settings** in the left sidebar
3. Click on "Site Settings" to view/edit

### Important Fields to Update

#### General Settings
- **Site Logo**: Upload your Meerab's Wardrobe logo
- **Site Name**: `Meerab's Wardrobe`
- **Site Meta Title**: `Meerab's Wardrobe | Premium Women's Fashion Pakistan`
- **Site Description**: 
  ```
  Shop premium women's clothing online in Pakistan at Meerab's Wardrobe. 
  Discover elegant dresses, trendy tops, stylish bottoms, traditional wear, 
  and contemporary fashion delivered to your doorstep.
  ```
- **Site Banner Text**: Your promotional message (e.g., "Free Shipping on Orders Over PKR 3000")
- **Site Banner Image**: Upload a promotional banner if needed
- **Currency**: `PKR`

#### Top Bar Settings
- **Top Bar Left Phone**: Your customer service number (e.g., +92-XXX-XXXXXXX)
- **Top Bar Left Email**: `info@meerabs.com`

#### Footer Settings
- **Footer Logo**: Upload footer logo (can be same as site logo or different)
- **Footer Description**: 
  ```
  Discover premium women's fashion. Style and elegance delivered to your doorstep.
  ```
- **Column Two Heading**: e.g., "Quick Links"
- **Column Three Heading**: e.g., "Customer Service"
- **Column Four Heading**: e.g., "Get in Touch"
- **Column Four Content**: Contact information in HTML format:
  ```html
  <p><strong>Phone:</strong> +92-XXX-XXXXXXX</p>
  <p><strong>Email:</strong> info@meerabs.com</p>
  <p><strong>Address:</strong> Your Business Address Here</p>
  ```

#### Social Media Links
- **Facebook**: `https://facebook.com/meerabswardrobe`
- **Instagram**: `https://instagram.com/meerabswardrobe`
- **Twitter**: `https://twitter.com/meerabswardrobe`
- **YouTube**: `https://youtube.com/@meerabswardrobe`

#### Google OAuth Settings (Optional)
- **Google ID**: Your Google OAuth Client ID
- **Google Secret**: Your Google OAuth Client Secret

---

## Managing Products

### Adding Product Categories

1. Go to **Categories** in the admin panel
2. Click "Add Category"
3. Recommended categories for women's clothing:
   - Formal Wear
   - Casual Wear
   - Traditional Wear (Pakistani Suits, Sarees)
   - Western Wear
   - Party Dresses
   - Tops & Blouses
   - Bottoms (Pants, Skirts)
   - Plus Size Collection
   - Accessories
   - Sale Items

### Adding Products

1. Go to **Items** (Products) in the admin panel
2. Click "Add Item"
3. Fill in:
   - **Item Name**: Product name
   - **Description**: Detailed product description
   - **Category**: Select appropriate category
   - **Price**: In PKR
   - **Sale Price**: If on sale
   - **Stock Quantity**: Available quantity
   - **Images**: Upload product images (multiple angles recommended)
   - **Size Options**: Add available sizes (S, M, L, XL, etc.)
   - **Color Options**: Add available colors
   - **SKU**: Unique product identifier
   - **Brand**: If applicable
   - **Meta Tags**: For SEO

### Product Image Guidelines
- **Minimum Resolution**: 1000x1000 pixels
- **Recommended Format**: JPEG or WebP
- **Aspect Ratio**: Square (1:1) or 4:5 for fashion
- **File Size**: Under 500KB after optimization
- **Background**: White or clean background preferred
- **Angles**: Show front, back, side, and detail shots

---

## Managing Orders

### Order Workflow

1. **New Orders**: View all incoming orders
2. **Order Status Options**:
   - Pending
   - Confirmed
   - Processing
   - Shipped
   - Delivered
   - Cancelled

3. **Update Order Status**: Click on order → Change status → Save

### Order Notifications
- Customers receive email notifications on status changes
- Ensure email settings are configured in Django settings.py

---

## User Management

### Customer Accounts
- View registered customers under **Users**
- Can manually create accounts
- Can reset passwords
- Can assign user roles (admin, customer, etc.)

### Permissions
- Control what users can access
- Assign admin privileges carefully
- Regular customers should not have admin access

---

## Content Management

### Homepage Sections

Configure homepage sections:
1. Go to **Homepage Sections** or **Section Sequence**
2. Add/Edit sections:
   - Hero Slider
   - Featured Categories
   - New Arrivals
   - Best Sellers
   - Sale Items
   - Testimonials

### Blog Posts (Optional)

If you want to add fashion tips/news:
1. Go to **Blog Posts**
2. Add articles about:
   - Fashion trends
   - Styling tips
   - Care instructions
   - New collection announcements

---

## SEO Settings

### Per-Page SEO
For each product/category, you can set:
- **Meta Title**: Custom title for search engines
- **Meta Description**: Description shown in search results
- **Keywords**: Relevant keywords
- **Canonical URL**: To avoid duplicate content

### Sitemap
- Automatically generated at: `/sitemap.xml`
- Submit to Google Search Console

---

## Email Configuration

### Email Templates

Email templates are located in:
```
chitralhivedjango/templates/
```

Templates to customize:
1. **email_template.html**: General email template
2. **order_cancel_template.html**: Order cancellation
3. **registration/**: Password reset emails

### Email Settings (settings.py)

Already configured for Gmail SMTP:
- **EMAIL_HOST**: smtp.gmail.com
- **EMAIL_PORT**: 587
- **EMAIL_USE_TLS**: True

Update email credentials:
```python
EMAIL_HOST_USER = 'info@meerabs.com'  # Your email
EMAIL_HOST_PASSWORD = 'your-app-password'  # Gmail app password
DEFAULT_FROM_EMAIL = 'info@meerabs.com'
```

---

## Payment Integration

### Supported Payment Methods

Configure payment gateways:
1. Credit/Debit Cards (via Stripe or local gateway)
2. JazzCash
3. EasyPaisa
4. Bank Transfer
5. Cash on Delivery (COD)

### Stripe Configuration (if using)
Add to Django admin settings or environment variables:
```python
STRIPE_PUBLIC_KEY = 'pk_live_xxxxx'
STRIPE_SECRET_KEY = 'sk_live_xxxxx'
```

---

## Shipping Configuration

### Shipping Zones
Configure shipping costs for different cities:
- Karachi
- Lahore
- Islamabad/Rawalpindi
- Peshawar
- Quetta
- Other cities

### Shipping Rates
Set rates based on:
- Order value (e.g., free shipping over PKR 3000)
- Weight
- Location

---

## Admin Panel Customization

### Branding (Already Done)
The admin panel now shows:
- Header: "Meerab's Wardrobe Admin"
- Title: "Meerab's Wardrobe Admin Portal"
- Index: "Welcome to Meerab's Wardrobe Administration"

### Adding Custom Admin Actions

Edit `chitralhivedjango/inara/admin.py` to add custom bulk actions:

```python
from django.contrib import admin
from .models import Item

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'stock', 'is_active']
    list_filter = ['category', 'is_active', 'created_at']
    search_fields = ['name', 'description', 'sku']
    
    actions = ['mark_as_featured', 'mark_as_sale']
    
    def mark_as_featured(self, request, queryset):
        queryset.update(is_featured=True)
    mark_as_featured.short_description = "Mark selected items as featured"
```

---

## Security Best Practices

### 1. Strong Passwords
- Use complex admin passwords
- Change passwords regularly
- Don't share admin credentials

### 2. HTTPS Only
- Always use HTTPS for admin panel
- Never login over HTTP
- Enable HSTS headers

### 3. Limit Admin Access
- Create specific admin users with limited permissions
- Don't use superuser for daily operations
- Log all admin actions

### 4. Regular Backups
```bash
# Backup database daily
pg_dump -U meerabs meerabs_wardrobe > backup_$(date +%Y%m%d).sql

# Backup media files
tar -czf media_backup_$(date +%Y%m%d).tar.gz media/
```

### 5. Update Django Settings for Production

In `settings.py`:
```python
DEBUG = False  # NEVER True in production
ALLOWED_HOSTS = ['meerabs.com', 'api.meerabs.com', 'admin.meerabs.com']
SECRET_KEY = 'use-strong-random-key-here'  # Generate new key
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
```

---

## Maintenance Tasks

### Daily
- [ ] Check new orders
- [ ] Respond to customer inquiries
- [ ] Monitor error logs

### Weekly
- [ ] Add new products
- [ ] Update product inventory
- [ ] Review and approve product reviews
- [ ] Check analytics

### Monthly
- [ ] Backup database
- [ ] Review sales reports
- [ ] Update seasonal collections
- [ ] Check for security updates

---

## Troubleshooting

### Can't Login to Admin
1. Check if superuser exists: `python manage.py createsuperuser`
2. Verify ALLOWED_HOSTS includes your domain
3. Check if database is accessible
4. Clear browser cookies

### Images Not Showing
1. Check MEDIA_URL and MEDIA_ROOT settings
2. Verify file permissions on media directory
3. Ensure web server serves media files
4. Check image domains in next.config.js

### Email Not Sending
1. Verify EMAIL_HOST_USER and EMAIL_HOST_PASSWORD
2. For Gmail, use App Password (not regular password)
3. Check firewall allows SMTP port 587
4. Test with Django shell: `python manage.py shell`

### Database Connection Error
1. Check PostgreSQL is running: `sudo systemctl status postgresql`
2. Verify database credentials in settings.py
3. Ensure database exists: `psql -U postgres -l`
4. Check network connectivity

---

## Support & Resources

### Documentation
- Django Admin: https://docs.djangoproject.com/en/4.1/ref/contrib/admin/
- Django REST Framework: https://www.django-rest-framework.org/
- Next.js: https://nextjs.org/docs

### Log Files
- Django logs: `chitralhivedjango/sys/logs/`
- Gunicorn logs: `chitralhivedjango/gunicorn.log`

---

## Quick Reference Commands

```bash
# Start Django development server
python manage.py runserver

# Create superuser
python manage.py createsuperuser

# Run migrations
python manage.py migrate

# Create migrations after model changes
python manage.py makemigrations

# Collect static files
python manage.py collectstatic

# Start Celery (for background tasks)
celery -A ecommerce_backend worker -l info

# Check Django version
python manage.py --version

# Django shell (for testing)
python manage.py shell
```

---

*Last Updated: January 10, 2026*
*Meerab's Wardrobe Admin Guide*

