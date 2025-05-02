export interface User {
    id: string;
    name: string;
    email: string;
    whatsapp?: string;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateProfileData {
    name: string;
    whatsapp?: string;
}

export interface UserSession {
    id: string;
    name: string;
    email: string;
    whatsapp?: string;
    token: string;
} 