import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Performance utilities
import { initializePerformance } from './utils/performanceManager';
import { LoadingSkeleton } from './utils/performance';

// Context providers
import { CartProvider } from './context/CartContext';

// Core components (loaded immediately)
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';

// Lazy loaded components for better performance
const Shop = lazy(() => import('./components/Shop'));
const ProductDetail = lazy(() => import('./components/ProductDetail'));

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);

  // Initialize performance monitoring
  useEffect(() => {
    const { perfMonitor } = initializePerformance();
    
    // Collect metrics after component mount
    setTimeout(() => {
      setPerformanceMetrics(perfMonitor.getMetrics());
    }, 2000);
  }, []);

  // Scroll detection for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation for cart
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen]);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Loading fallback component
  const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSkeleton width="300px" height="40px" count={3} />
        <div className="mt-4 text-gray-600">Chargement...</div>
      </div>
    </div>
  );

  return (
    <CartProvider>
      <Router>
        <div className="App">
          {/* Header */}
          <Header 
            isScrolled={isScrolled} 
            onCartClick={toggleCart}
          />

          {/* Main Content */}
          <main>
            <AnimatePresence mode="wait">
              <Routes>
                {/* Home Page */}
                <Route 
                  path="/" 
                  element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Hero />
                      <About />
                      <Achievements />
                      <Contact />
                    </motion.div>
                  } 
                />

                {/* Shop Page - Lazy Loaded */}
                <Route 
                  path="/boutique" 
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Shop />
                      </motion.div>
                    </Suspense>
                  } 
                />

                {/* Product Detail Page - Lazy Loaded */}
                <Route 
                  path="/product/:id" 
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ProductDetail />
                      </motion.div>
                    </Suspense>
                  } 
                />

                {/* 404 Page */}
                <Route 
                  path="*" 
                  element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="min-h-screen flex items-center justify-center"
                    >
                      <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                        <p className="text-gray-600 mb-8">Page non trouvée</p>
                        <a 
                          href="/" 
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Retour à l'accueil
                        </a>
                      </div>
                    </motion.div>
                  } 
                />
              </Routes>
            </AnimatePresence>
          </main>

          {/* Footer */}
          <Footer />

          {/* Cart Sidebar */}
          <CartSidebar 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
          />

          {/* Performance Metrics (Development Only) */}
          {process.env.NODE_ENV === 'development' && performanceMetrics && (
            <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-xs opacity-75 z-50">
              <div className="font-bold mb-2">Performance Metrics</div>
              {performanceMetrics.navigation && (
                <div>
                  Load Time: {Math.round(performanceMetrics.navigation.total)}ms
                </div>
              )}
              {performanceMetrics.vitals.FCP && (
                <div>
                  FCP: {Math.round(performanceMetrics.vitals.FCP)}ms
                </div>
              )}
              {performanceMetrics.vitals.LCP && (
                <div>
                  LCP: {Math.round(performanceMetrics.vitals.LCP)}ms
                </div>
              )}
            </div>
          )}
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;

