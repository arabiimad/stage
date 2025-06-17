import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DownloadCloud, RefreshCw, AlertTriangle, Loader2, Search, Eye } from "lucide-react";
import { toast } from "sonner";
import { format } from 'date-fns'; // For date formatting
import { fr } from 'date-fns/locale'; // French locale for date-fns

// Helper for price formatting
const formatPrice = (price) => {
    if (price === null || price === undefined) return 'N/A';
    return price.toLocaleString('fr-FR', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' MAD';
};

// Helper function to summarize items
const summarizeItems = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
        return 'Aucun article';
    }
    return items.map(item => `${item.name} (x${item.quantity})`).join(', ');
};

const getStatusClass = (status) => {
    switch (status) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Confirmée': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Expédiée': return 'bg-sky-100 text-sky-800 border-sky-300'; // Sky for shipped
      case 'Livrée': return 'bg-green-100 text-green-800 border-green-300'; // Green for delivered
      case 'Annulée': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
};

const orderStatuses = ['En attente', 'Confirmée', 'Expédiée', 'Livrée', 'Annulée'];


const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState(''); // For filtering by status
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null); // For viewing details (optional)

    const { token } = useAuth();

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (statusFilter) {
                params.status = statusFilter;
            }
            const response = await axios.get('/admin/orders', {
                headers: { Authorization: `Bearer ${token}` },
                params: params
            });
            setOrders(response.data.orders || []);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            setError(err.response?.data?.msg || "Erreur lors du chargement des commandes.");
            toast.error(err.response?.data?.msg || "Erreur chargement commandes.");
        } finally {
            setLoading(false);
        }
    }, [token, statusFilter]);

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [fetchOrders, token]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await axios.put(`/admin/orders/${orderId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Statut de la commande #${orderId} mis à jour.`);
            // Update local state or refetch
            setOrders(prevOrders =>
                prevOrders.map(order => order.id === orderId ? response.data : order)
            );
        } catch (err) {
            toast.error(err.response?.data?.msg || "Échec de la mise à jour du statut.");
        }
    };

    const handleExportCSV = async () => {
        try {
            const response = await axios.get('/admin/orders/export_csv', {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob', // Important for file download
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Exportation CSV réussie !");
        } catch (err) {
            console.error("Failed to export CSV:", err);
            toast.error(err.response?.data?.msg || "Échec de l'exportation CSV.");
        }
    };

    if (loading && !orders.length) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gérer les Commandes</h1>
                <div className="flex flex-col sm:flex-row gap-2 items-stretch">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filtrer par statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Tous les statuts</SelectItem>
                            {orderStatuses.map(status => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleExportCSV} variant="outline">
                        <DownloadCloud className="w-5 h-5 mr-2" />
                        Exporter CSV
                    </Button>
                </div>
            </div>

            {error && !orders.length && ( // Show error prominently if initial load failed
                 <div className="text-center py-10 bg-red-50 p-6 rounded-lg shadow">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-red-700 mb-2">Erreur de chargement</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={fetchOrders}><RefreshCw className="w-4 h-4 mr-2"/> Réessayer</Button>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Articles (Résumé)</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && orders.length === 0 ? ( // Skeleton rows if loading new data
                            [...Array(5)].map((_, i) => (
                                <TableRow key={`skeleton-order-${i}`}>
                                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-28" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 inline-block" /></TableCell>
                                </TableRow>
                            ))
                        ) : orders.length > 0 ? (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">#{order.id}</TableCell>
                                    <TableCell>{order.customer_name}</TableCell>
                                    <TableCell>{format(new Date(order.created_at), 'dd MMM yyyy, HH:mm', { locale: fr })}</TableCell>
                                    <TableCell>{formatPrice(order.total_amount)}</TableCell>
                                    <TableCell className="text-xs max-w-xs truncate" title={summarizeItems(order.items)}>
                                        {summarizeItems(order.items)}
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={order.status}
                                            onValueChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                                        >
                                            <SelectTrigger className={`h-8 text-xs px-2 py-1 rounded-md border ${getStatusClass(order.status)}`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {orderStatuses.map(status => (
                                                    <SelectItem key={status} value={status} className="text-xs">
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button variant="ghost" size="icon" onClick={() => alert(`Détails commande #${order.id}`)} title="Voir détails">
                                            <Eye className="w-4 h-4 text-gray-600" />
                                        </Button>
                                        {/* Future: <Button variant="link" onClick={() => setSelectedOrderDetails(order)}>Voir Détails</Button> */}
                                    </td>
                                </TableRow>
                            ))
                        ) : (
                             <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                                    <Search className="w-12 h-12 mx-auto mb-2 text-gray-400"/>
                                    Aucune commande trouvée {statusFilter && `pour le statut: ${statusFilter}`}.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* TODO: Add pagination controls if API supports it fully and needed */}
        </div>
    );
};

export default AdminOrdersPage;
