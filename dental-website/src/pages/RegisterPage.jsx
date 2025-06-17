import React, { useState } from 'react'; // Keep useState for registrationSuccess
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner'; // Import toast
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const RegisterPage = () => {
    const { register: formRegister, handleSubmit, formState: { errors }, watch } = useForm();
    const { register: authRegister, loading } = useAuth();
    const navigate = useNavigate();
    // const [apiError, setApiError] = useState(''); // Removed apiError state
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    // Watch password for confirmation
    const password = watch('password');

    const onSubmit = async (data) => {
        // setApiError(''); // No longer needed
        setRegistrationSuccess(false); // Reset success state on new submission
        try {
            const response = await authRegister(data.username, data.email, data.password);
            // Assuming backend returns a success message or user details
            toast.success(response?.data?.msg || 'Inscription réussie! Vous pouvez maintenant vous connecter.');
            setRegistrationSuccess(true);

            // Keep the redirect to login page after a delay
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            let friendlyErrorMessage = "L'inscription a échoué. Veuillez réessayer.";
            // Backend error messages are usually in error.response.data.msg or error.response.data.message
            if (error.response && error.response.data && (error.response.data.msg || error.response.data.message)) {
              friendlyErrorMessage = error.response.data.msg || error.response.data.message;
            } else if (error.message && !error.response) { // Network errors or other issues
              friendlyErrorMessage = `Échec de l'inscription: ${error.message}`;
            }
            toast.error(friendlyErrorMessage);
            // setApiError(friendlyErrorMessage); // No longer needed
        }
    };

    if (registrationSuccess) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12 px-4">
                <Card className="w-full max-w-md p-6 text-center">
                    <CardTitle className="text-2xl font-bold text-green-600">Inscription Réussie!</CardTitle>
                    <CardDescription className="mt-2">
                        Votre compte a été créé avec succès. Vous allez être redirigé vers la page de connexion dans quelques secondes.
                    </CardDescription>
                    <Button onClick={() => navigate('/login')} className="mt-4">
                        Aller à la Connexion Maintenant
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Créer un Compte</CardTitle>
                    <CardDescription className="text-center">
                        Rejoignez DentalTech Pro aujourd'hui.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* {apiError && <p className="text-red-500 text-sm text-center">{apiError}</p>} Removed */}

                        <div className="space-y-2">
                            <Label htmlFor="username">Nom d'utilisateur</Label>
                            <Input
                                id="username"
                                placeholder="Votre nom d'utilisateur"
                                {...formRegister('username', { required: "Nom d'utilisateur requis" })}
                            />
                            {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
                        </div>

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
                                placeholder="Créez un mot de passe"
                                {...formRegister('password', {
                                    required: 'Mot de passe requis',
                                    minLength: { value: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' }
                                })}
                            />
                            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirmez votre mot de passe"
                                {...formRegister('confirmPassword', {
                                    required: 'Confirmation du mot de passe requise',
                                    validate: value =>
                                        value === password || 'Les mots de passe ne correspondent pas'
                                })}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Création en cours...' : "S'inscrire"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="text-center text-sm">
                    <p>Déjà un compte? <Link to="/login" className="text-primary hover:underline">Connectez-vous ici</Link></p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default RegisterPage;
