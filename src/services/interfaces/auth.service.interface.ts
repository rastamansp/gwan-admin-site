import { User, UserSession, UpdateProfileData } from '../../modules/auth/types/auth.types';

export interface IAuthService {
    // Authentication methods
    login(email: string): Promise<void>;
    verifyLogin(email: string, code: string): Promise<UserSession>;
    logout(): Promise<void>;

    // Profile management
    getUserProfile(): Promise<User>;
    updateProfile(data: UpdateProfileData): Promise<UserSession>;
} 