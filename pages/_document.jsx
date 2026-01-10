/* eslint-disable react/display-name */
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";
import createEmotionCache from "../src/createEmotionCache";
import OpenGraphTags from "utils/OpenGraphTags";
import GoogleAnalytics from "utils/GoogleAnalytics";

export default class Bazaar extends Document {
  render() {
    return (
      <Html lang="en" prefix="og: https://ogp.me/ns#">
        <Head>
          {/* SEO Meta Tags */}
          <meta name="theme-color" content="#D23F57" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="format-detection" content="telephone=yes" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          
          {/* Preconnect to critical origins for faster loading */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://api.chitralhive.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://api.chitralhive.com" />
          {process.env.NEXT_PUBLIC_BACKEND_API_BASE && (
            <link rel="preconnect" href={process.env.NEXT_PUBLIC_BACKEND_API_BASE.replace('/api/', '')} crossOrigin="anonymous" />
          )}
          {process.env.NEXT_PUBLIC_IMAGE_BASE_API_URL && (
            <link rel="preconnect" href={process.env.NEXT_PUBLIC_IMAGE_BASE_API_URL.replace('/api/', '')} crossOrigin="anonymous" />
          )}
          
          {/* Premium Fonts - Load asynchronously to prevent render blocking */}
          {/* Using font-display=swap ensures text remains visible during font load */}
          <link
            href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Outfit:wght@100..900&display=swap"
            rel="stylesheet"
            media="print"
          />
          <noscript>
            <link
              href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Outfit:wght@100..900&display=swap"
              rel="stylesheet"
            />
          </noscript>
          {/* Script to switch font media from print to all after load (prevents render blocking) */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  var fontLink = document.querySelector('link[href*="fonts.googleapis.com/css2"][media="print"]');
                  if (fontLink) {
                    fontLink.onload = function() {
                      this.media = 'all';
                    };
                    // Fallback: switch after a short delay if onload doesn't fire
                    setTimeout(function() {
                      if (fontLink.media === 'print') {
                        fontLink.media = 'all';
                      }
                    }, 100);
                  }
                })();
              `,
            }}
          />
          
          {/* Material Icons - Load asynchronously */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap"
            media="print"
          />
          <noscript>
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap"
            />
          </noscript>
          {/* Script to switch Material Icons media from print to all after load */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  var iconLink = document.querySelector('link[href*="Material+Icons"][media="print"]');
                  if (iconLink) {
                    iconLink.onload = function() {
                      this.media = 'all';
                    };
                    setTimeout(function() {
                      if (iconLink.media === 'print') {
                        iconLink.media = 'all';
                      }
                    }, 100);
                  }
                })();
              `,
            }}
          />
          
          <OpenGraphTags />
          {/* GoogleAnalytics is now loaded client-side only to improve performance */}
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
Bazaar.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) =>
        (
          <CacheProvider value={cache}>
            <App {...props} />
          </CacheProvider>
        ),
    });

  const initialProps = await Document.getInitialProps(ctx);

  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      dangerouslySetInnerHTML={{
        __html: style.css,
      }}
    />
  ));
  
  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      ...emotionStyleTags,
    ],
  };
};
