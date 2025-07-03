import Head from 'next/head';
import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  robots?: string;
  canonical?: string;
  siteName?: string;
  twitterHandle?: string;
  jsonLd?: object;
}

const DEFAULTS = {
  title: 'bgtoscreen',
  description: 'Easily upload, crop, and set backgrounds for your screens. Fast, simple, and beautiful.',
  image: '/social.png',
  url: 'https://bgtoscreen.vercel.app',
  type: 'website',
  robots: 'index,follow',
  siteName: 'bgtoscreen',
  twitterHandle: '@yourhandle',
};

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  url,
  type,
  robots,
  canonical,
  siteName,
  twitterHandle,
  jsonLd,
}) => {
  const metaTitle = title || DEFAULTS.title;
  const metaDescription = description || DEFAULTS.description;
  const metaImage = image || DEFAULTS.image;
  const metaUrl = url || DEFAULTS.url;
  const metaType = type || DEFAULTS.type;
  const metaRobots = robots || DEFAULTS.robots;
  const metaSiteName = siteName || DEFAULTS.siteName;
  const metaTwitter = twitterHandle || DEFAULTS.twitterHandle;
  const metaCanonical = canonical || metaUrl;

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content="background, image editor, crop, upload, screen, wallpaper, gradients, textures, solid, download, high quality, bgtoscreen, online tool, free, easy, fast, customize, preview, controls, web app, vercel" />
      <meta name="robots" content={metaRobots} />
      <meta name="author" content="bgtoscreen" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Language" content="en" />
      <link rel="canonical" href={metaCanonical} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:type" content={metaType} />
      <meta property="og:site_name" content={metaSiteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:site" content={metaTwitter} />
      <meta name="twitter:creator" content={metaTwitter} />
      {/* Favicons and App Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      {/* Vercel Analytics (add your script src below) */}
      {/* <script src="https://vercel.com/analytics/script.js" defer /> */}
      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  );
};

export default SEO; 