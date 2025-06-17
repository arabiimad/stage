import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Grid, 
  List, 
  Star, 
  ShoppingCart,
  Heart, // Keep for potential future use (wishlist)
  Eye,   // Keep for "view details" icon
  ChevronDown,
  AlertTriangle, // For error display
  Loader2 // For loading spinner
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import axios from 'axios'; // Assuming axios is configured in AuthContext or globally
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Added missing Label import
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Using ShadCN select
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // For product card styling
import { Skeleton } from "@/components/ui/skeleton"; // For loading skeleton

// Helper for price formatting
const formatPrice = (price) => {
    if (price === null || price === undefined) return '';
    return price.toLocaleString('fr-FR', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' MAD';
};

// Get the base URL for images, ensuring it doesn't end with /api
const VITE_IMAGE_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '');


const Shop = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name_asc'); // Adjusted for API: name_asc, price_asc, price_desc
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12); // Or make this configurable

  const { addItem } = useCart();

  // API Data State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await axios.get('/products/categories');
        // Assuming API returns a list of strings or objects like {id: 'equipments', name: 'Équipements'}
        // If strings, map them to objects:
        const formattedCategories = response.data.map(cat =>
            typeof cat === 'string' ? { id: cat, name: cat.charAt(0).toUpperCase() + cat.slice(1) } : cat
        );
        setCategories([{ id: 'all', name: 'Tous les produits' }, ...formattedCategories]);
        setErrorCategories(null);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setErrorCategories('Impossible de charger les catégories.');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    setErrorProducts(null);
    let params = {
      page: currentPage,
      per_page: productsPerPage,
      sort_by: sortBy.split('_')[0], // 'name', 'price'
      sort_order: sortBy.split('_')[1], // 'asc', 'desc'
    };
    if (selectedCategory !== 'all') {
      params.category = selectedCategory;
    }
    if (searchTerm) {
      params.search = searchTerm;
    }

    const constructedUrl = axios.defaults.baseURL + '/products'; // Base URL is already set globally
    console.log('Fetching products from:', constructedUrl, 'with params:', params);

    try {
      const response = await axios.get('/products', { params });
      console.log('API Response:', response);
      setProducts(response.data.products || []);
      setTotalPages(response.data.pages || 0);
      console.log('Products data set:', response.data.products);
    } catch (err) {
      console.error("Error fetching products:", err.response || err.message || err);
      setErrorProducts(err.response?.data?.error || 'Impossible de charger les produits. Veuillez réessayer.');
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [currentPage, productsPerPage, sortBy, selectedCategory, searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);


  const handleAddToCart = (product) => {
    // Ensure product has id, name, price for the cart
    const cartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url // Or a placeholder if not available
    };
    addItem(cartProduct, 1);
  };

  const ProductCardComponent = ({ product }) => {
    // Construct full image URL. product.image_url might be relative like /static/uploads/...
    // VITE_IMAGE_BASE_URL should be like http://localhost:5000
    const imageUrl = product.image_url
      ? product.image_url.startsWith('http')
        ? product.image_url // Already a full URL
        : `${VITE_IMAGE_BASE_URL}${product.image_url}` // Append base URL if relative path
      : '/placeholder.png'; // Updated fallback placeholder

    return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <Link to={`/produit/${product.id}`} className="block aspect-square w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png'; }} // Updated robust fallback
          />
        </Link>
        {product.badge && (
          <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium z-10 ${
            product.badge.toLowerCase() === 'promotion' ? 'bg-red-500 text-white' :
            product.badge.toLowerCase() === 'nouveau' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
          }`}>
            {product.badge}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link to={`/produit/${product.id}`}>
          <CardTitle className="text-md font-semibold text-gray-800 mb-1 hover:text-primary transition-colors h-12 line-clamp-2">
            {product.name}
          </CardTitle>
        </Link>
        {/* Short description can be added if available from API */}
        {/* <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.short_description || ''}</p> */}
        <div className="flex items-center mb-2">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-2">({product.reviews_count || 0} avis)</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="w-full">
            <div className="mb-3">
                <span className="text-xl font-bold text-gray-900">
                {formatPrice(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                <span className="text-sm text-gray-500 line-through ml-2">
                    {formatPrice(product.original_price)}
                </span>
                )}
            </div>
            <Button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center"
                aria-label={`Ajouter ${product.name} au panier`}
            >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Ajouter au panier
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
  }; // <<<< ADDED MISSING CLOSING BRACE HERE

  const SkeletonCard = () => (
    <Card className="flex flex-col h-full overflow-hidden">
        <Skeleton className="aspect-square w-full" />
        <CardContent className="p-4 flex-grow">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-3" />
            <Skeleton className="h-4 w-1/4" />
        </CardContent>
        <CardFooter className="p-4 pt-0">
            <Skeleton className="h-10 w-full" />
        </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        >
          <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Boutique</h1>
          <div className="w-16"></div> {/* Spacer */}
        </motion.div>

        <motion.div
          className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="lg:col-span-2">
              <Label htmlFor="search-product" className="text-sm font-medium text-gray-700 mb-1 block">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="search-product"
                  type="text"
                  placeholder="Nom du produit..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category-filter" className="text-sm font-medium text-gray-700 mb-1 block">Catégorie</Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => { setSelectedCategory(value); setCurrentPage(1); }}
                disabled={loadingCategories}
              >
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errorCategories && <p className="text-xs text-red-500 mt-1">{errorCategories}</p>}
            </div>

            <div>
              <Label htmlFor="sort-by" className="text-sm font-medium text-gray-700 mb-1 block">Trier par</Label>
              <Select value={sortBy} onValueChange={(value) => { setSortBy(value); setCurrentPage(1); }}>
                <SelectTrigger id="sort-by">
                  <SelectValue placeholder="Trier par..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name_asc">Nom (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Nom (Z-A)</SelectItem>
                  <SelectItem value="price_asc">Prix croissant</SelectItem>
                  <SelectItem value="price_desc">Prix décroissant</SelectItem>
                  {/* <SelectItem value="rating_desc">Mieux notés</SelectItem> Backend needs to support rating sort */}
                </SelectContent>
              </Select>
            </div>

            {/* View mode buttons could be here if preferred, or elsewhere */}
          </div>
        </motion.div>

        <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600 text-sm">
                {loadingProducts ? 'Chargement...' : `${products.length > 0 ? `Affichage de ${products.length} produits` : ''} ${totalPages > 0 ? `sur ${totalPages} page(s)` : ''}`}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Vue:</span>
              <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')} aria-label="Vue grille">
                <Grid className="w-5 h-5" />
              </Button>
              <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')} aria-label="Vue liste">
                <List className="w-5 h-5" />
              </Button>
            </div>
        </div>


        {errorProducts && (
          <div className="text-center py-10 bg-red-50 p-6 rounded-lg shadow">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-700 mb-2">Erreur de chargement</h3>
            <p className="text-red-600 mb-4">{errorProducts}</p>
            <Button onClick={fetchProducts}>Réessayer</Button>
          </div>
        )}

        {loadingProducts && !errorProducts && (
          <div className={`grid gap-4 md:gap-6 ${ viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {[...Array(productsPerPage)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loadingProducts && !errorProducts && products.length > 0 && (
          <motion.div
            className={`grid gap-4 md:gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1' // List view would need a different card component
            }`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
          >
            {products.map((product) => (
              // For list view, you'd conditionally render a ProductListItem or similar
              <ProductCardComponent key={product.id} product={product} />
            ))}
          </motion.div>
        )}

        {!loadingProducts && !errorProducts && products.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          >
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun produit trouvé pour le moment.</h3>
            <p className="text-gray-600 mb-6">
              Notre boutique est peut-être vide ou les filtres actuels ne correspondent à aucun article.
              Essayez de réinitialiser les filtres ou revenez bientôt !
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSortBy('name_asc');
                setCurrentPage(1);
                // fetchProducts(); // fetchProducts is called by useEffect when these states change
              }}
            >
              Réinitialiser les filtres
            </Button>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loadingProducts && !errorProducts && products.length > 0 && (
            <div className="flex justify-center items-center space-x-2 mt-10">
                <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                >
                    Précédent
                </Button>
                <span className="text-sm text-gray-700">
                    Page {currentPage} sur {totalPages}
                </span>
                <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                >
                    Suivant
                </Button>
            </div>
        )}

      </div>
    </div>
  );
};

export default Shop;
