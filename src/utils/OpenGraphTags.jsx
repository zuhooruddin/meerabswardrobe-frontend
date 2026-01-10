

import React from "react";

const OpenGraphTags = () => {
  const baseUrl = "https://meerabs.com";
  return (
    <>
      {/* Primary Open Graph Tags */}
      <meta property="og:url" content={baseUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Meerab's Wardrobe | Premium Women's Fashion Online Store" />
      <meta
        property="og:description"
        content="Shop premium women's clothing online in Europe at Meerab's Wardrobe. Discover elegant dresses, trendy tops, stylish bottoms, traditional wear, and contemporary fashion. Buy quality women's fashion online in Europe with delivery to UK, Germany, France, Italy, Spain, and all European countries."
      />
      <meta
        property="og:image"
        content={`${baseUrl}/images/og-image.jpg`}
      />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Meerab's Wardrobe - Premium Women's Fashion" />
      <meta property="og:site_name" content="Meerab's Wardrobe" />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:locale:alternate" content="en_DE" />
      <meta property="og:locale:alternate" content="en_FR" />
      <meta property="og:locale:alternate" content="en_IT" />
      <meta property="og:locale:alternate" content="en_ES" />
      <meta property="og:country-name" content="Europe" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Meerab's Wardrobe | Premium Women's Fashion Online Store" />
      <meta
        name="twitter:description"
        content="Shop premium women's clothing online in Europe. Elegant dresses, trendy tops, stylish bottoms, and contemporary fashion delivered to your doorstep across Europe."
      />
      <meta
        name="twitter:image"
        content={`${baseUrl}/images/og-image.jpg`}
      />
      <meta name="twitter:image:alt" content="Meerab's Wardrobe - Premium Women's Fashion" />
      <meta name="twitter:site" content="@meerabswardrobe" />
      <meta name="twitter:creator" content="@meerabswardrobe" />
    </>
  );
};

export default OpenGraphTags;

