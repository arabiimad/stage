import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, ListOrdered, FileText, LogOut } from 'lucide-react'; // Icons for sidebar
import { useAuth } from '../../context/AuthContext'; // To add logout or user info in sidebar

const AdminLayout = () => {
    const location = useLocation();
    const { user, logout } = useAuth(); // Get user and logout function

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    const navLinks = [
        { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/admin/products', label: 'Produits', icon: ShoppingCart },
        { to: '/admin/orders', label: 'Commandes', icon: ListOrdered },
        { to: '/admin/articles', label: 'Articles', icon: FileText },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 text-slate-100 p-6 space-y-6 fixed h-full shadow-lg">
                <div className="text-center mb-8">
                    <Link to="/admin/dashboard" className="text-2xl font-semibold hover:text-slate-300 transition-colors">
                        Admin Panel
                    </Link>
                    {user && <p className="text-sm text-slate-400 mt-1">Connecté: {user.username}</p>}
                </div>
                <nav className="space-y-2">
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                                        ${isActive(link.to)
                                            ? 'bg-slate-700 text-white shadow-inner'
                                            : 'hover:bg-slate-700/50 hover:text-white'
                                        }`}
                        >
                            <link.icon className="w-5 h-5" />
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="pt-6 mt-auto border-t border-slate-700">
                     <button
                        onClick={logout}
                        className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-slate-300 hover:bg-red-600 hover:text-white transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <Outlet /> {/* Nested admin pages will render here */}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
