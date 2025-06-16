import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Plus, 
  Minus,
  Check,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // Mock product data - in real app this would come from API
  const product = {
    id: 1,
    name: 'Unit dentaire premium X1',
    category: 'Équipements',
    price: 15999,
    originalPrice: 17999,
    rating: 4.8,
    reviews: 24,
    inStock: true,
    stockCount: 5,
    images: [
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600'
    ],
    badge: 'Promotion',
    shortDescription: 'Unit dentaire haut de gamme avec technologie LED intégrée et système de stérilisation automatique.',
    description: `
      <h3>Description complète</h3>
      <p>L'Unit dentaire premium X1 représente le summum de la technologie dentaire moderne. Conçu pour les praticiens exigeants, cet équipement combine performance, ergonomie et esthétique dans un design épuré.</p>
      
      <h4>Caractéristiques principales :</h4>
      <ul>
        <li>Éclairage LED haute performance avec température de couleur ajustable</li>
        <li>Système de stérilisation automatique intégré</li>
        <li>Interface tactile intuitive de 12 pouces</li>
        <li>Moteurs électriques silencieux et précis</li>
        <li>Système d'aspiration haute performance</li>
      </ul>
    `,
    specifications: {
      'Dimensions': '180 x 165 x 200 cm',
      'Poids': '320 kg',
      'Alimentation': '230V / 50Hz',
      'Consommation': '2.5 kW',
      'Éclairage': 'LED 50,000 lux',
      'Garantie': '5 ans',
      'Certification': 'CE, ISO 13485',
      'Origine': 'Allemagne'
    },
    features: [
      'Livraison et installation incluses',
      'Formation du personnel offerte',
      'Maintenance préventive 1 an',
      'Support technique 24/7',
      'Garantie pièces et main d\'œuvre'
    ],
    reviews: [
      {
        id: 1,
        author: 'Dr. Sophie Martin',
        rating: 5,
        date: '2024-05-15',
        comment: 'Excellent équipement, très satisfaite de mon achat. La qualité est au rendez-vous et l\'installation s\'est parfaitement déroulée.'
      },
      {
        id: 2,
        author: 'Dr. Pierre Dubois',
        rating: 5,
        date: '2024-04-22',
        comment: 'Unit dentaire de très haute qualité. Mes patients apprécient le confort et moi la précision des instruments.'
      },
      {
        id: 3,
        author: 'Dr. Marie Lefevre',
        rating: 4,
        date: '2024-04-10',
        comment: 'Très bon produit, quelques réglages nécessaires au début mais le support technique est très réactif.'
      }
    ]
  };

  const handleAddToCart = () => {
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Spécifications' },
    { id: 'reviews', label: `Avis (${product.reviews.length})` }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div
          className="flex items-center space-x-2 text-sm text-gray-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link to="/" className="hover:text-blue-600">Accueil</Link>
          <span>/</span>
          <Link to="/boutique" className="hover:text-blue-600">Boutique</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center relative">
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <ShoppingCart className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-gray-600 font-medium text-lg">{product.name}</p>
                </div>
                
                {product.badge && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {product.badge}
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-lg shadow-md overflow-hidden border-2 transition-colors duration-200 ${
                    selectedImage === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <span>{product.category}</span>
                <span>•</span>
                <span>Ref: DTP-{product.id.toString().padStart(4, '0')}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{product.shortDescription}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">({product.reviews.length} avis)</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-gray-900">
                {product.price.toLocaleString('fr-FR')}€
              </span>
              {product.originalPrice && (
                <span className="text-2xl text-gray-500 line-through">
                  {product.originalPrice.toLocaleString('fr-FR')}€
                </span>
              )}
              {product.originalPrice && (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.inStock ? (
                <>
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-green-600 font-medium">En stock ({product.stockCount} disponibles)</span>
                </>
              ) : (
                <span className="text-red-600 font-medium">Rupture de stock</span>
              )}
            </div>

            {/* Features */}
            <div className="space-y-2">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Quantité:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                    isAddedToCart
                      ? 'bg-green-600 text-white'
                      : product.inStock
                      ? 'bg-blue-600 hover:bg-blue-700 text-white hover:transform hover:-translate-y-1 hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isAddedToCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Ajouté au panier</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Ajouter au panier</span>
                    </>
                  )}
                </button>

                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <Heart className="w-6 h-6 text-gray-600" />
                </button>

                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <Share2 className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Service Icons */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Truck className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Livraison gratuite</div>
                <div className="text-xs text-gray-600">Sous 48h</div>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Garantie 5 ans</div>
                <div className="text-xs text-gray-600">Pièces et main d'œuvre</div>
              </div>
              <div className="text-center">
                <RotateCcw className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Retour 30 jours</div>
                <div className="text-xs text-gray-600">Satisfait ou remboursé</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Spécifications techniques</h3>
                  <dl className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <dt className="font-medium text-gray-700">{key}</dt>
                        <dd className="text-gray-900">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Avis clients</h3>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                    Écrire un avis
                  </button>
                </div>

                <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.author}</h4>
                          <div className="flex items-center space-x-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;

