import React, { useEffect } from 'react';

// SEO utility functions
export const updatePageTitle = (title) => {
  document.title = title;
};

export const updateMetaDescription = (description) => {
  let metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description);
  } else {
    metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = description;
    document.head.appendChild(metaDescription);
  }
};

export const updateCanonicalUrl = (url) => {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute('href', url);
  } else {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = url;
    document.head.appendChild(canonical);
  }
};

export const updateOpenGraphTags = (data) => {
  const ogTags = {
    'og:title': data.title,
    'og:description': data.description,
    'og:url': data.url,
    'og:image': data.image,
    'og:type': data.type || 'website'
  };

  Object.entries(ogTags).forEach(([property, content]) => {
    if (content) {
      let ogTag = document.querySelector(`meta[property="${property}"]`);
      if (ogTag) {
        ogTag.setAttribute('content', content);
      } else {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', property);
        ogTag.setAttribute('content', content);
        document.head.appendChild(ogTag);
      }
    }
  });
};

export const addStructuredData = (data) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

// Product structured data generator
export const generateProductSchema = (product) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.short_description,
    "image": product.image_url,
    "brand": {
      "@type": "Brand",
      "name": "DentalTech Pro"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "EUR",
      "availability": product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "DentalTech Pro"
      }
    },
    "aggregateRating": product.rating && product.reviews_count ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviews_count,
      "bestRating": 5,
      "worstRating": 1
    } : undefined,
    "category": product.category,
    "sku": `DTP-${product.id.toString().padStart(4, '0')}`
  };
};

// Breadcrumb structured data generator
export const generateBreadcrumbSchema = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};

// SEO Hook for React components
export const useSEO = (seoData) => {
  useEffect(() => {
    if (seoData.title) {
      updatePageTitle(seoData.title);
    }
    
    if (seoData.description) {
      updateMetaDescription(seoData.description);
    }
    
    if (seoData.canonical) {
      updateCanonicalUrl(seoData.canonical);
    }
    
    if (seoData.openGraph) {
      updateOpenGraphTags(seoData.openGraph);
    }
    
    if (seoData.structuredData) {
      addStructuredData(seoData.structuredData);
    }
  }, [seoData]);
};

// SEO Component for easy integration
export const SEOHead = ({ 
  title, 
  description, 
  canonical, 
  openGraph, 
  structuredData 
}) => {
  useSEO({
    title,
    description,
    canonical,
    openGraph,
    structuredData
  });

  return null; // This component doesn't render anything
};

export default {
  updatePageTitle,
  updateMetaDescription,
  updateCanonicalUrl,
  updateOpenGraphTags,
  addStructuredData,
  generateProductSchema,
  generateBreadcrumbSchema,
  useSEO,
  SEOHead
};

