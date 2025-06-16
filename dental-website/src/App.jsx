import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';

// Context
import { CartProvider } from './context/CartContext';

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Shop from './components/Shop';
import ProductDetail from './components/ProductDetail';
import CartSidebar from './components/CartSidebar';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Header 
            isScrolled={isScrolled} 
            onCartClick={() => setIsCartOpen(true)}
          />
          
          <Routes>
            <Route path="/" element={
              <main>
                <Hero />
                <About />
                <Achievements />
                <Contact />
              </main>
            } />
            <Route path="/boutique" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
          
          <Footer />
          
          <CartSidebar 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
          />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;

