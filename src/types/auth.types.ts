export interface User {
    id: string;
    name: string;
    email: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateProfileData {
    name: string;
    description?: string;
}

export interface UserSession {
    id: string;
    name: string;
    email: string;
    description?: string;
    token: string;
} 