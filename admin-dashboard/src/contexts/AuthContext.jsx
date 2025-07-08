import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { fetchDataFromApi, postDataToApi } from '../utils/apiCalls';
import { useAppContext } from '../contexts/AppContext'; 
import { getRolePermissions } from '../utils/permissions';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // const [loading, setIsLoading] = useState(true);
    const [permissions, setPermissions] = useState([]);
    const navigate = useNavigate();

    const {showNotification, isLoading, setIsLoading} = useAppContext()

    // Initialize auth state
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const userData = await fetchDataFromApi('/api/v1/auth/me');
                console.log("----",userData)
                const userPermission = getRolePermissions(userData.role);
                setUser(userData.user);
                setPermissions(userData.permissions || []);
            } catch (error) {
                console.error('Auth initialization error:', error);
                logout();
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Login function
    const login = async (credentials) => {
        try {
            const data = await postDataToApi("/api/v1/auth/login", credentials);
            setUser(data.user);
            showNotification('Login successful! Redirecting...', 'success');
            const userPermissions = getRolePermissions(data.user.role)
            setPermissions(userPermissions);

            if (data.user.role === 'seller') {
                navigate("/seller/dashboard")
            } else if (data.user.role === 'buyer') {
                navigate("/dashboard")
            }else{
                navigate("/admin/dashboard")
            }
        } catch (error) {
            showNotification('Invalid email or password', 'error');
            setIsLoading(false)
            throw error.response?.data || error;
        }
    };

    // Logout function
    const logout = async () => {
        try {
            const response = await fetchDataFromApi('/api/v1/auth/logout');
            
            if (response.success){ 
                navigate('/login'); 
            }

        } catch (error) {
            console.error('Logout Error:', error);
        }
    };

    // Check permission
    const hasPermission = (permission) => {
        if (!user) return false;
        if (user.role === 'super_admin') return true;
        return permissions.includes(permission);
    };

    // Check any of multiple permissions
    const hasAnyPermission = (perms) => {
        return perms.some(p => hasPermission(p));
    };

    // Check all permissions
    const hasAllPermissions = (perms) => {
        return perms.every(p => hasPermission(p));
    };

    // Check role
    const hasRole = (role) => {
        return user?.role === role;
    };

    // Check any of multiple roles
    const hasAnyRole = (roles) => {
        return roles.some(r => hasRole(r));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isLoading,
                permissions,
                login,
                logout,
                hasPermission,
                hasAnyPermission,
                hasAllPermissions,
                hasRole,
                hasAnyRole
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);