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
            console.error('No token available in session service');
            throw new AuthError('No authentication token available');
        }
        console.log('Using token for request:', token.substring(0, 10) + '...');
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
            console.log('Verifying login for email:', email);
            console.log('Making request to /auth/verify-login with code:', code);
            const response = await this.httpService.post<{ accessToken: string; user: User }>('/auth/verify-login', {
                email,
                code
            });

            console.log('API Response:', JSON.stringify(response.data, null, 2));

            if (!response.data || !response.data.accessToken || !response.data.user) {
                console.error('Invalid session response from API:', response.data);
                throw new AuthError('Invalid session response from API - missing required fields');
            }

            // Transform the API response into our UserSession format
            const session: UserSession = {
                id: response.data.user.id,
                name: response.data.user.name,
                email: response.data.user.email,
                description: response.data.user.description,
                token: response.data.accessToken
            };

            console.log('Login verified, setting session with token:', session.token.substring(0, 10) + '...');
            this.sessionService.setSession(session);
            return session;
        } catch (error) {
            console.error('Login verification failed:', error);
            if (error instanceof AuthError) {
                throw error;
            }
            throw new AuthError('Failed to verify login', error);
        }
    }

    public async logout(): Promise<void> {
        try {
            console.log('Starting logout process...');
            const token = this.sessionService.getToken();
            if (token) {
                console.log('Found token for logout, making logout request...');
                await this.httpService.post('/auth/logout', null, {
                    headers: this.getAuthHeaders()
                });
                console.log('Logout request successful');
            } else {
                console.log('No token found for logout request');
            }
        } catch (error) {
            console.error('Logout request failed:', error);
        } finally {
            console.log('Clearing session after logout');
            this.sessionService.clearSession();
            console.log('Logout process completed');
        }
    }

    public async getUserProfile(): Promise<User> {
        try {
            const response = await this.httpService.get<User>('/auth/profile', {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Failed to get user profile:', error);
            throw new AuthError('Failed to get user profile', error);
        }
    }

    public async updateProfile(data: UpdateProfileData): Promise<UserSession> {
        try {
            const response = await this.httpService.put<UserSession>('/profile', data, {
                headers: this.getAuthHeaders()
            });

            const updatedSession = response.data;
            console.log('Profile updated, setting new session with token:', updatedSession.token ? updatedSession.token.substring(0, 10) + '...' : 'no token');
            this.sessionService.setSession(updatedSession);
            return updatedSession;
        } catch (error) {
            console.error('Failed to update profile:', error);
            throw new AuthError('Failed to update profile', error);
        }
    }
}

export default AuthService;