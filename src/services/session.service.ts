import { UserSession } from '../modules/auth/types/auth.types';
import { ISessionService } from './interfaces/session.service.interface';

export class SessionService implements ISessionService {
    private static instance: SessionService;
    private static readonly TOKEN_KEY = 'token';
    private static readonly SESSION_KEY = 'userSession';
    private token: string | null = null;
    private userSession: UserSession | null = null;

    private constructor() {
        this.initializeFromStorage();
    }

    public static getInstance(): SessionService {
        if (!SessionService.instance) {
            SessionService.instance = new SessionService();
        }
        return SessionService.instance;
    }

    private initializeFromStorage(): void {
        const storedToken = localStorage.getItem(SessionService.TOKEN_KEY);
        const storedSession = localStorage.getItem(SessionService.SESSION_KEY);

        if (storedToken) {
            this.token = storedToken;
        }

        if (storedSession) {
            try {
                this.userSession = JSON.parse(storedSession);
            } catch (error) {
                console.error('Failed to parse stored session:', error);
                this.clearSession();
            }
        }
    }

    public getSession(): UserSession | null {
        return this.userSession;
    }

    public setSession(session: UserSession): void {
        if (!session.token) {
            console.error('Attempting to set session without token');
            throw new Error('Session must include a token');
        }
        this.userSession = session;
        this.token = session.token;
        localStorage.setItem(SessionService.TOKEN_KEY, session.token);
        localStorage.setItem(SessionService.SESSION_KEY, JSON.stringify(session));
    }

    public clearSession(): void {
        this.token = null;
        this.userSession = null;
        localStorage.removeItem(SessionService.TOKEN_KEY);
        localStorage.removeItem(SessionService.SESSION_KEY);
    }

    public getToken(): string | null {
        return this.token;
    }

    public isAuthenticated(): boolean {
        return !!this.token && !!this.userSession;
    }
} 