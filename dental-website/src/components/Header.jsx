import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, ShoppingBag, UserCircle, LogOut, LogIn, UserPlus, ShieldCheck } from 'lucide-react'; // Added ShieldCheck for Admin
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { SkipLink, ScreenReaderOnly } from '../utils/accessibility';


const Header = ({ isScrolled, onCartClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const { user, logout } = useAuth();


  const navItems = [
    { name: 'Accueil', href: '/', section: 'hero' },
    { name: 'À propos', href: '/', section: 'about' },
    { name: 'Réalisations', href: '/', section: 'achievements' },
    { name: 'Contact', href: '/', section: 'contact' },
  ];

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      // If not on homepage, navigate to homepage then scroll.
      // Consider if direct navigation to section is better.
      navigate(`/#${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate('/'); // Redirect to home after logout
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const commonLinkClasses = isScrolled
    ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
    : 'text-white/90 hover:text-white hover:bg-white/10';
  const commonButtonBaseClasses = "px-4 py-2 rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500";


  return (
    <>
      <SkipLink href="#main-content">
        Aller au contenu principal
      </SkipLink>
      
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
        }`}
        role="banner"
      >
        <nav 
          className="container mx-auto px-6 py-4"
          role="navigation"
          aria-label="Navigation principale"
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="DentalTech Pro - Retour à l'accueil"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-turquoise-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl" aria-hidden="true">D</span>
              </div>
              <h1 className={`text-xl font-bold transition-colors ${
                isScrolled ? 'text-gray-800' : 'text-white'
              }`}>
                DentalTech Pro
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6"> {/* Adjusted space for more items */}
              <ul className="flex items-center space-x-6" role="menubar"> {/* Adjusted space */}
                {navItems.map((item) => (
                  <li key={item.name} role="none">
                    <button
                      onClick={() => scrollToSection(item.section)}
                      onKeyDown={(e) => handleKeyDown(e, () => scrollToSection(item.section))}
                      className={`${commonButtonBaseClasses} ${commonLinkClasses}`}
                      role="menuitem"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>

              <Link
                to="/boutique"
                className={`flex items-center ${commonButtonBaseClasses} bg-turquoise-500 text-white hover:bg-turquoise-600 focus:ring-turquoise-500`}
                aria-label="Accéder à la boutique en ligne"
              >
                <ShoppingBag className="w-5 h-5 mr-2" aria-hidden="true" />
                Boutique
              </Link>

              {user ? (
                <>
                  <Link to="/mon-compte" className="text-sm text-gray-600 hover:text-blue-600">
                    {user.username}
                  </Link>
                  <button onClick={logout} className="text-sm text-gray-600 ml-2 hover:text-red-600">Déconnexion</button>
                </>
              ) : (
                <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600">Se connecter</Link>
              )}

              {/* Cart Button */}
              <button
                onClick={onCartClick}
                onKeyDown={(e) => handleKeyDown(e, onCartClick)}
                className={`relative p-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isScrolled
                    ? 'text-gray-600 hover:text-blue-600'
                    : 'text-white/90 hover:text-white'
                }`}
                aria-label={`Panier d'achat, ${totalItems} article${totalItems !== 1 ? 's' : ''}`}
                aria-describedby="cart-count"
              >
                <ShoppingBag className="w-6 h-6" aria-hidden="true" />
                {totalItems > 0 && (
                  <span
                    id="cart-count"
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    aria-label={`${totalItems} article${totalItems !== 1 ? 's' : ''} dans le panier`}

                  >
                    <ShoppingBag className="w-6 h-6" />
                    {totalItems > 0 && (
                      <span
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        {totalItems}
                      </span>
                    )}
                  </button>

                  {/* Auth Links Desktop */}
                  {!loading && (
                    isAuthenticated ? (
                      <>
                        {user?.role === 'admin' && (
                          <Link to="/admin/dashboard" className={`${commonButtonBaseClasses} ${commonLinkClasses} flex items-center text-red-500 hover:text-red-700`}>
                            <ShieldCheck className="w-5 h-5 mr-1" /> Admin
                          </Link>
                        )}
                        <Link to="/mon-compte" className={`${commonButtonBaseClasses} ${commonLinkClasses} flex items-center`}>
                          <UserCircle className="w-5 h-5 mr-1" /> {user?.username || 'Mon Compte'}
                        </Link>
                        <Button onClick={handleLogout} variant="outline" size="sm" className={`${isScrolled ? 'text-gray-700 border-gray-300 hover:bg-gray-100' : 'text-white border-white/50 hover:bg-white/10'}`}>
                          <LogOut className="w-4 h-4 mr-1" /> Déconnexion
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className={`${commonButtonBaseClasses} ${commonLinkClasses} flex items-center`}>
                          <LogIn className="w-5 h-5 mr-1" /> Connexion
                        </Link>
                        <Link to="/register" className={`${commonButtonBaseClasses} ${commonLinkClasses} flex items-center`}>
                          <UserPlus className="w-5 h-5 mr-1" /> Inscription
                        </Link>
                      </>
                    )
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              onKeyDown={(e) => handleKeyDown(e, () => setIsMobileMenuOpen(!isMobileMenuOpen))}
              className={`md:hidden p-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${commonLinkClasses}`}
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg"
              role="menu"
              aria-label="Menu mobile"
            >
              <ul className="space-y-2 px-4" role="none">
                {navItems.map((item) => (
                  <li key={item.name} role="none">
                    <button
                      onClick={() => scrollToSection(item.section)}
                      className="block w-full text-left px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      role="menuitem"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
                <li role="none">
                  <Link to="/boutique" className="block w-full text-left px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg" role="menuitem">
                    <ShoppingBag className="w-5 h-5 inline mr-2" /> Boutique
                  </Link>
                </li>
                <li role="none">
                  <button
                    onClick={onCartClick}
                    onKeyDown={(e) => handleKeyDown(e, onCartClick)}
                    className="flex items-center w-full text-left px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    role="menuitem"
                    aria-label={`Panier d'achat, ${totalItems} article${totalItems !== 1 ? 's' : ''}`}
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" aria-hidden="true" />
                    Panier ({totalItems})
                  </button>
                </li>
                <li role="none">
                  {user ? (
                    <button onClick={logout} className="block w-full text-left px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-blue-50 rounded-lg">Se déconnecter</button>
                  ) : (
                    <Link to="/login" className="block w-full text-left px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">Se connecter</Link>
                  )}
                </li>

              </ul>
            </motion.div>
          )}
        </nav>
      </motion.header>
    </>
  );
};

export default Header;
