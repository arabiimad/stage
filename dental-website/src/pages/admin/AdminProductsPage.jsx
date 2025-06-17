import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Assuming axios is configured via AuthContext or globally
import { useAuth } from '../../context/AuthContext'; // To get token for API calls
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, RefreshCw, AlertTriangle, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Zod schema for product validation
const productSchema = z.object({
    name: z.string().min(3, "Le nom doit contenir au moins 3 caractères."),
    description: z.string().optional(),
    short_description: z.string().optional(),
    price: z.preprocess(
        (val) => parseFloat(String(val)),
        z.number().positive("Le prix doit être un nombre positif.")
    ),
    stock_quantity: z.preprocess(
        (val) => parseInt(String(val), 10),
        z.number().int().min(0, "Le stock ne peut être négatif.")
    ),
    category: z.string().min(1, "La catégorie est requise."),
    image_url: z.string().url("URL d'image invalide.").or(z.literal('')).optional(),
    is_active: z.boolean().default(true),
    original_price: z.preprocess(
        (val) => val ? parseFloat(String(val)) : undefined,
        z.number().positive("Le prix original doit être positif.").optional().nullable()
    ),
    badge: z.string().optional(),
    // specifications: z.record(z.any()).optional(), // For JSON fields, more complex validation might be needed
    // features: z.array(z.string()).optional(),
});

