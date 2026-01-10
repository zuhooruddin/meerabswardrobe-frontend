import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ShopLayout1 from "components/layouts/ShopLayout1";
import SEO from "components/SEO";
import StructuredData from "components/schema/StructuredData";
import dynamic from "next/dynamic";
import { useSession, signIn, signOut } from "next-auth/react";
import React, { useState, useEffect, useMemo } from "react";
import apiNav from "utils/api/market-2";
import api from "utils/api/fashion-shop-2";
import LazySection from "components/LazySection";

// Lazy load heavy components for better code splitting
// Only Section1 needs SSR (above the fold), others can load client-side
// Grouped imports to reduce chunk fragmentation
const Section1 = dynamic(() => import("pages-sections/market-2/Section1"), { 
  ssr: true,
  loading: () => null, // No loading indicator for above-the-fold content
});

// Group frequently used sections together to reduce chunks
const Section2 = dynamic(() => import("pages-sections/market-2/Section2"), { 
  ssr: false,
  loading: () => null,
});
const Section3 = dynamic(() => import("pages-sections/market-2/Section3"), { 
  ssr: false,
  loading: () => null,
});
const Section4 = dynamic(() => import("pages-sections/market-2/Section4"), { 
  ssr: false,
  loading: () => null,
});
const Section5 = dynamic(() => import("pages-sections/market-2/Section5"), { 
  ssr: false,
  loading: () => null,
});
const Section6 = dynamic(() => import("pages-sections/market-2/Section6"), { 
  ssr: false,
  loading: () => null,
});
const Section7 = dynamic(() => import("pages-sections/market-2/Section7"), { 
  ssr: false,
  loading: () => null,
});
const Section9 = dynamic(() => import("pages-sections/market-2/Section9"), { 
  ssr: false,
  loading: () => null,
});
const Section10 = dynamic(() => import("pages-sections/market-2/Section10"), { 
  ssr: false,
  loading: () => null,
});
const Section12 = dynamic(() => import("pages-sections/market-2/Section12"), { 
  ssr: false,
  loading: () => null,
});

