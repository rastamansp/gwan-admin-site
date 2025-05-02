import { User, UserSession, UpdateProfileData } from '../../types/auth.types';

export interface IAuthService {
    login(email: string): Promise<void>;
    verifyLogin(email: string, code: string): Promise<UserSession>;
    getUserProfile(): Promise<User>;
    updateProfile(data: UpdateProfileData): Promise<UserSession>;
    logout(): void;
    setUserSession(session: UserSession): void;
    getUserSession(): UserSession | null;
    getToken(): string | null;
    isAuthenticated(): boolean;
} 