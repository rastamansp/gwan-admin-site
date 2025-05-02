import axios from 'axios';
import { User, UserSession, UpdateProfileData } from '../types/auth.types';
import { IAuthService } from './interfaces/auth.service.interface';

const API_URL = 'http://localhost:3000/api';

class AuthService implements IAuthService {
    private static instance: AuthService;
    private token: string | null = null;
    private userSession: UserSession | null = null;

    private constructor() {
        this.initializeFromStorage();
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    private initializeFromStorage(): void {
        const storedToken = localStorage.getItem('token');
        const storedSession = localStorage.getItem('userSession');

        if (storedToken) {
            this.token = storedToken;
        }

        if (storedSession) {
            this.userSession = JSON.parse(storedSession);
        }
    }

    public async login(email: string): Promise<void> {
        const response = await axios.post(`${API_URL}/auth/login`, { email });
        return response.data;
    }

    public async verifyLogin(email: string, code: string): Promise<UserSession> {
        const response = await axios.post(`${API_URL}/auth/verify-login`, {
            email,
            code
        });

        const { user, token } = response.data;
        this.setUserSession({
            id: user._id,
            name: user.name,
            email: user.email,
            whatsapp: user.whatsapp,
            token
        });

        return this.userSession!;
    }

    public async getUserProfile(): Promise<User> {
        if (!this.token) {
            throw new Error('No token available');
        }

        const response = await axios.get(`${API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${this.token}` }
        });

        return response.data;
    }

    public async updateProfile(data: UpdateProfileData): Promise<UserSession> {
        if (!this.token) {
            throw new Error('No token available');
        }

        const response = await axios.put(
            `${API_URL}/auth/profile`,
            data,
            {
                headers: { Authorization: `Bearer ${this.token}` }
            }
        );

        const updatedUser = response.data;
        if (this.userSession) {
            this.setUserSession({
                ...this.userSession,
                name: updatedUser.name,
                whatsapp: updatedUser.whatsapp
            });
        }

        return this.userSession!;
    }

    public logout(): void {
        this.token = null;
        this.userSession = null;
        localStorage.removeItem('token');
        localStorage.removeItem('userSession');
    }

    public setUserSession(session: UserSession): void {
        this.userSession = session;
        this.token = session.token;
        localStorage.setItem('token', session.token);
        localStorage.setItem('userSession', JSON.stringify(session));
    }

    public getUserSession(): UserSession | null {
        return this.userSession;
    }

    public getToken(): string | null {
        return this.token;
    }

    public isAuthenticated(): boolean {
        return !!this.token && !!this.userSession;
    }
}

export default AuthService;