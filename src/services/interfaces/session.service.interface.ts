import { UserSession } from '../../modules/auth/types/auth.types';

export interface ISessionService {
    getSession(): UserSession | null;
    setSession(session: UserSession): void;
    clearSession(): void;
    getToken(): string | null;
    isAuthenticated(): boolean;
} 