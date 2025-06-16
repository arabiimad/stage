import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  ShoppingCart,
  Heart,
  Eye,
  ChevronDown
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const Shop = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const { addItem } = useCart();

  const categories = [
    { id: 'all', name: 'Tous les produits', count: 24 },
    { id: 'equipments', name: 'Équipements', count: 12 },
    { id: 'consumables', name: 'Consommables', count: 8 },
    { id: 'cadcam', name: 'CAD/CAM', count: 4 }
  ];

  const products = [
    {
      id: 1,
      name: 'Unit dentaire premium X1',
      category: 'equipments',
      price: 15999,
      originalPrice: 17999,
      rating: 4.8,
      reviews: 24,
      image: '/api/placeholder/300/300',
      badge: 'Promotion',
      description: 'Unit dentaire haut de gamme avec technologie LED intégrée'
    },
    {
      id: 2,
      name: 'Scanner intra-oral 3D',
      category: 'cadcam',
      price: 8999,
      rating: 4.9,
      reviews: 18,
      image: '/api/placeholder/300/300',
      badge: 'Nouveau',
      description: 'Scanner haute précision pour empreintes numériques'
    },
    {
      id: 3,
      name: 'Compresseur silencieux',
      category: 'equipments',
      price: 2499,
      rating: 4.7,
      reviews: 32,
      image: '/api/placeholder/300/300',
      description: 'Compresseur ultra-silencieux pour cabinet dentaire'
    },
    {
      id: 4,
      name: 'Kit d\'instruments chirurgicaux',
      category: 'consumables',
      price: 299,
      rating: 4.6,
      reviews: 45,
      image: '/api/placeholder/300/300',
      description: 'Set complet d\'instruments pour chirurgie dentaire'
    },
    {
      id: 5,
      name: 'Lampe de polymérisation LED',
      category: 'equipments',
      price: 899,
      rating: 4.8,
      reviews: 28,
      image: '/api/placeholder/300/300',
      description: 'Lampe LED haute performance pour composite'
    },
    {
      id: 6,
      name: 'Gants nitrile premium (100pcs)',
      category: 'consumables',
      price: 24.99,
      rating: 4.5,
      reviews: 156,
      image: '/api/placeholder/300/300',
      description: 'Gants nitrile sans poudre, haute résistance'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product) => {
    addItem(product, 1);
  };

  const ProductCard = ({ product }) => (
    <motion.div
      className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <div className="aspect-w-1 aspect-h-1 w-full h-64 bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center cursor-pointer">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-600 font-medium">{product.name}</p>
            </div>
          </div>
        </Link>
        
        {product.badge && (
          <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
            product.badge === 'Promotion' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}>
            {product.badge}
          </div>
        )}
        
        <div className="absolute top-3 right-3 flex space-x-2">
          <button className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          <Link to={`/product/${product.id}`}>
            <button className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
          </Link>
        </div>
      </div>
      
      <div className="p-6">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              {product.price.toLocaleString('fr-FR')}€
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                {product.originalPrice.toLocaleString('fr-FR')}€
              </span>
            )}
          </div>
          <button 
            onClick={() => handleAddToCart(product)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Ajouter</span>
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour à l'accueil</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Boutique</h1>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="name">Trier par nom</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="rating">Mieux notés</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-colors duration-200 ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-colors duration-200 ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-gray-600">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos critères de recherche ou de navigation.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Réinitialiser les filtres
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Shop;

