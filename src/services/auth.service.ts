import axios from 'axios';
import env from '../config/env';

interface User {
    id: string;
    name: string;
    email: string;
    whatsapp?: string;
    createdAt: string;
    updatedAt: string;
}

interface UpdateProfileData {
    name: string;
    whatsapp?: string;
}

interface UserSession {
    id: string;
    name: string;
    email: string;
    token: string;
}

class AuthService {
    private static instance: AuthService;
    private userSession: UserSession | null = null;
    private token: string | null = null;

    private constructor() {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                this.userSession = JSON.parse(storedUser);
            } catch (error) {
                console.error('Error parsing stored user:', error);
            }
        }
        this.token = localStorage.getItem('token');
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    public getUserSession(): UserSession | null {
        return this.userSession;
    }

    public setUserSession(user: UserSession): void {
        this.userSession = user;
        this.token = user.token;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', user.token);
    }

    public async login(email: string, password: string): Promise<{ token: string; user: User }> {
        const response = await axios.post(`${env.API_URL}/auth/login`, { email, password });
        const { token, user } = response.data;
        this.token = token;
        localStorage.setItem('token', token);
        this.setUserSession({
            id: user.id,
            name: user.name,
            email: user.email,
            token
        });
        return { token, user };
    }

    public async getUserProfile(): Promise<User> {
        if (!this.token) {
            throw new Error('No token found');
        }

        const response = await axios.get(`${env.API_URL}/user/profile`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });

        return response.data;
    }

    public async updateUserProfile(data: UpdateProfileData): Promise<User> {
        if (!this.token) {
            throw new Error('No token found');
        }

        const response = await axios.patch(`${env.API_URL}/user/profile`, data, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });

        return response.data;
    }

    public logout(): void {
        this.token = null;
        this.userSession = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    public getToken(): string | null {
        return this.token;
    }

    public isAuthenticated(): boolean {
        return !!this.token;
    }
}

export default AuthService; 