import { User, UserSession, UpdateProfileData } from '../types/auth.types';
import { IAuthService } from './interfaces/auth.service.interface';
import { HttpService } from './http.service';
import { SessionService } from './session.service';
import { AuthError } from '../types/errors';

export class AuthService implements IAuthService {
    private static instance: AuthService;
    private readonly httpService: HttpService;
    private readonly sessionService: SessionService;

    private constructor() {
        this.httpService = HttpService.getInstance();
        this.sessionService = SessionService.getInstance();
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    private getAuthHeaders(): Record<string, string> {
        const token = this.sessionService.getToken();
        if (!token) {
            throw new AuthError('No authentication token available');
        }
        return { Authorization: `Bearer ${token}` };
    }

    public async login(email: string): Promise<void> {
        try {
            await this.httpService.post('/auth/login', { email });
        } catch (error) {
            throw new AuthError('Failed to initiate login', error);
        }
    }

    public async verifyLogin(email: string, code: string): Promise<UserSession> {
        try {
            const response = await this.httpService.post<UserSession>('/auth/verify-login-code', {
                email,
                code
            });

            const session = response.data;
            this.sessionService.setSession(session);
            return session;
        } catch (error) {
            throw new AuthError('Failed to verify login', error);
        }
    }

    public async logout(): Promise<void> {
        try {
            const token = this.sessionService.getToken();
            if (token) {
                await this.httpService.post('/auth/logout', null, {
                    headers: this.getAuthHeaders()
                });
            }
        } catch (error) {
            console.error('Logout request failed:', error);
        } finally {
            this.sessionService.clearSession();
        }
    }

    public async getUserProfile(): Promise<User> {
        try {
            const response = await this.httpService.get<User>('/auth/profile', {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw new AuthError('Failed to get user profile', error);
        }
    }

    public async updateProfile(data: UpdateProfileData): Promise<UserSession> {
        try {
            const response = await this.httpService.put<UserSession>('/auth/profile', data, {
                headers: this.getAuthHeaders()
            });

            const updatedSession = response.data;
            this.sessionService.setSession(updatedSession);
            return updatedSession;
        } catch (error) {
            throw new AuthError('Failed to update profile', error);
        }
    }
}

export default AuthService;