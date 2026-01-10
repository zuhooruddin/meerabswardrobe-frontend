import Head from "next/head";
import React from "react";
import { useRouter } from "next/router";

const SEO = ({ 
  title, 
  description, 
  metaTitle, 
  sitename, 
  keywords, 
  image, 
  canonical, 
  noindex = false,
  type = "website", // website, article, product, etc.
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
  price,
  priceCurrency = "EUR",
  availability,
  brand,
  category,
  sku,
  rating,
  reviewCount
}) => {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://meerabs.com";
  const defaultDescription = "Shop premium women's clothing online in Europe at Meerab's Wardrobe. Discover elegant dresses, trendy tops, stylish bottoms, traditional wear, and contemporary fashion. Buy quality women's fashion online in Europe with delivery to UK, Germany, France, Italy, Spain, Netherlands, and all European countries.";
  const defaultKeywords = "women's clothing Europe, Meerab's Wardrobe, Meerabs, buy clothes online Europe, ladies fashion Europe, women's dresses online, designer clothes Europe, ethnic wear Europe, casual wear women, formal wear Europe, trendy clothing Europe, women's fashion store, online shopping Europe, ladies clothes online, fashion boutique Europe, designer wear Europe, branded clothes Europe, women's apparel online, UK fashion, European fashion";
  
  sitename = process.env.NEXT_PUBLIC_COMPANY_NAME || "Meerab's Wardrobe";
  
  // Helper function to clean duplicate site names from title
  const cleanDuplicateSiteNames = (text) => {
    if (!text) return text;
    let cleaned = text;
    
    // Remove common duplicate patterns (order matters - most specific first)
    const duplicatePatterns = [
      /\s*Meerab'?s?\s*Wardrobe\s*[-|]\s*Meerab'?s?\s*Wardrobe\s*[-|]\s*Meerab'?s?\s*Wardrobe/gi,
      /\s*MeerabWardrobe\s*[-|]\s*Meerab'?s?\s*Wardrobe\s*[-|]\s*Meerab'?s?\s*Wardrobe/gi,
      /\s*Meerab'?s?\s*Wardrobe\s*[-|]\s*MeerabWardrobe\s*[-|]\s*MeerabWardrobe/gi,
    ];
    
    duplicatePatterns.forEach(pattern => {
      cleaned = cleaned.replace(pattern, ' | Meerab\'s Wardrobe');
    });
    
    // Count occurrences of each site name variation
    const variations = ['Meerab\'s Wardrobe', 'MeerabWardrobe', sitename];
    const counts = variations.map(v => (cleaned.match(new RegExp(v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length);
    const maxCount = Math.max(...counts);
    
    // If any variation appears more than once, keep only the first occurrence
    if (maxCount > 1) {
      variations.forEach((name, index) => {
        if (counts[index] > 1) {
          const regex = new RegExp(`(${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
          let first = true;
          cleaned = cleaned.replace(regex, (match) => {
            if (first) {
              first = false;
              return match;
            }
            return ''; // Remove subsequent occurrences
          });
        }
      });
    }
    
    
    
    // Clean up multiple separators and extra spaces
    cleaned = cleaned.replace(/\s*[-|]\s*[-|]\s*/g, ' | ');
    cleaned = cleaned.replace(/\s*[-|]\s*[-|]\s*/g, ' | '); // Run twice to catch nested patterns
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    // Ensure we end with a single site name if title contains site name
    const hasSiteName = variations.some(v => cleaned.toLowerCase().includes(v.toLowerCase()));
    if (hasSiteName) {
      // Remove trailing site name variations and add one clean one
      variations.forEach(name => {
        const trailingRegex = new RegExp(`\\s*[-|]\\s*${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'gi');
        cleaned = cleaned.replace(trailingRegex, '');
      });
      // Add single site name at the end if not present
      if (!variations.some(v => cleaned.toLowerCase().endsWith(v.toLowerCase()))) {
        cleaned = `${cleaned} | Meerab's Wardrobe`;
      }
    }
    
    return cleaned.trim();
  };
  
  // Helper function to truncate title to 75 characters (SEO best practice)
  const truncateTitle = (text, maxLength = 75) => {
    if (!text || text.length <= maxLength) return text;
    // Truncate at word boundary if possible
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace) + '...';
    }
    return truncated.substring(0, maxLength - 3) + '...';
  };
  
  // Check if metaTitle already contains sitename to avoid duplication
  const siteNameVariations = [sitename, 'Meerab\'s Wardrobe', 'MeerabWardrobe', 'Meerab Wardrobe'];
  const alreadyContainsSiteName = metaTitle && siteNameVariations.some(
    name => metaTitle.toLowerCase().includes(name.toLowerCase())
  );
  
  // Build title: metaTitle + sitename (only if not already present, max 75 chars for SEO)
  let titleBase;
  if (!metaTitle) {
    titleBase = sitename;
  } else if (alreadyContainsSiteName) {
    // If metaTitle already has site name, clean duplicates and use (but truncate)
    titleBase = cleanDuplicateSiteNames(metaTitle);
    // If after cleaning it doesn't have a site name, add it
    if (!siteNameVariations.some(name => titleBase.toLowerCase().includes(name.toLowerCase()))) {
      titleBase = `${titleBase} | Meerab's Wardrobe`;
    }
  } else {
    // Add sitename with separator
    titleBase = `${metaTitle} | Meerab's Wardrobe`;
  }
  
  const fullTitle = truncateTitle(titleBase, 75);
  
  const metaDesc = description || defaultDescription;
  const metaKeywords = keywords || defaultKeywords;
  const canonicalUrl = canonical || `${baseUrl}${router.asPath}`;
  const ogImage = image || `${baseUrl}/images/og-image.jpg`;

  // Determine Open Graph type based on page type
  const ogType = type === "product" ? "product" : type === "article" ? "article" : "website";

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDesc} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={author || "Meerab's Wardrobe"} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow" />
      <meta name="slurp" content="index, follow" />
      <meta name="duckduckbot" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="Europe" />
      <meta name="rating" content="general" />
      <meta name="coverage" content="Europe" />
      <meta name="target" content="Europe" />
      <meta name="audience" content="Europe" />
      <meta name="country" content="Europe" />
      <meta name="geo.country" content="EU" />
      <meta name="geo.region" content="EU" />
      <meta name="geo.placename" content="Europe" />
      <meta name="geo.position" content="50.5;10.5" />
      <meta name="ICBM" content="50.5, 10.5" />
      
      {/* Article-specific meta tags */}
      {type === "article" && publishedTime && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags && Array.isArray(tags) && tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Product-specific meta tags */}
      {type === "product" && (
        <>
          {price && <meta property="product:price:amount" content={price} />}
          {priceCurrency && <meta property="product:price:currency" content={priceCurrency} />}
          {availability && <meta property="product:availability" content={availability} />}
          {brand && <meta property="product:brand" content={brand} />}
          {category && <meta property="product:category" content={category} />}
        </>
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Alternate language versions (hreflang) - European audience */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en-GB" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en-DE" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en-FR" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en-IT" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en-ES" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title || fullTitle} />
      <meta property="og:site_name" content={sitename} />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:locale:alternate" content="en_DE" />
      <meta property="og:locale:alternate" content="en_FR" />
      <meta property="og:locale:alternate" content="en_IT" />
      <meta property="og:locale:alternate" content="en_ES" />
      <meta property="og:country-name" content="Europe" />
      <meta property="business:contact_data:locality" content="Europe" />
      <meta property="business:contact_data:region" content="Europe" />
      <meta property="business:contact_data:country_name" content="Europe" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title || fullTitle} />
      <meta name="twitter:site" content="@meerabswardrobe" />
      <meta name="twitter:creator" content="@meerabswardrobe" />
      
      {/* European-specific meta tags */}
      <meta name="currency" content="EUR" />
      <meta name="priceCurrency" content="EUR" />
      <meta name="availableLanguage" content="en" />
      <meta name="availableLanguage:en" content="English" />
      
      {/* Additional Meta Tags for Better Indexing */}
      <meta name="application-name" content="Meerab's Wardrobe" />
      <meta name="apple-mobile-web-app-title" content="Meerab's Wardrobe" />
      <meta name="msapplication-TileColor" content="#d946a0" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Mobile optimization */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Preconnect to improve page speed - Critical origins only */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch for external resources - Non-critical, load after page interactive */}
      {/* These are deferred to reduce initial connection overhead */}
    </Head>
  );
};

export default SEO;
