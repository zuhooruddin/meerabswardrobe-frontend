

import React from "react";

const OpenGraphTags = () => {
  const baseUrl = "https://chitralhive.com";
  return (

    

    

    <>
      {/* Primary Open Graph Tags */}
      <meta property="og:url" content={baseUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Chitral Hive | Authentic Chitrali Products Online Store" />
      <meta
        property="og:description"
        content="Shop authentic Chitrali products online in Pakistan at Chitral Hive. Discover traditional crafts, local specialties, handmade items, and unique products from Chitral, Khyber Pakhtunkhwa. Buy Chitrali products online in Pakistan and get them delivered to your doorstep across all major cities."
      />
      <meta
        property="og:image"
        content={`${baseUrl}/images/og-image.jpg`}
      />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Chitral Hive - Authentic Chitrali Products" />
      <meta property="og:site_name" content="Chitral Hive" />
      <meta property="og:locale" content="en_PK" />
      <meta property="og:locale:alternate" content="ur_PK" />
      <meta property="og:country-name" content="Pakistan" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Chitral Hive | Authentic Chitrali Products Online Store" />
      <meta
        name="twitter:description"
        content="Shop authentic Chitrali products online in Pakistan. Traditional crafts, local specialties, and handmade items from Chitral, Khyber Pakhtunkhwa delivered to your doorstep across Pakistan."
      />
      <meta
        name="twitter:image"
        content={`${baseUrl}/images/og-image.jpg`}
      />
      <meta name="twitter:image:alt" content="Chitral Hive - Authentic Chitrali Products" />
      <meta name="twitter:site" content="@chitralhive" />
      <meta name="twitter:creator" content="@chitralhive" />
    </>
  );
};

export default OpenGraphTags;

