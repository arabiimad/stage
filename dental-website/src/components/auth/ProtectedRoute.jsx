import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Adjust path as necessary
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

const ProtectedRoute = ({ children, role }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // You can render a more sophisticated loading spinner here
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <Skeleton className="h-12 w-12 rounded-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-32 w-full max-w-md" />
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If a specific role is required and the user doesn't have it
    if (role && user?.role !== role) {
        // Redirect to a 'Forbidden' page or home page
        // For now, redirecting to home. A dedicated /forbidden page would be better.
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
