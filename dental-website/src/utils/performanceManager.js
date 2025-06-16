// Service Worker Registration and Management
class ServiceWorkerManager {
  constructor() {
    this.isSupported = 'serviceWorker' in navigator;
    this.registration = null;
  }

  async register() {
    if (!this.isSupported) {
      console.log('Service Worker not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker registered successfully');
      
      // Handle updates
      this.registration.addEventListener('updatefound', () => {
        this.handleUpdate();
      });

      // Check for existing service worker
      if (this.registration.active) {
        console.log('Service Worker is active');
      }

      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  handleUpdate() {
    const newWorker = this.registration.installing;
    
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // New content is available
        this.showUpdateNotification();
      }
    });
  }

  showUpdateNotification() {
    // Show user notification about available update
    if (confirm('New version available! Reload to update?')) {
      window.location.reload();
    }
  }

  async unregister() {
    if (this.registration) {
      await this.registration.unregister();
      console.log('Service Worker unregistered');
    }
  }
}

// Performance monitoring utilities
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      navigation: null,
      resources: [],
      vitals: {}
    };
    
    this.init();
  }

  init() {
    // Wait for page load to collect metrics
    if (document.readyState === 'complete') {
      this.collectMetrics();
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => this.collectMetrics(), 0);
      });
    }
  }

  collectMetrics() {
    this.collectNavigationMetrics();
    this.collectResourceMetrics();
    this.collectCoreWebVitals();
  }

  collectNavigationMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0];
    
    if (navigation) {
      this.metrics.navigation = {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseStart - navigation.requestStart,
        response: navigation.responseEnd - navigation.responseStart,
        dom: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        load: navigation.loadEventEnd - navigation.loadEventStart,
        total: navigation.loadEventEnd - navigation.fetchStart
      };
    }
  }

  collectResourceMetrics() {
    const resources = performance.getEntriesByType('resource');
    
    this.metrics.resources = resources.map(resource => ({
      name: resource.name,
      type: resource.initiatorType,
      size: resource.transferSize,
      duration: resource.duration,
      startTime: resource.startTime
    }));
  }

  collectCoreWebVitals() {
    // First Contentful Paint
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
    if (fcpEntry) {
      this.metrics.vitals.FCP = fcpEntry.startTime;
    }

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.vitals.LCP = lastEntry.startTime;
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // LCP not supported
      }

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.vitals.CLS = clsValue;
          }
        }
      });
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // CLS not supported
      }
    }
  }

  getMetrics() {
    return this.metrics;
  }

  logMetrics() {
    console.group('Performance Metrics');
    console.log('Navigation:', this.metrics.navigation);
    console.log('Core Web Vitals:', this.metrics.vitals);
    console.log('Resources:', this.metrics.resources);
    console.groupEnd();
  }

  // Send metrics to analytics
  sendMetrics(endpoint) {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, JSON.stringify(this.metrics));
    } else {
      fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(this.metrics),
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch(console.error);
    }
  }
}

// Resource preloader
export class ResourcePreloader {
  constructor() {
    this.preloadedResources = new Set();
  }

  preloadImage(src) {
    if (this.preloadedResources.has(src)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
    
    this.preloadedResources.add(src);
  }

  preloadFont(href, type = 'font/woff2') {
    if (this.preloadedResources.has(href)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = type;
    link.href = href;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    
    this.preloadedResources.add(href);
  }

  preloadScript(src) {
    if (this.preloadedResources.has(src)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = src;
    document.head.appendChild(link);
    
    this.preloadedResources.add(src);
  }

  prefetchResource(href) {
    if (this.preloadedResources.has(href)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
    
    this.preloadedResources.add(href);
  }
}

// Initialize performance monitoring
export const initializePerformance = () => {
  // Register service worker
  const swManager = new ServiceWorkerManager();
  swManager.register();

  // Initialize performance monitoring
  const perfMonitor = new PerformanceMonitor();
  
  // Initialize resource preloader
  const preloader = new ResourcePreloader();
  
  // Preload critical resources
  preloader.preloadFont('/fonts/inter-var.woff2');
  preloader.preloadImage('/hero-dental-tool-3d.png');
  
  // Log metrics after page load (for development)
  if (process.env.NODE_ENV === 'development') {
    setTimeout(() => {
      perfMonitor.logMetrics();
    }, 3000);
  }

  return {
    swManager,
    perfMonitor,
    preloader
  };
};

export default {
  ServiceWorkerManager,
  PerformanceMonitor,
  ResourcePreloader,
  initializePerformance
};