// Generate structured data for homepage
const getHomePageStructuredData = (generalSetting) => {
  const baseUrl = "https://chitralhive.com";
  const siteName = generalSetting && generalSetting.length > 0 ? generalSetting[0].site_name : "Chitral Hive";
  const siteDescription = generalSetting && generalSetting.length > 0 ? generalSetting[0].site_description : "Shop authentic Chitrali products online at Chitral Hive";
  
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": siteName,
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/images/logo.png`,
          "width": 300,
          "height": 60
        },
        "description": siteDescription,
        "sameAs": [
          "https://www.facebook.com/chitralhive",
          "https://www.instagram.com/chitralhive",
          "https://twitter.com/chitralhive"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+92-323-9119309",
          "contactType": "Customer Service",
          "areaServed": {
            "@type": "Country",
            "name": "Pakistan"
          },
          "availableLanguage": ["en", "ur", "en-PK", "ur-PK"]
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Chitral",
          "addressRegion": "Khyber Pakhtunkhwa",
          "postalCode": "17200",
          "addressCountry": "PK"
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": `${baseUrl}/#localbusiness`,
        "name": siteName,
        "image": `${baseUrl}/images/og-image.jpg`,
        "description": siteDescription,
        "url": baseUrl,
        "telephone": "+92-323-9119309",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Chitral",
          "addressRegion": "Khyber Pakhtunkhwa",
          "addressCountry": "PK"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "35.8514",
          "longitude": "71.7864"
        },
        "priceRange": "$$",
        "currenciesAccepted": "PKR",
        "paymentAccepted": "Cash, Credit Card, Debit Card, Bank Transfer",
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "09:00",
          "closes": "18:00"
        }
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl,
        "name": siteName,
        "description": siteDescription,
        "publisher": {
          "@id": `${baseUrl}/#organization`
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${baseUrl}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        },
        "mainEntity": [
          {
            "@type": "WebPage",
            "@id": `${baseUrl}/category/chitrali-honey#webpage`,
            "url": `${baseUrl}/category/chitrali-honey`,
            "name": "Chitrali Products - Shop All Products",
            "description": "Browse our complete collection of authentic Chitrali products including dry fruits, honey, herbs, spices, and traditional items from Chitral, Pakistan."
          },
          {
            "@type": "WebPage",
            "@id": `${baseUrl}/category/chitrali-dry-fruits#webpage`,
            "url": `${baseUrl}/category/chitrali-dry-fruits`,
            "name": "Product Categories - Chitrali Products",
            "description": "Explore all categories of Chitrali products including dry fruits, honey, herbs, spices, nuts, and more authentic items from Chitral."
          },
          {
            "@type": "WebPage",
            "@id": `${baseUrl}/brands#webpage`,
            "url": `${baseUrl}/brands`,
            "name": "Brands - Chitral Hive",
            "description": "Discover trusted brands and authentic Chitrali product manufacturers available at Chitral Hive."
          },
          {
            "@type": "WebPage",
            "@id": `${baseUrl}/about-us#webpage`,
            "url": `${baseUrl}/about-us`,
            "name": "About Us - Chitral Hive",
            "description": "Learn about Chitral Hive, your trusted source for authentic Chitrali products delivered across Pakistan."
          },
          {
            "@type": "WebPage",
            "@id": `${baseUrl}/contact-us#webpage`,
            "url": `${baseUrl}/contact-us`,
            "name": "Contact Us - Chitral Hive",
            "description": "Get in touch with Chitral Hive for inquiries, orders, and customer support. We're here to help you find the best Chitrali products."
          }
        ]
      },
      {
        "@type": "SiteNavigationElement",
        "@id": `${baseUrl}/#navigation`,
        "name": "Main Navigation",
        "url": baseUrl,
        "hasPart": [
          {
            "@type": "SiteNavigationElement",
            "name": "Products",
            "url": `${baseUrl}/products`,
            "description": "Shop all Chitrali products"
          },
          {
            "@type": "SiteNavigationElement",
            "name": "Categories",
            "url": `${baseUrl}/categories`,
            "description": "Browse product categories"
          },
          {
            "@type": "SiteNavigationElement",
            "name": "Brands",
            "url": `${baseUrl}/brands`,
            "description": "View all brands"
          },
          {
            "@type": "SiteNavigationElement",
            "name": "Chitrali Products",
            "url": `${baseUrl}/category/chitrali-products`,
            "description": "Authentic Chitrali products from Chitral, Pakistan"
          },
          {
            "@type": "SiteNavigationElement",
            "name": "Dry Fruits",
            "url": `${baseUrl}/category/dry-fruits`,
            "description": "Premium Chitrali dry fruits and nuts"
          },
          {
            "@type": "SiteNavigationElement",
            "name": "About Us",
            "url": `${baseUrl}/about-us`,
            "description": "Learn about Chitral Hive"
          },
          {
            "@type": "SiteNavigationElement",
            "name": "Contact Us",
            "url": `${baseUrl}/contact-us`,
            "description": "Contact Chitral Hive"
          }
        ]
      },
      {
        "@type": "ItemList",
        "@id": `${baseUrl}/#itemlist`,
        "name": "Featured Chitrali Products",
        "description": "Browse our collection of authentic Chitrali products",
        "url": `${baseUrl}/products`
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}/#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What are Chitrali products?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Chitrali products are authentic, traditional items from Chitral, Khyber Pakhtunkhwa, Pakistan. These include handmade crafts, local specialties, traditional foods, and unique cultural products that represent the rich heritage of Chitral. Available for purchase online across Pakistan."
            }
          },
          {
            "@type": "Question",
            "name": "Do you ship Chitrali products nationwide in Pakistan?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Chitral Hive delivers authentic Chitrali products to your doorstep across all major cities in Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Multan, Faisalabad, Quetta, and more. We ensure safe packaging and timely delivery of all orders."
            }
          },
          {
            "@type": "Question",
            "name": "Are the products authentic?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, all products at Chitral Hive are 100% authentic and sourced directly from Chitral. We work with local artisans and suppliers to bring you genuine Chitrali products."
            }
          }
        ]
      }
    ]
  };
};

