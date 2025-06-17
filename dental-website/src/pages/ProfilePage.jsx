import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button'; // For logout button
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

const ProfilePage = () => {
    const { user, isAuthenticated, loading, logout } = useAuth();
    const navigate = useNavigate(); // Though Navigate component is used for redirect

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md p-6">
                    <CardHeader className="items-center">
                        <Skeleton className="h-24 w-24 rounded-full mb-4" />
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-10 w-full mt-4" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = () => {
        logout();
        // Navigate to home or login page after logout.
        // AuthContext's logout might handle redirection or App.jsx might react to isAuthenticated change.
        // For explicit navigation here, ensure it doesn't conflict.
        // navigate('/'); // Example: redirect to home after logout
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <Card className="max-w-lg mx-auto">
                <CardHeader className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                        {/* Placeholder for user image if available */}
                        <AvatarImage src={user?.profileImageUrl} alt={user?.username} />
                        <AvatarFallback className="text-3xl">
                            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-3xl">{user?.username || 'Utilisateur'}</CardTitle>
                    <CardDescription>Voici les informations de votre profil.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold">Email:</h3>
                        <p className="text-gray-700">{user?.email}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Rôle:</h3>
                        <p className="text-gray-700 capitalize">{user?.role || 'Client'}</p>
                    </div>
                    {/* Add more profile information here as needed */}

                    <Button onClick={handleLogout} variant="outline" className="w-full mt-6">
                        Se déconnecter
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfilePage;
