import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Added Navigate
import './App.css';

// Context Providers
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Core Page Components
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Shop from './components/Shop';
import ProductDetail from './components/ProductDetail';
import Login from './components/Login';
import Register from './components/Register';
import Account from './components/Account';
import Admin from './components/Admin';
import CartSidebar from './components/CartSidebar';

// Auth Page Components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminArticlesPage from './pages/admin/AdminArticlesPage';

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

  // Determine if the current route is an admin route
  // This is a bit of a hack for layout purposes, ideally layouts are part of routing structure
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/mon-compte" element={<Account />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          
          <Footer />
          
          <CartSidebar 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
          />
        </div>

        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
