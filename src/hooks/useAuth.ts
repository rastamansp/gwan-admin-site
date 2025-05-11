import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session.service';
import { UserSession, UpdateProfileData } from '../types/auth.types';
import { AuthError } from '../types/errors';

export function useAuth() {
    const [user, setUser] = useState<UserSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const navigate = useNavigate();

    const authService = AuthService.getInstance();
    const sessionService = SessionService.getInstance();

    useEffect(() => {
        const initializeAuth = () => {
            try {
                const session = sessionService.getSession();
                if (session) {
                    setUser(session);
                }
            } catch (err) {
                setError(err instanceof Error ? err : new AuthError('Failed to initialize auth'));
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, [sessionService]);

    const login = useCallback(async (email: string, code?: string) => {
        try {
            setError(null);
            if (code) {
                const session = await authService.verifyLogin(email, code);
                setUser(session);
            } else {
                await authService.login(email);
            }
        } catch (err) {
            const error = err instanceof Error ? err : new AuthError('Login failed');
            setError(error);
            throw error;
        }
    }, [authService]);

    const logout = useCallback(async () => {
        try {
            setError(null);
            await authService.logout();
            setUser(null);
            navigate('/auth/login');
        } catch (err) {
            const error = err instanceof Error ? err : new AuthError('Logout failed');
            setError(error);
            throw error;
        }
    }, [authService, navigate]);

    const updateProfile = useCallback(async (data: UpdateProfileData) => {
        try {
            setError(null);
            const updatedUser = await authService.updateProfile(data);
            setUser(updatedUser);
            return updatedUser;
        } catch (err) {
            const error = err instanceof Error ? err : new AuthError('Profile update failed');
            setError(error);
            throw error;
        }
    }, [authService]);

    return {
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile
    };
} 