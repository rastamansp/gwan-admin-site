import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import { UserSession, UpdateProfileData } from '../types/auth.types';

export function useAuth() {
    const [user, setUser] = useState<UserSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const authService = AuthService.getInstance();

    useEffect(() => {
        const initializeAuth = () => {
            const session = authService.getUserSession();
            if (session) {
                setUser(session);
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, [authService]);

    const login = useCallback(async (email: string, code?: string) => {
        try {
            if (code) {
                const session = await authService.verifyLogin(email, code);
                setUser(session);
            } else {
                await authService.login(email);
            }
        } catch (error) {
            throw error;
        }
    }, [authService]);

    const logout = useCallback(() => {
        authService.logout();
        setUser(null);
        navigate('/auth/login');
    }, [authService, navigate]);

    const updateProfile = useCallback(async (data: UpdateProfileData) => {
        try {
            const updatedUser = await authService.updateProfile(data);
            setUser(updatedUser);
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }, [authService]);

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile
    };
} 