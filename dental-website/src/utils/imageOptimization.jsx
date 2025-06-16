import React, { useState, useRef, useEffect } from 'react';

// Lazy Image Component with Progressive Loading
export const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = '/placeholder.jpg',
  sizes,
  srcSet,
  loading = 'lazy',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Main Image */}
      {(isInView || loading === 'eager') && (
        <img
          src={hasError ? placeholder : src}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={loading}
          sizes={sizes}
          srcSet={srcSet}
          {...props}
        />
      )}
      
      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500">
          <span>Image unavailable</span>
        </div>
      )}
    </div>
  );
};

// Optimized Image with WebP Support
export const OptimizedImage = ({ 
  src, 
  alt, 
  className = '',
  width,
  height,
  ...props 
}) => {
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <LazyImage
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        {...props}
      />
    </picture>
  );
};

// Responsive Image Component
export const ResponsiveImage = ({ 
  src, 
  alt, 
  className = '',
  breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280
  },
  ...props 
}) => {
  const generateSrcSet = () => {
    const baseName = src.replace(/\.(jpg|jpeg|png)$/i, '');
    const extension = src.match(/\.(jpg|jpeg|png)$/i)?.[0] || '.jpg';
    
    return Object.entries(breakpoints)
      .map(([size, width]) => `${baseName}-${size}${extension} ${width}w`)
      .join(', ');
  };

  const generateSizes = () => {
    return Object.entries(breakpoints)
      .map(([size, width], index, array) => {
        if (index === array.length - 1) return `${width}px`;
        return `(max-width: ${width}px) ${width}px`;
      })
      .join(', ');
  };

  return (
    <LazyImage
      src={src}
      alt={alt}
      className={className}
      srcSet={generateSrcSet()}
      sizes={generateSizes()}
      {...props}
    />
  );
};

// Image with Blur Placeholder
export const BlurImage = ({ 
  src, 
  alt, 
  className = '',
  blurDataURL,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {/* Blur Placeholder */}
      {blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
          aria-hidden="true"
        />
      )}
      
      {/* Main Image */}
      <LazyImage
        src={src}
        alt={alt}
        className={`transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
};

// Performance monitoring hook
export const useImagePerformance = () => {
  const [metrics, setMetrics] = useState({
    totalImages: 0,
    loadedImages: 0,
    failedImages: 0,
    averageLoadTime: 0
  });

  const trackImageLoad = (loadTime) => {
    setMetrics(prev => ({
      ...prev,
      loadedImages: prev.loadedImages + 1,
      averageLoadTime: (prev.averageLoadTime * (prev.loadedImages - 1) + loadTime) / prev.loadedImages
    }));
  };

  const trackImageError = () => {
    setMetrics(prev => ({
      ...prev,
      failedImages: prev.failedImages + 1
    }));
  };

  const trackImageStart = () => {
    setMetrics(prev => ({
      ...prev,
      totalImages: prev.totalImages + 1
    }));
  };

  return { metrics, trackImageLoad, trackImageError, trackImageStart };
};

export default {
  LazyImage,
  OptimizedImage,
  ResponsiveImage,
  BlurImage,
  useImagePerformance
};

