import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useLocation } from 'react-router-dom'; // Added useLocation
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const LoginPage = () => {
    const { register: formRegister, handleSubmit, formState: { errors } } = useForm();
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // For redirecting to previous page

    const onSubmit = async (data) => {
        try {
            const responseData = await login(data.email, data.password); // login now returns response.data
            toast.success(responseData.msg || 'Connexion réussie! Redirection...');

            const userRole = responseData.user?.role;

            if (userRole === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                // For clients, redirect to intended page or /boutique as default
                const from = location.state?.from?.pathname || '/boutique';
                navigate(from, { replace: true });
            }
        } catch (error) {
            let friendlyErrorMessage = 'La connexion a échoué. Veuillez vérifier vos identifiants et réessayer.';
            // Backend error messages are now in error.response.data.error
            if (error.response && error.response.data && error.response.data.error) {
              friendlyErrorMessage = error.response.data.error;
            } else if (error.message && !error.response) { // Network errors or other issues
              friendlyErrorMessage = `Échec de la connexion: ${error.message}`;
            }
            toast.error(friendlyErrorMessage);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
                    <CardDescription className="text-center">
                        Accédez à votre compte DentalTech Pro.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* {apiError && <p className="text-red-500 text-sm text-center">{apiError}</p>} Removed */}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="votreadresse@email.com"
                                {...formRegister('email', {
                                    required: 'Email requis',
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: 'Adresse email invalide'
                                    }
                                })}
                            />
                            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Votre mot de passe"
                                {...formRegister('password', { required: 'Mot de passe requis' })}
                            />
                            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Connexion en cours...' : 'Se connecter'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="text-center text-sm">
                    <p>Pas encore de compte? <Link to="/register" className="text-primary hover:underline">Inscrivez-vous ici</Link></p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;
