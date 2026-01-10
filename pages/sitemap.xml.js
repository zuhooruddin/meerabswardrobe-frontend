// pages/sitemap.xml.js

function generateSiteMap(pages) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
           xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
     ${pages
       .map(({ loc, lastmod, changefreq, priority, images }) => {
         return `
       <url>
           <loc>${loc}</loc>
           ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
           ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ''}
           ${priority ? `<priority>${priority}</priority>` : ''}
           ${images && images.length > 0 ? images.map(img => `
           <image:image>
             <image:loc>${img.url}</image:loc>
             ${img.title ? `<image:title>${img.title}</image:title>` : ''}
             ${img.caption ? `<image:caption>${img.caption}</image:caption>` : ''}
           </image:image>`).join('') : ''}
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://meerabs.com';
  // Get API base URL - ensure it has trailing slash (matches API pattern: baseUrl + endpoint)
  let apiBase = process.env.NEXT_PUBLIC_BACKEND_API_BASE || 'https://api.meerabs.com/';
  // Ensure it ends with a slash (API pattern: baseUrl + endpoint)
  if (!apiBase.endsWith('/')) {
    apiBase = apiBase + '/';
  }
  
  // Static pages with high priority
  const staticPages = [
    {
      loc: baseUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '1.0',
    },
    {
      loc: `${baseUrl}/products`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '0.9',
    },
    {
      loc: `${baseUrl}/brands`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.9',
    },
    {
      loc: `${baseUrl}/categories`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.9',
    },
    {
      loc: `${baseUrl}/about-us`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.8',
    },
    {
      loc: `${baseUrl}/contact-us`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.7',
    },
    {
      loc: `${baseUrl}/privacy-policy`,
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: '0.5',
    },
    {
      loc: `${baseUrl}/return-policy`,
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: '0.5',
    },
  ];

  let dynamicPages = [];

  // Helper function to fetch with better error handling
  const fetchWithTimeout = async (url, timeout = 10000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });
      clearTimeout(id);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(id);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  };

  try {
    // Fetch all categories - API pattern: baseUrl + endpoint (no slash)
    const categoriesUrl = `${apiBase}getNavCategories`;
    const categoriesData = await fetchWithTimeout(categoriesUrl);
    
    // Handle different response formats
    const categories = Array.isArray(categoriesData) 
      ? categoriesData 
      : (categoriesData?.data && Array.isArray(categoriesData.data) 
          ? categoriesData.data 
          : []);
    
    if (categories && categories.length > 0) {
      // Add category pages
      const categoryPages = categories.map((category) => ({
        loc: `${baseUrl}/category/${category.slug || category.id}`,
        lastmod: category.updated_at || category.updatedAt || new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.8',
      }));
      
      dynamicPages = [...dynamicPages, ...categoryPages];
    }
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    // Continue even if this fails
  }

  try {
    // Fetch all items/products from the main catalog (most important)
    const allItemsUrl = `${apiBase}getAllItems`;
    const allItemsData = await fetchWithTimeout(allItemsUrl);
    
    // Handle different response formats
    const items = Array.isArray(allItemsData) 
      ? allItemsData 
      : (allItemsData?.data && Array.isArray(allItemsData.data) 
          ? allItemsData.data 
          : (allItemsData?.items && Array.isArray(allItemsData.items)
              ? allItemsData.items
              : []));
    
    if (items && items.length > 0) {
      const imgBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_API_URL || `${apiBase}/media/`;
      const allProductPages = items.map((item) => ({
        loc: `${baseUrl}/product/${item.slug || item.id}`,
        lastmod: item.updated_at || item.updatedAt || item.created_at || item.createdAt || new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.7',
        images: item.imgUrl || item.image ? [{
          url: (imgBaseUrl + (item.imgUrl || item.image)).replace(/\/+/g, '/').replace(/^https?:\//, 'https://'),
          title: item.name || 'Women\'s Clothing',
          caption: item.description || item.name ? `Buy ${item.name} from Meerab's Wardrobe - Premium Women's Clothing` : 'Premium Women\'s Clothing'
        }] : []
      }));
      
      dynamicPages = [...dynamicPages, ...allProductPages];
    }
  } catch (error) {
    console.error('Error fetching all items:', error.message);
    // Continue even if this fails
  }

  try {
    // Fetch featured/new arrival products
    const productsUrl = `${apiBase}getFearuredProduct?type=new`;
    const productsData = await fetchWithTimeout(productsUrl);
    
    const products = Array.isArray(productsData) 
      ? productsData 
      : (productsData?.data && Array.isArray(productsData.data) 
          ? productsData.data 
          : []);
    
    if (products && products.length > 0) {
      const imgBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_API_URL || `${apiBase}/media/`;
      const productPages = products.map((product) => ({
        loc: `${baseUrl}/product/${product.slug || product.id}`,
        lastmod: product.updated_at || product.updatedAt || product.created_at || product.createdAt || new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.8',
        images: product.imgUrl || product.image ? [{
          url: (imgBaseUrl + (product.imgUrl || product.image)).replace(/\/+/g, '/').replace(/^https?:\//, 'https://'),
          title: product.name || 'Women\'s Clothing',
          caption: product.description || product.name ? `Buy ${product.name} from Meerab's Wardrobe` : 'Women\'s Clothing'
        }] : []
      }));
      
      // Only add if not already in dynamicPages (avoid duplicates)
      const existingUrls = new Set(dynamicPages.map(p => p.loc));
      const newProductPages = productPages.filter(p => !existingUrls.has(p.loc));
      dynamicPages = [...dynamicPages, ...newProductPages];
    }
  } catch (error) {
    console.error('Error fetching featured products:', error.message);
    // Continue even if this fails
  }

  try {
    // Fetch brand bundles
    const brandBundlesUrl = `${apiBase}getBrandBundels`;
    const brandBundlesData = await fetchWithTimeout(brandBundlesUrl);
    
    const bundles = Array.isArray(brandBundlesData) 
      ? brandBundlesData 
      : (brandBundlesData?.data && Array.isArray(brandBundlesData.data) 
          ? brandBundlesData.data 
          : []);
    
    if (bundles && bundles.length > 0) {
      const bundlePages = bundles.map((bundle) => ({
        loc: `${baseUrl}/bundle/${bundle.slug || bundle.id}`,
        lastmod: bundle.updated_at || bundle.updatedAt || new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.7',
      }));
      
      dynamicPages = [...dynamicPages, ...bundlePages];
    }
  } catch (error) {
    console.error('Error fetching brand bundles:', error.message);
    // Continue even if this fails
  }

  try {
    // Fetch product bundles
    const productBundlesUrl = `${apiBase}getProductBundels`;
    const productBundlesData = await fetchWithTimeout(productBundlesUrl);
    
    const bundles = Array.isArray(productBundlesData) 
      ? productBundlesData 
      : (productBundlesData?.data && Array.isArray(productBundlesData.data) 
          ? productBundlesData.data 
          : []);
    
    if (bundles && bundles.length > 0) {
      const bundlePages = bundles.map((bundle) => ({
        loc: `${baseUrl}/bundle/${bundle.slug || bundle.id}`,
        lastmod: bundle.updated_at || bundle.updatedAt || new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.7',
      }));
      
      dynamicPages = [...dynamicPages, ...bundlePages];
    }
  } catch (error) {
    console.error('Error fetching product bundles:', error.message);
    // Continue even if this fails
  }

  try {
    // Fetch brands if API endpoint exists
    const brandsUrl = `${apiBase}getAllBrands`;
    const brandsData = await fetchWithTimeout(brandsUrl, 5000);
    
    const brands = Array.isArray(brandsData) 
      ? brandsData 
      : (brandsData?.data && Array.isArray(brandsData.data) 
          ? brandsData.data 
          : (brandsData?.brands && Array.isArray(brandsData.brands)
              ? brandsData.brands
              : []));
    
    if (brands && brands.length > 0) {
      const brandPages = brands.map((brand) => ({
        loc: `${baseUrl}/brand/${brand.slug || brand.id}`,
        lastmod: brand.updated_at || brand.updatedAt || new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.7',
      }));
      
      dynamicPages = [...dynamicPages, ...brandPages];
    }
  } catch (error) {
    // Silently fail if brands endpoint doesn't exist or times out
    // This is optional data
  }

  // Remove duplicate URLs (in case products appear in multiple endpoints)
  const uniquePages = Array.from(
    new Map([...staticPages, ...dynamicPages].map(page => [page.loc, page])).values()
  );

  // Generate the XML sitemap
  const sitemap = generateSiteMap(uniquePages);

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=7200, stale-while-revalidate=3600');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
