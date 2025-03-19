// src/components/PrivateRoute.jsx
import React, {useContext, useEffect, useState} from 'react';
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/apiCalls';


const DashboardAuth = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetchDataFromApi('/api/auth/me');

                if (res.userId) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) return <p>Loading...</p>;

    if (!isAuthenticated) {
        window.location.href = "http://localhost:5173/login"; // Redirect only if necessary
        return null;
    }

    return children;
};

export default DashboardAuth;


