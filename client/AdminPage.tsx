import React, { useState, useEffect } from 'react';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { useNavigate } from 'react-router-dom';

export const AdminPage: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/admin/check-auth');
                const data = await response.json();
                if (data.authenticated) {
                    setIsAuthenticated(true);
                    navigate('/admin/dashboard');
                } else {
                    setIsAuthenticated(false);
                }
            } catch (err) {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-cyber-black flex items-center justify-center text-cyber-neonBlue font-orbitron">
                <div className="animate-spin mr-3">/</div> INITIALIZING SECURITY PROTOCOLS...
            </div>
        );
    }

    // This component will primarily redirect, but acts as a guard.
    // The specific sub-routes should be handled by App.tsx router logic, 
    // OR we can just render components here based on state if we want a simpler structure.
    // Given the request, separate routes are cleaner.

    // Actually, simpler logic:
    // /admin -> AdminLogin
    // /admin/dashboard -> AdminDashboard (protected)

    // So this component might just be a layout wrapper or not needed if we do it in App.tsx
    // Let's stick to App.tsx handling the routes directly for clarity.
    // I'll leave this file as a simple placeholder ref or delete it if unused.

    // Improved plan: Use this as the main entry for /admin to decide what to show?
    // No, standard react-router pattern is better.
    // I will use this as a layout wrapper if needed, but for now, I'll return the Login component by default
    // or Redirect.

    return <AdminLogin />;
};
