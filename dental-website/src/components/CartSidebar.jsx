import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2, MessageSquare, AlertCircle } from 'lucide-react'; // Added MessageSquare for WhatsApp, AlertCircle
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import axios from 'axios'; // Import axios
import { Button } from "@/components/ui/button"; // Using ShadCN Button
import { Input } from "@/components/ui/input"; // For customer name if guest
import { Label } from "@/components/ui/label"; // For customer name input
import { toast } from "sonner"; // For notifications

// Helper for price formatting (consistent with Shop.jsx)
const formatPrice = (price) => {
    if (price === null || price === undefined) return '0 MAD';
    return price.toLocaleString('fr-FR', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' MAD';
};

const CartSidebar = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth(); // Get user details

  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const VITE_WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;
  const isCartEmpty = items.length === 0;

  useEffect(() => {
    if (isAuthenticated && user?.username) {
      setCustomerName(user.username);
    } else {
      setCustomerName(''); // Reset if user logs out or no username
    }
  }, [isAuthenticated, user]);

  const handleWhatsAppCheckout = async () => {
    const whatsappNumber = VITE_WHATSAPP_NUMBER; // Use a local const for checks
    if (!whatsappNumber || !/^[+\d]+$/.test(whatsappNumber)) { // Improved check
        toast.error("Le service WhatsApp n'est pas configuré correctement. Veuillez contacter le support.");
        setCheckoutError("Configuration WhatsApp invalide ou numéro manquant."); // More specific error
        setIsSubmitting(false); // Ensure button is re-enabled if it was disabled by isSubmitting
        return;
    }

    // This check is also part of the button's disabled state, but good for explicit function guard
    if (isCartEmpty) {
        toast.error("Votre panier est vide.");
        return;
    }

    if (!customerName.trim() && !isAuthenticated) {
        toast.error("Veuillez entrer votre nom pour continuer.");
        setCheckoutError("Le nom du client est requis.");
        return;
    }

    setIsSubmitting(true);
    setCheckoutError('');

    const finalCustomerName = isAuthenticated && user?.username ? user.username : customerName.trim();

    let messageParts = [`Nouvelle commande DentalTech Pro:\n`];
    messageParts.push(`Nom du client: ${finalCustomerName}\n`);
    messageParts.push("Produits:\n");
    items.forEach(item => {
      messageParts.push(`- ${item.name} (Quantité: ${item.quantity}, Prix: ${formatPrice(item.price * item.quantity)})\n`);
    });
    messageParts.push(`\nTotal: ${formatPrice(getTotalPrice())}`);
    const generatedWhatsAppMessageString = messageParts.join('');

    const orderPayload = {
      cart_items: items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price, // Price per unit
        product_id: item.id // ensure product_id is sent if backend expects it
      })),
      total_price: getTotalPrice(),
      customer_name: finalCustomerName,
      whatsapp_message: generatedWhatsAppMessageString
    };

    try {
      // Step 1: Call backend to save the order
      const response = await axios.post('/orders/whatsapp_checkout', orderPayload);

      if (response.status === 201) {
        toast.success("Commande enregistrée! Vous allez être redirigé vers WhatsApp.");

        // Step 2: Open WhatsApp link
        const whatsappUrl = `https://wa.me/${VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(generatedWhatsAppMessageString)}`;
        window.open(whatsappUrl, '_blank');

        clearCart();
        onClose(); // Close sidebar on success
      } else {
        // Handle non-201 success responses if necessary
        toast.error("Erreur lors de la création de la commande.");
        setCheckoutError(response.data?.message || "Une erreur s'est produite.");
      }
    } catch (error) {
      console.error("WhatsApp checkout error:", error);
      toast.error("Échec de la soumission de la commande.");
      setCheckoutError(error.response?.data?.message || "Impossible de contacter le serveur. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 z-40 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 250 }}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Panier ({items.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fermer le panier">
                <X className="w-6 h-6 text-gray-500" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Votre panier est vide</h3>
                  <p className="text-gray-500">Continuez vos achats pour ajouter des produits.</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    className="flex items-start space-x-4 bg-gray-50 p-4 rounded-xl border border-gray-100"
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden border">
                      <img src={item.image_url || '/api/placeholder/100/100'} alt={item.name} className="w-full h-full object-cover"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-md font-semibold text-gray-800 truncate">{item.name}</h4>
                      <p className="text-sm text-gray-600 mb-1">{formatPrice(item.price)}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Réduire la quantité">
                          <Minus className="w-3.5 h-3.5" />
                        </Button>
                        <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Augmenter la quantité">
                          <Plus className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                        <p className="text-md font-semibold text-gray-800 mb-1">{formatPrice(item.price * item.quantity)}</p>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 px-1 py-0.5 h-auto" onClick={() => removeItem(item.id)} aria-label="Supprimer l'article">
                            <Trash2 className="w-4 h-4 mr-1" /> Supprimer
                        </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-200 p-5 space-y-4 bg-gray-50">
                <div className="flex items-center justify-between text-lg font-semibold text-gray-800">
                  <span>Total à payer:</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>

                {!isAuthenticated && (
                    <div className="space-y-1.5">
                        <Label htmlFor="customerName" className="text-sm font-medium text-gray-700">Votre Nom (pour la commande)</Label>
                        <Input
                            id="customerName"
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Entrez votre nom complet"
                            className="bg-white"
                        />
                    </div>
                )}

                <p className="text-xs text-gray-600 text-center p-2 bg-green-50 border border-green-200 rounded-md">
                  Vous serez redirigé vers nos conseillers WhatsApp pour finaliser votre achat.
                </p>

                {checkoutError && (
                    <div className="flex items-center space-x-2 text-sm text-red-600 p-2.5 bg-red-50 border border-red-200 rounded-md">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{checkoutError}</span>
                    </div>
                )}

                <Button
                  onClick={handleWhatsAppCheckout}
                  disabled={isSubmitting || isCartEmpty || (!isAuthenticated && !customerName.trim())}
                  className="w-full text-lg py-6 bg-green-500 hover:bg-green-600 text-white flex items-center justify-center space-x-2.5"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>{isSubmitting ? 'Traitement...' : 'Commander via WhatsApp'}</span>
                </Button>

                {items.length > 0 && (
                    <Button
                      onClick={clearCart}
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Vider le panier
                    </Button>
                )}

                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="w-full text-center text-gray-600 hover:text-gray-800"
                >
                  Continuer les achats
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
