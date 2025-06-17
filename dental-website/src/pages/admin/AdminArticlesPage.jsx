import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // For content
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit3, Trash2, RefreshCw, AlertTriangle, Loader2, Search, Image as ImageIcon, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Zod schema for article validation
const articleSchema = z.object({
    title: z.string().min(3, "Le titre doit contenir au moins 3 caractères."),
    slug: z.string().min(3, "Le slug doit contenir au moins 3 caractères.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalide (lettres minuscules, chiffres, tirets)."),
    content: z.string().min(10, "Le contenu doit contenir au moins 10 caractères."),
    author: z.string().optional(),
    category: z.string().optional(),
    image_url: z.string().optional(), // For displaying existing image URL
    // 'image' field for file upload is handled separately by FormData
});

// Helper function to generate a slug
const generateSlug = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';


const AdminArticlesPage = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const { token } = useAuth();

    const defaultValues = {
        title: '', slug: '', content: '', author: '', category: '', image_url: ''
    };

    const { control, register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(articleSchema),
        defaultValues: defaultValues
    });

    // Watch title to auto-generate slug
    const watchedTitle = watch("title");
    useEffect(() => {
        if (!editingArticle || !watch('slug')) { // Only auto-slug for new articles or if slug is empty
            setValue("slug", generateSlug(watchedTitle), { shouldValidate: true });
        }
    }, [watchedTitle, setValue, editingArticle, watch]);


    const fetchArticles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/admin/articles', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setArticles(response.data.articles || []);
        } catch (err) {
            console.error("Failed to fetch articles:", err);
            setError(err.response?.data?.msg || "Erreur lors du chargement des articles.");
            toast.error(err.response?.data?.msg || "Erreur chargement articles.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) fetchArticles();
    }, [fetchArticles, token]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setSelectedFile(null);
            setPreviewImage(editingArticle?.image_url || null); // Revert to existing or null
        }
    };

    const handleModalOpen = (article = null) => {
        setEditingArticle(article);
        setSelectedFile(null);
        if (article) {
            reset({ ...article });
            setPreviewImage(article.image_url ? `${API_BASE_URL.replace('/api', '')}${article.image_url}` : null);
        } else {
            reset(defaultValues);
            setPreviewImage(null);
        }
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingArticle(null);
        reset(defaultValues);
        setSelectedFile(null);
        setPreviewImage(null);
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) { // Ensure not to append null/undefined
                 formData.append(key, data[key]);
            }
        });

        if (selectedFile) {
            formData.append('image', selectedFile);
        } else if (data.image_url === '' && editingArticle?.image_url) {
            // If image_url field is cleared and there was an existing image, signal removal (backend handles this)
            // This might need specific handling if backend expects an explicit "remove_image" flag
            formData.append('image_url', ''); // Send empty image_url to indicate removal
        }


        const apiPath = editingArticle
            ? `/admin/articles/${editingArticle.id}`
            : '/admin/articles';
        const method = editingArticle ? 'PUT' : 'POST';

        try {
            await axios({
                method: method,
                url: apiPath,
                data: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success(`Article ${editingArticle ? 'mis à jour' : 'créé'} avec succès!`);
            fetchArticles();
            handleModalClose();
        } catch (err) {
            console.error("Failed to save article:", err.response?.data || err.message);
            toast.error(err.response?.data?.msg || "Échec de l'enregistrement de l'article.");
        }
    };

    const handleDeleteArticle = async (articleId, articleTitle) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'article "${articleTitle}"? Cette action est irréversible.`)) {
            return;
        }
        try {
            await axios.delete(`/admin/articles/${articleId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Article '${articleTitle}' supprimé.`);
            fetchArticles();
        } catch (err) {
            toast.error(err.response?.data?.msg || "Échec de la suppression de l'article.");
        }
    };

    if (loading && !articles.length) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gérer les Articles</h1>
                <Button onClick={() => handleModalOpen()}>
                    <PlusCircle className="w-5 h-5 mr-2" /> Nouvel Article
                </Button>
            </div>

            {error && (
                 <div className="my-4 text-center py-6 bg-red-50 p-4 rounded-lg shadow border border-red-200">
                    <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-red-600 mb-1">Erreur de chargement</h3>
                    <p className="text-red-500 mb-3 text-sm">{error}</p>
                    <Button onClick={fetchArticles} variant="destructive" size="sm"><RefreshCw className="w-4 h-4 mr-2"/> Réessayer</Button>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">ID</TableHead>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Titre</TableHead>
                            <TableHead>Auteur</TableHead>
                            <TableHead>Catégorie</TableHead>
                            <TableHead>Date Création</TableHead>
                            <TableHead className="text-right w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && articles.length === 0 ? (
                             [...Array(3)].map((_, i) => (
                                <TableRow key={`skel-art-${i}`}>
                                    <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                                    <TableCell><Skeleton className="h-12 w-12 rounded" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Skeleton className="h-8 w-8 inline-block" /> <Skeleton className="h-8 w-8 inline-block" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : articles.length > 0 ? (
                            articles.map((article) => (
                                <TableRow key={article.id}>
                                    <TableCell className="font-medium">{article.id}</TableCell>
                                    <TableCell>
                                        {article.image_url ? (
                                            <img
                                                src={`${API_BASE_URL.replace('/api', '')}${article.image_url}`}
                                                alt={article.title}
                                                className="w-12 h-12 object-cover rounded-md border"
                                                onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                                            />
                                        ) : null}
                                        <div className={`w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 ${article.image_url ? 'hidden' : 'flex'}`}>
                                            <ImageIcon size={24} />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium max-w-xs truncate" title={article.title}>{article.title}</TableCell>
                                    <TableCell>{article.author || '-'}</TableCell>
                                    <TableCell>{article.category || '-'}</TableCell>
                                    <TableCell>{format(new Date(article.created_at), 'dd MMM yyyy', { locale: fr })}</TableCell>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleModalOpen(article)} title="Modifier">
                                            <Edit3 className="w-4 h-4 text-blue-600" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteArticle(article.id, article.title)} title="Supprimer">
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </Button>
                                    </td>
                                </TableRow>
                            ))
                        ) : (
                             <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                                    <Search className="w-12 h-12 mx-auto mb-2 text-gray-400"/>
                                    Aucun article trouvé.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isModalOpen} onOpenChange={(isOpen) => { if (!isOpen) handleModalClose(); else setIsModalOpen(true);}}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingArticle ? "Modifier l'Article" : "Créer un Nouvel Article"}</DialogTitle>
                        <DialogDescription>
                            {editingArticle ? "Mettez à jour les informations de l'article." : "Remplissez les détails du nouvel article."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2 pr-2"> {/* Added pr-2 for scrollbar space */}
                        <div>
                            <Label htmlFor="title">Titre</Label>
                            <Input id="title" {...register('title')} placeholder="Titre de l'article" />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" {...register('slug')} placeholder="titre-de-l-article (auto-généré si vide)" />
                            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="author">Auteur</Label>
                                <Input id="author" {...register('author')} placeholder="Nom de l'auteur" />
                                {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="category">Catégorie</Label>
                                <Input id="category" {...register('category')} placeholder="Ex: Technologie, Conseils" />
                                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="content">Contenu</Label>
                            <Textarea id="content" {...register('content')} placeholder="Contenu de l'article..." rows={8} />
                            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="image">Image de couverture</Label>
                            <Input id="image" type="file" onChange={handleFileChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                            {previewImage && (
                                <div className="mt-4 relative group w-48 h-32">
                                    <img src={previewImage} alt="Aperçu" className="w-full h-full object-cover rounded-md border" />
                                    <Button type="button" variant="destructive" size="icon"
                                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => { setSelectedFile(null); setPreviewImage(null); setValue("image_url", ""); }}>
                                        <Trash2 className="h-3 w-3"/>
                                    </Button>
                                </div>
                            )}
                             {/* Hidden input to manage existing image_url if needed, or handle logic on submit */}
                            <input type="hidden" {...register('image_url')} />
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={handleModalClose}>Annuler</Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : null}
                                {editingArticle ? 'Sauvegarder' : 'Créer'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminArticlesPage;