const IndexPage = (props) => {
  

  // const { data: session } = useSession();
  const { data: session, status } = useSession();
  
  const { navCategories } = props;
  const [Wishlistdata, setWishlistdata] = useState(undefined);

  // Fix: Move conditional state update to useEffect to avoid React hook rules violation
  useEffect(() => {
    if (
      session !== undefined &&
      Wishlistdata === undefined &&
      status === "authenticated"
    ) {
      const data = ["4783"];
      setWishlistdata(data);
    }
  }, [session, status, Wishlistdata]);

  const theme = useTheme();
  
  // Memoize expensive computations
  const GeneralSettingMemo = useMemo(() => props.GeneralSetting, [props.GeneralSetting]);

  return (
    <ShopLayout1
      topbarBgColor={theme.palette.grey[900]}
      navCategories={navCategories}
      generalSetting={GeneralSettingMemo}
      footerData={null} // Can be passed from props if available
    >
      <SEO
        title={GeneralSettingMemo&&GeneralSettingMemo.length>0?GeneralSettingMemo[0].site_name:'Discover Authentic Chitrali Products - Chitral Hive'}
        description={GeneralSettingMemo&&GeneralSettingMemo.length>0?GeneralSettingMemo[0].site_description:'Shop authentic Chitrali products online in Pakistan. Premium dry fruits, pure honey, traditional herbs, and handmade crafts from Chitral. Free delivery across Pakistan. Buy Chitrali almonds, apricots, walnuts, and more at best prices.'}
        metaTitle={GeneralSettingMemo&&GeneralSettingMemo.length>0?GeneralSettingMemo[0].site_metatitle:'Chitral Hive - Authentic Chitrali Dry Fruits, Honey & Traditional Products Online Pakistan'}
        keywords="buy Chitrali dry fruits online, Chitrali almonds Pakistan, Chitrali apricots online, Chitrali honey price, Chitrali walnuts, buy dry fruits online Pakistan, Chitrali products online, authentic Chitrali honey, Chitrali dry fruits delivery, Chitrali nuts online, Chitrali recipes, Chitrali culture, Chitrali traditional food, Chitrali herbs, Chitrali spices, Chitrali handicrafts, KPK dry fruits, online dry fruits Pakistan, premium dry fruits Pakistan, organic Chitrali products"
        canonical="https://chitralhive.com"
      />
      <StructuredData data={getHomePageStructuredData(GeneralSettingMemo)} />
      <Box bgcolor="#F6F6F6">
        {/* Main H1 heading for SEO - visually hidden but accessible */}
        <Box
          component="h1"
          sx={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          {GeneralSettingMemo&&GeneralSettingMemo.length>0 
            ? `${GeneralSettingMemo[0].site_name} - Discover Authentic Chitrali Products Online`
            : 'Chitral Hive - Discover Authentic Chitrali Products Online in Pakistan'}
        </Box>
        <Section1
          data1={props.Section1SequenceData}
          data2={props.Section1SequenceData2 || []}
          slidersList={props.slidersList}
          slidersListLocal={props.slidersListLocal}
        />

        <LazySection>
          <Section9 data={props.ProductReviews} />
        </LazySection>
        {(props.Section2SequenceData || props.Section2SequenceData2 || props.Section2SequenceData3 || 
          props.Section2SequenceData4 || props.Section2SequenceData5 || props.Section2SequenceData6) && (
          <LazySection>
            <Box sx={{ my: -7 }}>
              <Section3
                data1={props.Section2SequenceData || []}
                data2={props.Section2SequenceData2 || []}
                data3={props.Section2SequenceData3 || []}
                data4={props.Section2SequenceData4 || []}
                data5={props.Section2SequenceData5 || []}
                data6={props.Section2SequenceData6 || []}
              />
            </Box>
          </LazySection>
        )}
        {props.brandbundles && props.brandbundles.length > 0 && (
          <LazySection>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
              <Section2 data={props.brandbundles} />
            </Box>
          </LazySection>
        )}
        <LazySection>
          <Box sx={{ my: 0 }}>
            <Section4
              data1={props.Section3SequenceData || []}
              data2={props.Section3SequenceData2 || []}
              data3={props.Section3SequenceData3 || []}
              userWishlist={Wishlistdata || []}
            />
          </Box>
        </LazySection>
        {props.products && props.products.length > 0 && props.SectionSequenceOrdera && props.SectionSequenceOrdera.length > 0 && (
          <LazySection>
            <Box sx={{ mt: 5 }}>
              <Section5
                products={props.products}
                data={props.SectionSequenceOrdera}
                SectionName={props.Section1Name || ""}
                slug={props.slug || ""}
                productreviews={props.ProductReviews} 

              />
            </Box>
          </LazySection>
        )}
        {props.Section4SequenceData && props.Section4SequenceData2 && (
          <LazySection>
            <Box sx={{ my: -7 }}>
              <Section6
                data1={props.Section4SequenceData}
                data2={props.Section4SequenceData2}
              />
            </Box>
          </LazySection>
        )}
        {props.product && props.product.length > 0 && props.SectionSequenceOrdera2 && props.SectionSequenceOrdera2.length > 0 && (
          <LazySection>
            <Section12
              products={props.product}
              data={props.SectionSequenceOrdera2}
              Section2Name={props.Section2Name || ""}
              slug={props.slug2 || ""}
              productreviews={props.ProductReviews} 

            />
          </LazySection>
        )}
        {props.productbundles && props.productbundles.length > 0 && (
          <LazySection>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
              <Section10 data={props.productbundles} />
            </Box>
          </LazySection>
        )}

        {props.Section5SequenceData && (
          <LazySection>
            <Box sx={{ my: -4 }}>
              <Section7 data1={props.Section5SequenceData} />
            </Box>
          </LazySection>
        )}
        {/* <Section13 products={props.sect13products || []} /> */}
        {/* <Section8 /> */}
      </Box>

      {/* <Setting /> */}
    </ShopLayout1>
  );
};

// Memoize component to prevent unnecessary re-renders
const MemoizedIndexPage = React.memo(IndexPage);
MemoizedIndexPage.displayName = 'IndexPage';

// Use getStaticProps with ISR for better performance - pages are cached and regenerated periodically
export async function getStaticProps(context) {
  try {
    // Parallelize all independent API calls for better performance
    const [
      navCategories,
      sect4products,
      inara,
      brandbundles,
      productbundles,
      individulorder,
      sectionsequenceorder,
      slidersList,
      slidersListLocal,
      ProductReviews,
      GeneralSetting
    ] = await Promise.all([
      apiNav.getNavCategories(),
      api.getProducts(),
      api.getProducts(),
      api.getBrandBundles(),
      api.getProductBundles(),
      api.getindvidualorderbox(),
      api.getSectionSequence(),
      api.getSlidersFromCloud(),
      api.getSlidersFromLocal(),
      apiNav.getReviews(),
      api.getGeneralSetting()
    ]);

  ////////////////////////Section 1/////////////////////////
  const Section1SequenceData = individulorder.find(
    (obj) => obj.sequenceNo == 1 && obj.type == "box"
  );


  const Section1SequenceData2 = individulorder.find(
    (obj) => obj.sequenceNo == 2 && obj.type == "box"
  );

  ////////////////////////Section 2/////////////////////////
  const Section2SequenceData = individulorder.find(
    (obj) => obj.sequenceNo == 3 && obj.type == "box"
  );

  const Section2SequenceData2 = individulorder.find(
    (obj) => obj.sequenceNo == 4 && obj.type == "box"
  );
  const Section2SequenceData3 = individulorder.find(
    (obj) => obj.sequenceNo == 5 && obj.type == "box"
  );
  const Section2SequenceData4 = individulorder.find(
    (obj) => obj.sequenceNo == 6 && obj.type == "box"
  );
  const Section2SequenceData5 = individulorder.find(
    (obj) => obj.sequenceNo == 7 && obj.type == "box"
  );
  const Section2SequenceData6 = individulorder.find(
    (obj) => obj.sequenceNo == 8 && obj.type == "box"
  );

  ////////////////////////Section 3/////////////////////////
  const Section3SequenceData = individulorder.find(
    (obj) => obj.sequenceNo == 9 && obj.type == "box"
  );
  const Section3SequenceData2 = individulorder.find(
    (obj) => obj.sequenceNo == 10 && obj.type == "box"
  );
  const Section3SequenceData3 = individulorder.find(
    (obj) => obj.sequenceNo == 11 && obj.type == "box"
  );
  ////////////////////////Section 4/////////////////////////
  const Section4SequenceData = individulorder.find(
    (obj) => obj.sequenceNo == 12 && obj.type == "box"
  );
  const Section4SequenceData2 = individulorder.find(
    (obj) => obj.sequenceNo == 13 && obj.type == "box"
  );
  ////////////////////////Section 5/////////////////////////
  const Section5SequenceData = individulorder.find(
    (obj) => obj.sequenceNo == 14 && obj.type == "box"
  );

  ////////////////////////Section Sequence Order 1/////////////////////////
  const SectionSequenceOrder = individulorder.find(
    (obj) => obj.type == "section" && obj.sequenceNo == 1
  );
  // const Section1Name=SectionSequenceOrder.category_name;
  const Section1Name = SectionSequenceOrder?.category_name || "";

  const SectionSequenceOrdera = individulorder.filter(
    (obj) =>
      obj.type == "section_subcategory" &&
      obj.parent == SectionSequenceOrder.category_id_id
  );

  ////////////////////////Section Sequence Order 2/////////////////////////

  const SectionSequence = individulorder.find(
    (ob) => ob.type == "section" && ob.sequenceNo == 2
  );
  // const Section2Name=SectionSequence.category_name || "";

  const Section2Name = SectionSequence?.category_name || "";

  const Section2id = SectionSequence?.category_id_id || "";

  const SectionSequenceOrdera2 = individulorder.filter(
    (os) => os.type == "section_subcategory" && os.parent == Section2id
  );

  // const SectionSequenceOrder=sectionsequenceorder.find(obj => obj.sequenceNo==1);

  const slug = SectionSequenceOrder?.category_slug || "";
  const slug2 = SectionSequence?.category_slug || "";

  // Parallelize product fetches if both slugs exist
  const [products, product] = await Promise.all([
    slug ? api.getProducts(slug) : Promise.resolve(null),
    slug2 ? api.getSectionProduct(slug2) : Promise.resolve(null)
  ]);

  ////////////////////////Section Sequence Order 2/////////////////////////

  // const products=sect4products;
  return {
    props: {
      // Add cache headers for API responses
      _cacheTime: Date.now(),
      navCategories,
      products,
      product,
      inara,
      sect4products,
      // latestproduct,
      SectionSequenceOrdera,
      Section1Name,
      Section2Name,
      SectionSequenceOrdera2,
      slug,
      slug2,
      // featureProducts,
      Section1SequenceData: Section1SequenceData || null,
      Section1SequenceData2: Section1SequenceData2 || null,
      Section2SequenceData: Section2SequenceData || null,
      Section2SequenceData2: Section2SequenceData2 || null,
      Section2SequenceData3: Section2SequenceData3 || null,
      Section2SequenceData4: Section2SequenceData4 || null,
      Section2SequenceData5: Section2SequenceData5 || null,
      Section2SequenceData6: Section2SequenceData6 || null,
      Section3SequenceData: Section3SequenceData || null,
      Section3SequenceData2: Section3SequenceData2 || null,
      Section3SequenceData3: Section3SequenceData3 || null,
      Section4SequenceData: Section4SequenceData || null,
      Section4SequenceData2: Section4SequenceData2 || null,
      Section5SequenceData: Section5SequenceData || null,
      // Don't pass entire individulorder array - it's large and not needed
      // individulorder,
      SectionSequenceOrder: SectionSequenceOrder || null,
      // bundles,
      brandbundles,
      productbundles,
      slidersList,
      slidersListLocal,
      ProductReviews,
      GeneralSetting
    },
    // Revalidate every 60 seconds - ISR (Incremental Static Regeneration)
    // This means pages are cached and only regenerated every 60 seconds
    revalidate: 60,
  };
  } catch (error) {
    console.error('Error fetching data:', error);
    // Return empty props on error to prevent build failure
    return {
      props: {
        navCategories: [],
        products: null,
        product: null,
        GeneralSetting: [],
      },
      revalidate: 60,
    };
  }
}

export default MemoizedIndexPage;
