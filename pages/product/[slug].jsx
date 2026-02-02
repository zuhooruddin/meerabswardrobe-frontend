import { Box, Container, styled, Tab, Tabs } from "@mui/material";
import { Button } from "@mui/material";
import BazaarImage from "components/BazaarImage";
import { FlexBox, FlexRowCenter } from "components/flex-box";
import SEO from "components/SEO";
import ShopLayout1 from "components/layouts/ShopLayout1";
import ProductDescription from "components/products/ProductDescription";
import ProductInstruction from "components/products/ProductInstruction";
import ProductIntro from "components/products/ProductIntro";
import { H2 } from "components/Typography";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import StructuredData from "components/schema/StructuredData";
import ProductReview from "components/products/ProductReview";

import {
  getFrequentlyBought,
  getRelatedProducts,
} from "utils/api/related-products";
import api from "utils/api/market-2";

const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 0,
  marginTop: 80,
  marginBottom: 24,
  borderBottom: `1px solid ${theme.palette.text.disabled}`,
  "& .inner-tab": {
    minHeight: 40,
    fontWeight: 600,
    textTransform: "capitalize",
  },
}));

const ErrorContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  "& h1": {
    fontSize: "4rem",
    marginBottom: "1rem",
    color: theme.palette.text.secondary,
  },
  "& p": {
    fontSize: "1.2rem",
    marginBottom: "1.5rem",
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  "& a": {
    fontSize: "1.2rem",
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const ProductDetails = (props) => {



  const { productDetails,ProductReviews } = props;

  const imgbaseurl = process.env.NEXT_PUBLIC_IMAGE_BASE_API_URL;
  const baseurl = process.env.NEXT_PUBLIC_URL;
  const currentDate = new Date().toLocaleDateString();
  const [product, setProduct] = useState(productDetails[0]);
  const [selectedOption, setSelectedOption] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [frequentlyBought, setFrequentlyBought] = useState([]);
  const router = useRouter();

  const filteredReviews = ProductReviews.Reviews.filter((item) => item.itemid_id === product.id);

const totalRatings = filteredReviews.reduce((total, item) => total + item.rating, 0);

const averageRating = totalRatings / filteredReviews.length;

const roundedAverageRating = Math.min(Math.round(averageRating * 100) / 100, 5);
const companyname=process.env.NEXT_PUBLIC_COMPANY_NAME
  const handleGoBack = () => router.back();
  const searchWords =
    process.env.NEXT_PUBLIC_URL + "/search/" + productDetails[0]["slug"];
  const slugbaseurl = "/product/";

  useEffect(() => {
    getRelatedProducts().then((data) => setRelatedProducts(data));
    getFrequentlyBought().then((data) => setFrequentlyBought(data));
  }, []);

  const handleOptionClick = (_, value) => setSelectedOption(value);
  const handleGoRelevantPage = () => router.push(searchWords);

  // const bookschema = {
  //   "@context": "https://schema.org",
  //   "@type": "DataFeed",
  //   dataFeedElement: [
  //     {
  //       "@context": "https://schema.org",
  //       "@type": "Book",
  //       "@id": baseurl + slugbaseurl + productDetails[0]["slug"],

  //       url: baseurl + slugbaseurl + productDetails[0]["slug"],
  //       name: productDetails[0]["name"],
  //       "image": imgbaseurl + productDetails[0]["imgUrl"],

  //       author: {
  //         "@type": "Person",
  //         name: productDetails[0]["author"],
  //       },
  //       workExample: [
  //         {
  //           "@type": "Book",
  //           "@id": baseurl + slugbaseurl + productDetails[0]["slug"],

  //           url: baseurl + slugbaseurl + productDetails[0]["slug"],

  //           potentialAction: {
  //             "@type": "ReadAction",

  //             expectsAcceptanceOf: {
  //               "@type": "Offer",

  //               price: productDetails[0]["salePrice"],

  //               priceCurrency: "PKR",

  //               eligibleRegion: {
  //                 "@type": "Country",
  //                 name: "PK",
  //               },
  //             },
  //           },
  //         },
  //       ],
  //     },
  //   ],
  //   "dateModified":currentDate
  // };

  // if (productDetails[0]["isbn"]) {
  //   bookschema.isbn = productDetails[0]["isbn"];
  // }

  const productschema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": baseurl + slugbaseurl + productDetails[0]["slug"],
    "name": productDetails[0]["name"],
    "image": [imgbaseurl + productDetails[0]["imgUrl"]],
    "description": productDetails[0]["description"] || productDetails[0]["name"],
    "sku": productDetails[0]["sku"] || productDetails[0]["aliasCode"],
    "mpn": productDetails[0]["sku"] || productDetails[0]["aliasCode"],
    "gtin": productDetails[0]["sku"] || productDetails[0]["aliasCode"],
    "brand": {
      "@type": "Brand",
      "name": productDetails[0]["manufacturer"] || "Meerab's Wardrobe"
    },
    "category": productDetails[0]["category"] || "Women's Clothing",
    "offers": {
      "@type": "Offer",
      "url": baseurl + slugbaseurl + productDetails[0]["slug"],
      "price": productDetails[0]["salePrice"] || productDetails[0]["mrp"],
      "priceCurrency": "EUR",
      "availability": productDetails[0]["stock"] && parseFloat(productDetails[0]["stock"]) > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "Meerab's Wardrobe",
        "url": baseurl
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "EUR"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "EU"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "businessDays": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
          },
          "cutoffTime": "14:00",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 3,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 3,
            "maxValue": 7,
            "unitCode": "DAY"
          }
        }
      }
    },
    "aggregateRating": (roundedAverageRating > 0 || productDetails[0]["rating"]) ? {
      "@type": "AggregateRating",
      "ratingValue": roundedAverageRating || productDetails[0]["rating"] || 0,
      "reviewCount": filteredReviews.length || productDetails[0]["reviewCount"] || 0,
      "bestRating": "5",
      "worstRating": "1"
    } : undefined,
    "review": filteredReviews && filteredReviews.length > 0 ? filteredReviews.slice(0, 10).map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.user_name || "Customer"
      },
      "datePublished": review.created_at || new Date().toISOString(),
      "reviewBody": review.comment || "",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating || 5,
        "bestRating": "5",
        "worstRating": "1"
      }
    })) : undefined,
  };

  // const bookschema = {

  //   "@context": "https://schema.org",

  //   "@type": "Book",
  //   "@id": "Book",
  //   name: productDetails[0]["name"],
  //   thumbnailUrl: imgbaseurl + productDetails[0]["imgUrl"],
  //   url: imgbaseurl + slugbaseurl + productDetails[0]["slug"],
 

  //   image: imgbaseurl + productDetails[0]["imgUrl"],
  //   publisher: productDetails[0]["manufacturer"],
  //   // price: productDetails[0]['salePrice'],
  //   "expectsAcceptanceOf": {
  //     "@type": "Offer",

  //     "price": productDetails[0]['salePrice'],
  //     "priceCurrency": "PKR",

  //     "eligibleRegion": {
  //       "@type": "Country",
  //       "name": "PAKISTAN"
  //     }
  //   },

  // };

  if (productDetails[0]["description"]) {
    // bookschema.description = productDetails[0]["description"];
    productschema.description = productDetails[0]["description"];
  }
  if (productDetails[0]["isbn"]) {
    // bookschema.isbn = productDetails[0]["isbn"];
  }
  if (productDetails[0]["author"] !== "NOT AVAILABLE" && productDetails[0]["author"] !=undefined && productDetails[0]["author"]) {
    // bookschema.author = productDetails[0]["author"];
    productschema.author = productDetails[0]["author"];
  }
  if (
    productDetails[0]["manufacturer"] !== "NOT AVAILABLE" &&
    productDetails[0]["manufacturer"] != undefined &&
    productDetails[0]["manufacturer"]
  ) {
    //  bookschema.manufacturer= productDetails[0]["manufacturer"];
    productschema.manufacturer = productDetails[0]["manufacturer"];
  }

  if (productDetails[0]["sku"]) {
    productschema.sku = productDetails[0]["sku"];
  }

  // Add BreadcrumbList schema for better SEO
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseurl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": `${baseurl}/products`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": productDetails[0]["name"],
        "item": baseurl + slugbaseurl + productDetails[0]["slug"]
      }
    ]
  };

  // FAQ schema for product pages - common questions about products
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is ${productDetails[0]["name"]}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": productDetails[0]["description"] || `${productDetails[0]["name"]} is a premium women's clothing item available at Meerab's Wardrobe. Shop quality fashion online in Europe.`
        }
      },
      {
        "@type": "Question",
        "name": `How much does ${productDetails[0]["name"]} cost?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${productDetails[0]["name"]} is priced at €${productDetails[0]["salePrice"] || productDetails[0]["mrp"]}. You can purchase it online from Meerab's Wardrobe and get it delivered to your doorstep across all European countries including UK, Germany, France, Italy, Spain, Netherlands, and more.`
        }
      },
      {
        "@type": "Question",
        "name": `Is ${productDetails[0]["name"]} available in stock?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": productDetails[0]["stock"] && parseFloat(productDetails[0]["stock"]) > 0 
            ? `Yes, ${productDetails[0]["name"]} is currently in stock. You can order it now and we'll deliver it to your address.`
            : `Currently, ${productDetails[0]["name"]} is out of stock. Please check back later or contact us for availability updates.`
        }
      },
      {
        "@type": "Question",
        "name": `Do you ship ${productDetails[0]["name"]} nationwide?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, Meerab's Wardrobe delivers ${productDetails[0]["name"]} and all our premium women's clothing across all European countries including UK, Germany, France, Italy, Spain, Netherlands, Belgium, Austria, and more. We ensure safe packaging and timely delivery to your doorstep.`
        }
      },
      {
        "@type": "Question",
        "name": `Is ${productDetails[0]["name"]} authentic?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, all products at Meerab's Wardrobe, including ${productDetails[0]["name"]}, are 100% authentic and quality-checked. We work with trusted suppliers to bring you premium women's fashion.`
        }
      }
    ]
  };

  return (
    <ShopLayout1>
        <StructuredData data={productschema} />
        <StructuredData data={breadcrumbSchema} />
        <StructuredData data={faqSchema} />


      {/* {productDetails[0]["publisherFlag"] === true ? (
        <StructuredData data={bookschema} />
      ) : (
        <StructuredData data={productschema} />
      )} */}

      <SEO
        title={
          productDetails[0]["name"]
            ? productDetails[0]["name"]
            : companyname
        }
        description={
          productDetails[0]["metaDescription"] &&
          productDetails[0]["metaDescription"] != "undefined"
            ? productDetails[0]["metaDescription"]
            : productDetails[0]["name"]
            ? "Buy " +
              productDetails[0]["name"] +
              " online in Europe from Meerab's Wardrobe. Shop premium women's clothing online and get it delivered to your doorstep across Europe."
            : "Shop premium women's clothing online in Europe at Meerab's Wardrobe"
        }
        metaTitle={
          productDetails[0]["metaTitle"] &&
          productDetails[0]["metaTitle"] != "undefined"
            ? productDetails[0]["metaTitle"]
            : productDetails[0]["name"]
            ? "Buy " + productDetails[0]["name"] + " Online | Meerab's Wardrobe"
            : companyname
        }
        keywords={`${productDetails[0]["name"]} Europe, women's clothing Europe, Meerab's Wardrobe, buy ${productDetails[0]["name"]} online Europe, premium women's fashion, designer clothes Europe, ${productDetails[0]["name"]} price in Europe, buy ${productDetails[0]["name"]} UK, buy ${productDetails[0]["name"]} Germany, buy ${productDetails[0]["name"]} France`}
        canonical={`${baseurl}${slugbaseurl}${productDetails[0]["slug"]}`}
        image={imgbaseurl + productDetails[0]["imgUrl"]}
        type="product"
        price={productDetails[0]["salePrice"] || productDetails[0]["mrp"]}
        priceCurrency="EUR"
        availability={productDetails[0]["stock"] && parseFloat(productDetails[0]["stock"]) > 0 ? "InStock" : "OutOfStock"}
        brand={productDetails[0]["manufacturer"] || "Meerab's Wardrobe"}
        category={productDetails[0]["category"] || "Women's Clothing"}
        sku={productDetails[0]["sku"] || productDetails[0]["aliasCode"]}
        rating={roundedAverageRating || productDetails[0]["rating"]}
        reviewCount={filteredReviews.length}
      />

      <Container sx={{ my: 4 }}>
        {productDetails[0] ? (
          <ProductIntro
            product={productDetails[0]}
            slug={productDetails[0]["slug"]}
            total={filteredReviews.length}
            average={averageRating}
            category={productDetails[0]["category"] || productDetails[0]["categoryName"] || ""}
          />
        ) : (
          <H2>Loading...</H2>
        )}

<StyledTabs
          textColor="primary"
          value={selectedOption}
          indicatorColor="primary"
          onChange={handleOptionClick}
        >
          <Tab className="inner-tab" label="Description" />
          <Tab className="inner-tab" label="Product Instructions" />
          <Tab className="inner-tab" label={`Review (${filteredReviews&&filteredReviews.length>0?filteredReviews.length:0})`} />

          {/* <Tab className="inner-tab" label="Review (3)" /> */}
        </StyledTabs>

        <Box mb={6}>
          {selectedOption === 0 && <ProductDescription product={product} />}
          {selectedOption === 1 && <ProductInstruction product={product} />}
          
          {selectedOption === 2 && <ProductReview itemid={product.id} itemname={product.name}   
          reviews={ProductReviews && ProductReviews.Reviews.filter((item) => item.itemid_id === product.id)}

 />}

        </Box>
      </Container>
    </ShopLayout1>
  );
};
export async function getServerSideProps(context) {
  const slug = context.query["slug"];

  // Try to get product with variants first, fallback to regular detail
  let productDetails = null;
  try {
    const variantData = await api.getItemDetailWithVariants(slug);
    if (variantData && variantData.success && variantData.product) {
      // Transform variant API response to match existing format
      productDetails = [{
        ...variantData.product,
        imgUrl: variantData.product.image || variantData.product.imgUrl,
        imgGroup: variantData.gallery || [variantData.product.image],
        variants: variantData.product.variants || [],
        available_colors: variantData.product.available_colors || [],
        available_sizes: variantData.product.available_sizes || [],
        price_range: variantData.product.price_range || null,
      }];
    }
  } catch (error) {
    // Variant API not available, using regular detail
  }

  // Fallback to regular getItemDetail if variant API failed
  if (!productDetails || !productDetails.length) {
    productDetails = await api.getItemDetail(slug);
  }

  const ProductReviews = await api.getReviews();
  
  if (!productDetails || !productDetails.length) {
    return {
      redirect: {
        destination: "/search/" + slug,
        permanent: false,
      },
    };
  }
  return {
    props: { productDetails, ProductReviews },
  };
}

export default ProductDetails;
