import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BellRing, ShoppingCart, Users, PackageMinus, AlertTriangle, XCircle } from "lucide-react";
import { useAuth } from '../../context/AuthContext'; // To get token for EventSource URL if needed
import { toast } from "sonner"; // For general notifications

const API_BASE_URL_FOR_SSE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/^http/, 'ws').replace('/api', ''); // Adjust if needed, or use full path

const AdminDashboardPage = () => {
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [sseError, setSseError] = useState(null);
  const { token } = useAuth(); // Get token

  useEffect(() => {
    // Note on EventSource Authentication:
    // Standard EventSource does not support setting Authorization headers directly.
    // Common workarounds:
    // 1. Cookies: If your auth is cookie-based and SSE endpoint is on the same domain.
    // 2. Query Parameter: Pass token via URL (e.g., `/api/admin/stock_alerts?token=${token}`).
    //    Backend's @admin_required decorator or endpoint logic must be adapted to check this.
    // 3. One-time Token: Exchange JWT for a short-lived one-time token for SSE.
    // For this implementation, we'll try with query parameter.
    // The backend's @admin_required decorator as written will NOT pick up query param tokens by default
    // with flask_jwt_extended. This would require modification on the backend decorator or a specific
    // auth check for this SSE route.
    // We will proceed with the query parameter for now and assume backend might be adapted or this is a known limitation.

    let eventSource;

    // Only attempt to connect if token is available
    if (token) {
        // Construct the URL, ensuring it points to the correct backend endpoint
        // VITE_API_BASE_URL might be like http://localhost:5000/api
        // EventSource needs the full URL including the scheme and host.
        const sseUrl = `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api')}/admin/stock_alerts?jwt_token=${token}`;

        try {
            eventSource = new EventSource(sseUrl);
            // console.log(`SSE: Connecting to ${sseUrl}`);
            setSseError(null);

            eventSource.onopen = () => {
                // console.log("SSE: Connection opened.");
                toast.info("Connecté aux alertes de stock en temps réel.");
                setSseError(null); // Clear previous errors on successful open
            };

            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    // console.log("SSE: Message received:", data);

                    if (data.type === 'low_stock') {
                        setLowStockAlerts(prevAlerts => {
                            const newProducts = data.products.filter(pNew =>
                                !prevAlerts.some(pOld => pOld.id === pNew.id && pOld.stock_quantity === pNew.stock_quantity)
                            );
                            // Update existing or add new
                            let updatedAlerts = prevAlerts.map(pOld => {
                                const updatedProduct = data.products.find(pNew => pNew.id === pOld.id);
                                return updatedProduct ? updatedProduct : pOld;
                            });
                            newProducts.forEach(pNew => {
                                if (!updatedAlerts.some(pOld => pOld.id === pNew.id)) {
                                    updatedAlerts.push(pNew);
                                }
                            });
                            return updatedAlerts;
                        });
                        if (data.products.length > 0) {
                             toast("Alerte de stock bas reçue!", {
                                description: `${data.products.map(p=>p.name).join(', ')}`,
                                icon: <PackageMinus className="w-4 h-4" />
                            });
                        }
                    } else if (data.type === 'stock_ok') {
                        setLowStockAlerts(prevAlerts =>
                            prevAlerts.filter(p => !data.products.some(pOk => pOk.id === p.id))
                        );
                         if (data.products.length > 0) {
                            toast.success("Stock réapprovisionné pour certains produits.", {
                                description: `Les produits avec ID: ${data.products.map(p=>p.id).join(', ')} ne sont plus en alerte.`,
                            });
                        }
                    } else if (data.type === 'connection_ack') {
                        // console.log("SSE: Connection Acknowledged by server.");
                    } else if (data.type === 'error') {
                        // console.error("SSE: Error message from server:", data.message);
                        setSseError(data.message);
                        toast.error("Erreur SSE du serveur: " + data.message);
                    }
                } catch (parseError) {
                    // console.error("SSE: Failed to parse message data:", event.data, parseError);
                }
            };

            eventSource.onerror = (error) => {
                // console.error("SSE: EventSource failed:", error);
                setSseError("Déconnecté du service d'alertes. Tentative de reconnexion...");
                toast.error("Déconnecté des alertes de stock. Vérifiez la console pour les erreurs.");
                // EventSource attempts to reconnect automatically by default.
                // If it's a fatal error or needs manual intervention, close it.
                // For example, if auth fails repeatedly, close it.
                // eventSource.close(); // Close if error is critical (e.g. auth failure)
            };
        } catch (e) {
            // console.error("SSE: Could not create EventSource:", e);
            setSseError("Impossible de se connecter au service d'alertes.");
            toast.error("Impossible de démarrer les alertes de stock.");
        }
    } else {
        setSseError("Non authentifié pour les alertes de stock.");
    }

    // Cleanup
    return () => {
      if (eventSource) {
        // console.log("SSE: Closing EventSource connection.");
        eventSource.close();
      }
    };
  }, [token]); // Re-run effect if token changes (e.g., login/logout)

  const dismissAlert = (productId) => {
    setLowStockAlerts(prevAlerts => prevAlerts.filter(p => p.id !== productId));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {sseError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur de Connexion SSE</AlertTitle>
          <AlertDescription>{sseError}</AlertDescription>
        </Alert>
      )}

      {/* Low Stock Alerts Section */}
      {lowStockAlerts.length > 0 && (
        <Card className="mb-6 border-yellow-500">
          <CardHeader className="bg-yellow-50">
            <CardTitle className="flex items-center text-yellow-700">
              <BellRing className="w-6 h-6 mr-2" />
              Alertes de Stock Bas
            </CardTitle>
            <CardDescription className="text-yellow-600">
              Les produits suivants ont un stock inférieur à 10 unités.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            {lowStockAlerts.map(product => (
              <Alert key={product.id} variant="default" className="flex justify-between items-center bg-yellow-50 border-yellow-200">
                <div>
                  <PackageMinus className="h-4 w-4 inline-block mr-1 text-yellow-600" />
                  <AlertTitle className="text-sm font-semibold text-yellow-700 inline">
                    {product.name} (ID: {product.id})
                  </AlertTitle>
                  <AlertDescription className="text-xs text-yellow-600 ml-5">
                    Stock restant: {product.stock_quantity} unité(s).
                  </AlertDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => dismissAlert(product.id)} title="Ignorer cette alerte">
                    <XCircle className="h-4 w-4 text-yellow-600"/>
                </Button>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Placeholder Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes du Mois</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12,345 MAD</p>
            <p className="text-xs text-muted-foreground">+5% vs mois précédent</p>
          </CardContent>
        </Card>
        {/* Add other cards here */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">356</p>
            <p className="text-xs text-muted-foreground">+12 nouveaux cette semaine</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes en Attente</CardTitle>
             <PackageMinus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">Nécessitent une action</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Aperçu Rapide</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Bienvenue sur le tableau de bord administrateur DentalTech Pro.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
