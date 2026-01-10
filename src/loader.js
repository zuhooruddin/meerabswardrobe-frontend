import React, { useState,useEffect } from 'react';
import useSWR from 'swr'
import axios from 'axios';
import Image from 'next/image';

// Create axios instance with timeout to prevent hanging
const axiosWithTimeout = axios.create({
  timeout: 2000, // 2 second timeout
});

export default function Loader() {
  const [showLoader, setShowLoader] = useState(true);
  const [hasShown, setHasShown] = useState(false);

  const imgbaseurl=process.env.NEXT_PUBLIC_IMAGE_BASE_API_URL
  const fetcher = async (url) => {
    try {
      const res = await axiosWithTimeout.get(url);
      return res.data;
    } catch (error) {
      // If API fails, return null to use fallback
      return null;
    }
  };
  const server_ip = process.env.NEXT_PUBLIC_BACKEND_API_BASE;
  // Share the same SWR cache from _app.jsx to avoid duplicate API calls
  const { data, error } = useSWR(server_ip + 'getGeneralSetting', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
    // Don't block on error - use fallback
    shouldRetryOnError: false,
  });

  useEffect(() => {
    // Maximum 500ms wait time - much faster initial load
    // Don't wait for API response - show loader briefly then hide
    const maxWaitTime = 500;
    const timer = setTimeout(() => {
      setShowLoader(false);
      setHasShown(true);
    }, maxWaitTime);
    
    return () => clearTimeout(timer);
  }, []);
  
  // If API data arrives quickly, use it; otherwise use fallback
  useEffect(() => {
    if (data && !hasShown) {
      const splashTime = data.length > 0 
        ? Math.min(Math.max(data[0].splashtime || 300, 200), 500) 
        : 300;
      const timer = setTimeout(() => {
        setShowLoader(false);
        setHasShown(true);
      }, splashTime);
      
      return () => clearTimeout(timer);
    }
  }, [data, hasShown]);
  
  // Hide loader immediately on user interaction for better UX
  useEffect(() => {
    const handleInteraction = () => {
      setShowLoader(false);
      setHasShown(true);
    };
    
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    window.addEventListener('scroll', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });
    
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  const closeLoader = () => {
    setShowLoader(false);
  };

  const loaderStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  };

  const contentStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    textAlign: 'center',
    position: 'relative',
  };

  const imageStyle = {
    maxWidth: '100%',
    width:'100%',
    maxHeight: '500px',
    height:'auto',
    margin: '20px 0',
    resizeMode: 'contain',
  };

  const closeStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    cursor: 'pointer',
    fontSize: '20px',
    color: '#000',
  };

  // Use fallback image if data not loaded yet
  const splashImage = data && data.length > 0 && data[0].site_splash
    ? imgbaseurl + data[0].site_splash
    : '/assets/images/banners/banner-1.png';

  return (
    showLoader && (
      <div style={loaderStyle}>
        <div style={contentStyle}>
          <Image
            src={splashImage}
            alt="Loading"
            width={500}
            height={500}
            style={imageStyle}
            priority
            onError={(e) => {
              // Fallback if image fails to load
              e.target.src = '/assets/images/banners/banner-1.png';
            }}
          />
          <span
            style={closeStyle}
            onClick={closeLoader}
            role="button"
            tabIndex={0}
            aria-label="Close loader"
          >
            &#x2716;
          </span>
        </div>
      </div>
    )
  );
}
