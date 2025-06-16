import React, { memo, useMemo, useCallback } from 'react';

// Higher-order component for performance optimization
export const withPerformance = (WrappedComponent, displayName) => {
  const MemoizedComponent = memo(WrappedComponent);
  MemoizedComponent.displayName = displayName || WrappedComponent.displayName || WrappedComponent.name;
  return MemoizedComponent;
};

// Debounce hook for performance optimization
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle hook for performance optimization
export const useThrottle = (value, limit) => {
  const [throttledValue, setThrottledValue] = React.useState(value);
  const lastRan = React.useRef(Date.now());

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
};

// Virtual scrolling hook for large lists
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return {
      startIndex,
      endIndex,
      items: items.slice(startIndex, endIndex),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight
    };
  }, [items, itemHeight, containerHeight, scrollTop]);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return { visibleItems, handleScroll };
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [entry, setEntry] = React.useState(null);
  const elementRef = React.useRef(null);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      setEntry(entry);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return { elementRef, isIntersecting, entry };
};

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = React.useState({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0
  });

  const startTime = React.useRef(0);

  React.useEffect(() => {
    startTime.current = performance.now();
  });

  React.useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;
    
    setMetrics(prev => ({
      renderCount: prev.renderCount + 1,
      lastRenderTime: renderTime,
      averageRenderTime: (prev.averageRenderTime * prev.renderCount + renderTime) / (prev.renderCount + 1)
    }));
  });

  return metrics;
};

// Memoized search function
export const useMemoizedSearch = (items, searchTerm, searchFields) => {
  return useMemo(() => {
    if (!searchTerm) return items;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    
    return items.filter(item => 
      searchFields.some(field => 
        item[field]?.toLowerCase().includes(lowercaseSearch)
      )
    );
  }, [items, searchTerm, searchFields]);
};

// Optimized event handler
export const useOptimizedEventHandler = (handler, dependencies = []) => {
  return useCallback(handler, dependencies);
};

// Bundle size analyzer utility
export const analyzeBundleSize = () => {
  if (typeof window !== 'undefined' && window.performance) {
    const navigation = performance.getEntriesByType('navigation')[0];
    const resources = performance.getEntriesByType('resource');
    
    const jsResources = resources.filter(resource => 
      resource.name.includes('.js') || resource.name.includes('.jsx')
    );
    
    const cssResources = resources.filter(resource => 
      resource.name.includes('.css')
    );
    
    const totalJSSize = jsResources.reduce((total, resource) => 
      total + (resource.transferSize || 0), 0
    );
    
    const totalCSSSize = cssResources.reduce((total, resource) => 
      total + (resource.transferSize || 0), 0
    );
    
    return {
      navigation,
      totalJSSize: Math.round(totalJSSize / 1024), // KB
      totalCSSSize: Math.round(totalCSSSize / 1024), // KB
      jsResourceCount: jsResources.length,
      cssResourceCount: cssResources.length,
      loadTime: navigation.loadEventEnd - navigation.fetchStart
    };
  }
  
  return null;
};

// Core Web Vitals monitoring
export const useCoreWebVitals = () => {
  const [vitals, setVitals] = React.useState({
    FCP: null, // First Contentful Paint
    LCP: null, // Largest Contentful Paint
    FID: null, // First Input Delay
    CLS: null  // Cumulative Layout Shift
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    // FCP
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          setVitals(prev => ({ ...prev, FCP: entry.startTime }));
        }
      }
    });
    observer.observe({ entryTypes: ['paint'] });

    // LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      setVitals(prev => ({ ...prev, LCP: lastEntry.startTime }));
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // CLS
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          setVitals(prev => ({ ...prev, CLS: clsValue }));
        }
      }
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    return () => {
      observer.disconnect();
      lcpObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  return vitals;
};

// Loading skeleton component
export const LoadingSkeleton = memo(({ 
  width = '100%', 
  height = '20px', 
  className = '',
  count = 1 
}) => {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-gray-200 rounded mb-2"
          style={{ width, height }}
        />
      ))}
    </div>
  );
});

LoadingSkeleton.displayName = 'LoadingSkeleton';

export default {
  withPerformance,
  useDebounce,
  useThrottle,
  useVirtualScroll,
  useIntersectionObserver,
  usePerformanceMonitor,
  useMemoizedSearch,
  useOptimizedEventHandler,
  analyzeBundleSize,
  useCoreWebVitals,
  LoadingSkeleton
};

