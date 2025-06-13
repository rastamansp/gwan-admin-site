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
        console.log('Initializing session from storage');
        const storedToken = localStorage.getItem(SessionService.TOKEN_KEY);
        const storedSession = localStorage.getItem(SessionService.SESSION_KEY);

        if (storedToken) {
            console.log('Found stored token:', storedToken.substring(0, 10) + '...');
            this.token = storedToken;
        } else {
            console.log('No stored token found');
        }

        if (storedSession) {
            try {
                this.userSession = JSON.parse(storedSession);
                if (this.userSession?.email) {
                    console.log('Found stored session for user:', this.userSession.email);
                } else {
                    console.log('Found stored session but no email present');
                }
            } catch (error) {
                console.error('Failed to parse stored session:', error);
                this.clearSession();
            }
        } else {
            console.log('No stored session found');
        }
    }

    public getSession(): UserSession | null {
        return this.userSession;
    }

    public setSession(session: UserSession): void {
        console.log('Setting new session for user:', session.email);
        if (!session.token) {
            console.error('Attempting to set session without token');
            throw new Error('Session must include a token');
        }
        this.userSession = session;
        this.token = session.token;
        localStorage.setItem(SessionService.TOKEN_KEY, session.token);
        localStorage.setItem(SessionService.SESSION_KEY, JSON.stringify(session));
        console.log('Session and token stored in localStorage');
    }

    public clearSession(): void {
        console.log('Starting session cleanup...');
        // Verify localStorage before clearing
        const tokenBefore = localStorage.getItem(SessionService.TOKEN_KEY);
        const sessionBefore = localStorage.getItem(SessionService.SESSION_KEY);
        console.log('Before cleanup - Token exists:', !!tokenBefore, 'Session exists:', !!sessionBefore);

        this.token = null;
        this.userSession = null;
        localStorage.removeItem(SessionService.TOKEN_KEY);
        localStorage.removeItem(SessionService.SESSION_KEY);

        // Verify localStorage after clearing
        const tokenAfter = localStorage.getItem(SessionService.TOKEN_KEY);
        const sessionAfter = localStorage.getItem(SessionService.SESSION_KEY);
        console.log('After cleanup - Token exists:', !!tokenAfter, 'Session exists:', !!sessionAfter);
        console.log('Session and token removed from localStorage');
    }

    public getToken(): string | null {
        if (!this.token) {
            console.log('No token available in session service');
        } else {
            console.log('Retrieved token:', this.token.substring(0, 10) + '...');
        }
        return this.token;
    }

    public isAuthenticated(): boolean {
        const isAuth = !!this.token && !!this.userSession;
        console.log('Checking authentication:', isAuth ? 'authenticated' : 'not authenticated');
        return isAuth;
    }
} 