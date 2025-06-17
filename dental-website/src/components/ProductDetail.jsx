import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  ShoppingCart, 
  Heart, // Keep for future wishlist
  Share2, // Keep for future share
  Plus, 
  Minus,
  Check,
  Truck,
  Shield,
  RotateCcw,
  AlertTriangle, // For error display
  Loader2 // For loading spinner
} from 'lucide-react';
import axios from 'axios'; // Assuming axios is configured
import { useCart } from '../context/CartContext';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // ShadCN Tabs

// Helper for price formatting
const formatPrice = (price) => {
    if (price === null || price === undefined) return '';
    return price.toLocaleString('fr-FR', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' MAD';
};

const ProductDetail = () => {
  const { id } = useParams(); // Product ID from URL
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0); // Index of the main image
  const [isAddedToCart, setIsAddedToCart] = useState(false);


  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/products/${id}`);
        setProduct(response.data);
        if (response.data.images && response.data.images.length > 0) {
          // Assuming images are full URLs or paths that work with current setup
        } else if (response.data.image_url) {
          // If only one main image_url is provided, wrap it in an array
          response.data.images = [response.data.image_url];
        } else {
          response.data.images = ['/api/placeholder/600/600']; // Default placeholder
        }
        setSelectedImage(0); // Default to the first image
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError('Impossible de charger les détails du produit. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const cartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.images[0] // Use the first image for cart
    };
    addItem(cartProduct, quantity);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2500); // Reset message after 2.5s
  };

  // Render Loading State
  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        <Skeleton className="h-8 w-1/4 mb-8" /> {/* Breadcrumb skeleton */}
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-4 mt-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-square w-full rounded-lg" />)}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-6 w-1/3 mb-2" /> {/* Category/Ref */}
            <Skeleton className="h-10 w-3/4 mb-4" /> {/* Name */}
            <Skeleton className="h-20 w-full mb-4" /> {/* Short Desc */}
            <Skeleton className="h-6 w-1/4 mb-4" /> {/* Rating */}
            <Skeleton className="h-10 w-1/2 mb-4" /> {/* Price */}
            <Skeleton className="h-6 w-1/3 mb-6" /> {/* Stock */}
            <div className="flex space-x-4">
              <Skeleton className="h-12 w-1/3" /> {/* Quantity */}
              <Skeleton className="h-12 flex-1" /> {/* Add to cart */}
            </div>
          </div>
        </div>
        <Skeleton className="h-96 w-full mt-16" /> {/* Tabs skeleton */}
      </div>
    );
  }

  // Render Error State
  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-red-700 mb-3">Erreur</h2>
        <p className="text-red-600 mb-6">{error}</p>
        <Link to="/boutique">
          <Button>Retour à la boutique</Button>
        </Link>
      </div>
    );
  }

  // Render Product Not Found (if API returns nothing but not an error, e.g. 404)
  if (!product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 text-center">
        <Search className="w-16 h-16 text-gray-400 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Produit non trouvé</h2>
        <p className="text-gray-600 mb-6">Désolé, nous n'avons pas pu trouver le produit que vous cherchez.</p>
        <Link to="/boutique">
          <Button>Explorer la boutique</Button>
        </Link>
      </div>
    );
  }

  // Ensure product.images is an array, default if not
  const productImages = Array.isArray(product.images) && product.images.length > 0
                        ? product.images
                        : [product.image_url || '/api/placeholder/600/600'];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="flex items-center space-x-2 text-sm text-gray-600 mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        >
          <Link to="/" className="hover:text-primary">Accueil</Link>
          <span>/</span>
          <Link to="/boutique" className="hover:text-primary">Boutique</Link>
          <span>/</span>
          <span className="text-gray-900 truncate max-w-xs">{product.name}</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          >
            <div className="aspect-square bg-white rounded-lg shadow-md overflow-hidden border">
              <img
                src={productImages[selectedImage]}
                alt={`${product.name} - image ${selectedImage + 1}`}
                className="w-full h-full object-contain transition-opacity duration-300"
                onError={(e) => e.target.src = '/api/placeholder/600/600'}
              />
            </div>
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-md shadow-sm overflow-hidden border-2 transition-all duration-200 hover:opacity-80
                                ${selectedImage === index ? 'border-primary ring-2 ring-primary/50' : 'border-gray-200'}`}
                  >
                    <img src={image} alt={`Miniature ${index + 1}`} className="w-full h-full object-cover" onError={(e) => e.target.src = '/api/placeholder/100/100'}/>
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div>
              {product.category && <span className="text-sm text-primary font-medium mb-1 inline-block">{product.category.name || product.category}</span>}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{product.name}</h1>
              <p className="text-gray-600 text-md leading-relaxed">{product.short_description || "Aucune description courte disponible."}</p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-gray-600 text-sm">({product.reviews_count || 0} avis)</span>
            </div>

            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xl text-gray-500 line-through">{formatPrice(product.original_price)}</span>
              )}
            </div>

            <div className={`flex items-center space-x-2 ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <Check className={`w-5 h-5 ${product.stock_quantity > 0 ? '' : 'hidden'}`} />
              <AlertTriangle className={`w-5 h-5 ${product.stock_quantity > 0 ? 'hidden' : ''}`} />
              <span className="font-medium">
                {product.stock_quantity > 0 ? `En stock (${product.stock_quantity} disponibles)` : 'Rupture de stock'}
              </span>
            </div>

            {/* Features list from API if available */}
            {Array.isArray(product.features) && product.features.length > 0 && (
              <ul className="space-y-1 text-sm text-gray-600 list-inside">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" /> {typeof feature === 'string' ? feature : JSON.stringify(feature)}
                  </li>
                ))}
              </ul>
            )}


            <div className="pt-4 space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-gray-700 font-medium">Quantité:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Réduire la quantité">
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 font-medium w-12 text-center">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)} aria-label="Augmenter la quantité">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!product.stock_quantity || product.stock_quantity === 0 || isAddedToCart}
                  className={`flex-1 ${isAddedToCart ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                  {isAddedToCart ? (
                    <> <Check className="w-5 h-5 mr-2" /> Ajouté! </>
                  ) : (
                    <> <ShoppingCart className="w-5 h-5 mr-2" /> Ajouter au panier </>
                  )}
                </Button>
                <Button size="lg" variant="outline" className="flex items-center justify-center">
                  <Heart className="w-5 h-5 mr-2 text-gray-600" /> Liste de souhaits
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 text-xs">
                <div className="flex items-center space-x-2"> <Truck className="w-5 h-5 text-primary"/> <span>Livraison rapide</span> </div>
                <div className="flex items-center space-x-2"> <Shield className="w-5 h-5 text-primary"/> <span>Paiement sécurisé</span> </div>
                <div className="flex items-center space-x-2"> <RotateCcw className="w-5 h-5 text-primary"/> <span>Retours faciles</span> </div>
            </div>

          </motion.div>
        </div>

        <motion.div
          className="mt-12 md:mt-16"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-6 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Spécifications</TabsTrigger>
              <TabsTrigger value="reviews">Avis ({product.reviews_count || 0})</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="prose max-w-none p-4 bg-white rounded-lg shadow-sm border">
              <div dangerouslySetInnerHTML={{ __html: product.description || "<p>Aucune description disponible.</p>" }} />
            </TabsContent>
            <TabsContent value="specifications" className="p-4 bg-white rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Spécifications Techniques</h3>
              {product.specifications && typeof product.specifications === 'object' && Object.keys(product.specifications).length > 0 ? (
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex py-1.5 border-b border-gray-100">
                      <dt className="font-medium text-gray-600 w-1/3">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</dt>
                      <dd className="text-gray-800 w-2/3">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p>Aucune spécification disponible pour ce produit.</p>
              )}
            </TabsContent>
            <TabsContent value="reviews" className="p-4 bg-white rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Avis Clients</h3>
              {/* Placeholder for reviews - API should provide reviews for a product */}
              <p>Les avis pour ce produit ne sont pas encore disponibles.</p>
              {/* TODO: Implement review fetching and display if API supports it */}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