// Helper for price formatting
const formatPrice = (price) => {
    if (price === null || price === undefined) return 'N/A';
    return price.toLocaleString('fr-FR', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' MAD';
};

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); // null for new, product object for editing

    const { token } = useAuth(); // Get token for authenticated API requests

    const defaultValues = {
        name: '',
        description: '',
        short_description: '',
        price: 0,
        stock_quantity: 0,
        category: '',
        image_url: '',
        is_active: true,
        original_price: null,
        badge: '',
    };

    const { control, register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: defaultValues
    });

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/admin/products', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(response.data.products || []); // Ensure it's an array
        } catch (err) {
            console.error("Failed to fetch products:", err);
            setError(err.response?.data?.msg || "Erreur lors du chargement des produits.");
            toast.error(err.response?.data?.msg || "Erreur chargement produits.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) { // Only fetch if token is available
            fetchProducts();
        }
    }, [fetchProducts, token]);

    const handleModalOpen = (product = null) => {
        setEditingProduct(product);
        if (product) {
            reset({ ...product, price: product.price || 0, stock_quantity: product.stock_quantity || 0 });
        } else {
            reset(defaultValues);
        }
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        reset(defaultValues);
    };

    const onSubmit = async (data) => {
        const apiPath = editingProduct
            ? `/admin/products/${editingProduct.id}`
            : '/admin/products';
        const method = editingProduct ? 'PUT' : 'POST';

        // Ensure numeric fields are numbers, not strings
        data.price = parseFloat(data.price);
        data.stock_quantity = parseInt(data.stock_quantity, 10);
        if (data.original_price) {
            data.original_price = parseFloat(data.original_price);
        }


        try {
            const response = await axios({
                method: method,
                url: apiPath,
                data: data,
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Produit ${editingProduct ? 'mis à jour' : 'créé'} avec succès!`);
            fetchProducts(); // Refresh list
            handleModalClose();
        } catch (err) {
            console.error("Failed to save product:", err.response?.data || err.message);
            toast.error(err.response?.data?.msg || "Échec de l'enregistrement du produit.");
        }
    };

    const handleToggleActive = async (product) => {
        const updatedProduct = { ...product, is_active: !product.is_active };
        try {
            await axios.put(`/admin/products/${product.id}`, { is_active: updatedProduct.is_active }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Statut du produit '${product.name}' mis à jour.`);
            fetchProducts();
        } catch (err) {
            toast.error("Échec de la mise à jour du statut.");
        }
    };

    // Soft delete (using the is_active toggle logic)
    const handleDeleteProduct = async (productId, productName) => {
         if (!window.confirm(`Êtes-vous sûr de vouloir désactiver le produit "${productName}"? Cette action est réversible.`)) {
            return;
        }
        try {
            // Backend DELETE endpoint performs soft delete by setting is_active = false
            await axios.delete(`/admin/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Produit '${productName}' désactivé.`);
            fetchProducts();
        } catch (err) {
            toast.error("Échec de la désactivation du produit.");
        }
    };


    if (loading && !products.length) { // Show full page loader only on initial load
        return <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
    }

    if (error && !products.length) { // Show full page error only if no products could be loaded initially
        return (
            <div className="text-center py-10 bg-red-50 p-6 rounded-lg shadow">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-700 mb-2">Erreur de chargement</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchProducts}><RefreshCw className="w-4 h-4 mr-2"/> Réessayer</Button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gérer les Produits</h1>
                <Button onClick={() => handleModalOpen()}>
                    <PlusCircle className="w-5 h-5 mr-2" /> Ajouter un Produit
                </Button>
            </div>

            {/* TODO: Add search/filter inputs here */}

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead>Catégorie</TableHead>
                            <TableHead>Prix</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Actif</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && products.length === 0 ? ( // Skeleton rows if loading new data
                            [...Array(5)].map((_, i) => (
                                <TableRow key={`skeleton-${i}`}>
                                    <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Skeleton className="h-8 w-8 inline-block" />
                                        <Skeleton className="h-8 w-8 inline-block" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : products.length > 0 ? (
                            products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.id}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>{formatPrice(product.price)}</TableCell>
                                    <TableCell>{product.stock_quantity}</TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={product.is_active}
                                            onCheckedChange={() => handleToggleActive(product)}
                                        />
                                    </TableCell>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleModalOpen(product)}>
                                            <Edit className="w-4 h-4 text-blue-600" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id, product.name)}>
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </Button>
                                    </td>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                                    <Search className="w-12 h-12 mx-auto mb-2 text-gray-400"/>
                                    Aucun produit trouvé.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}</DialogTitle>
                        <DialogDescription>
                            {editingProduct ? "Mettez à jour les informations du produit." : "Remplissez les détails du nouveau produit."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Nom du produit</Label>
                                <Input id="name" {...register('name')} placeholder="Ex: Unit Dentaire X5000" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="category">Catégorie</Label>
                                <Input id="category" {...register('category')} placeholder="Ex: Équipements" />
                                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="short_description">Description courte</Label>
                            <Textarea id="short_description" {...register('short_description')} placeholder="Brève description pour la liste des produits..." />
                            {errors.short_description && <p className="text-red-500 text-xs mt-1">{errors.short_description.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="description">Description complète</Label>
                            <Textarea id="description" {...register('description')} placeholder="Description détaillée du produit..." rows={4}/>
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="price">Prix (MAD)</Label>
                                <Input id="price" type="number" step="0.01" {...register('price')} />
                                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="original_price">Prix Original (MAD) (Optionnel)</Label>
                                <Input id="original_price" type="number" step="0.01" {...register('original_price')} />
                                {errors.original_price && <p className="text-red-500 text-xs mt-1">{errors.original_price.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="stock_quantity">Quantité en stock</Label>
                                <Input id="stock_quantity" type="number" {...register('stock_quantity')} />
                                {errors.stock_quantity && <p className="text-red-500 text-xs mt-1">{errors.stock_quantity.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="image_url">URL de l'image principale</Label>
                                <Input id="image_url" {...register('image_url')} placeholder="https://example.com/image.jpg"/>
                                {errors.image_url && <p className="text-red-500 text-xs mt-1">{errors.image_url.message}</p>}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="badge">Badge (Optionnel)</Label>
                            <Input id="badge" {...register('badge')} placeholder="Ex: Nouveau, Promotion" />
                            {errors.badge && <p className="text-red-500 text-xs mt-1">{errors.badge.message}</p>}
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                             <Controller
                                name="is_active"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        id="is_active"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                            <Label htmlFor="is_active" className="font-normal">Produit actif (visible en boutique)</Label>
                            {errors.is_active && <p className="text-red-500 text-xs mt-1">{errors.is_active.message}</p>}
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={handleModalClose}>Annuler</Button>
                            <Button type="submit">
                                {editingProduct ? 'Sauvegarder les modifications' : 'Créer le produit'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminProductsPage;
