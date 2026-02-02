import Footer from "components/footer/Footer";
import Header from "components/header/Header";
import MobileNavigationBar from "components/mobile-navigation/MobileNavigationBar";
import Sticky from "components/sticky/Sticky";
import Topbar from "components/topbar/Topbar";
import React, { Fragment, useCallback, useState } from "react";
import Navbar from "components/navbar/Navbar";
import useSWR from 'swr'
import axios from 'axios';


/**
 *  Used in:
 *  1. market-1, matket-2, gadget-shop,
 *     fashion-shop, fashion-shop-2, fashion-shop-3, furniture-shop, grocery3, gift-shop
 *  2. product details page
 *  3. order-confirmation page
 *  4. product-search page
 *  5. shops and shops-details page
 *  6. checkoutNavLayout and CustomerDashboadLayout component
 */
// ===================================================

// ===================================================
const ShopLayout1 = ({
  children,
  showTopbar = true,
  topbarBgColor,
  showNavbar = true,
  navCategories,
  footerData, // Pass from props to avoid duplicate API calls
  generalSetting, // Pass from props to avoid duplicate API calls
}) => {
  const [isFixed, setIsFixed] = useState(false);
  const toggleIsFixed = useCallback((fixed) => setIsFixed(fixed), []);
  
  // Only fetch if not provided via props (fallback for pages that don't pass it)
  // Create axios instance with timeout to prevent hanging
  const axiosWithTimeout = axios.create({
    timeout: 5000, // 5 second timeout
  });
  
  const fetcher = async (url) => {
    try {
      const res = await axiosWithTimeout.get(url);
      // Check if response is valid
      if (res.data && typeof res.data === 'object') {
        return res.data;
      }
      return url.includes('Footer') ? {} : [];
    } catch (error) {
      console.error('API Error in ShopLayout1:', url, error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      // Return empty data on error to prevent crashes
      return url.includes('Footer') ? {} : [];
    }
  };
  
  const server_ip = process.env.NEXT_PUBLIC_BACKEND_API_BASE;
  const { data: swrFooterData, error: footerError } = useSWR(
    !footerData ? server_ip + 'getFooterSettings' : null, 
    fetcher,
    { 
      revalidateOnFocus: false, 
      dedupingInterval: 60000,
      shouldRetryOnError: false,
      revalidateIfStale: false,
    }
  );
  const { data: swrGeneralSetting } = useSWR(
    !generalSetting ? server_ip + 'getGeneralSetting' : null, 
    fetcher,
    { 
      revalidateOnFocus: false, 
      dedupingInterval: 60000,
      shouldRetryOnError: false,
      revalidateIfStale: false,
    }
  );
  
  // Use props if available, otherwise use SWR data
  const data = footerData || swrFooterData;
  const data1 = generalSetting || swrGeneralSetting;




  return (
    <Fragment>
      {/* TOPBAR */}
      {showTopbar && <Topbar bgColor={topbarBgColor} topbardata={data1 && data1.length > 0 ? data1 : null} />}

      {/* HEADER */}
      <Sticky fixedOn={0} onSticky={toggleIsFixed} scrollDistance={300}>
      <Header isFixed={isFixed} headerdata={data1 && data1.length > 0 ? data1 : null} />
      </Sticky>

      <div className="section-after-sticky">
        {/* NAVIGATION BAR */}
        {showNavbar && <Navbar elevation={0} border={1} navCategories={navCategories} />}

        {/* BODY CONTENT */}
        <main id="main-content" role="main">
          {children}
        </main>
      </div>

      <MobileNavigationBar />

      <Footer footerData={data || null} />
    </Fragment>
  );
};

export default ShopLayout1;


