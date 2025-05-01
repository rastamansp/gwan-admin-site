interface UserSession {
    id: string;
    email: string;
    token: string;
}

class AuthService {
    private static instance: AuthService;
    private userSession: UserSession | null = null;

    private constructor() {
        // Tenta recuperar a sessão do localStorage ao inicializar
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                this.userSession = {
                    id: userData._id || userData.id,
                    email: userData.email,
                    token: storedToken
                };
            } catch (error) {
                console.error('Erro ao carregar sessão:', error);
                this.clearSession();
            }
        }
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    setUserSession(session: UserSession) {
        this.userSession = session;
        localStorage.setItem('token', session.token);
        localStorage.setItem('user', JSON.stringify({
            _id: session.id,
            email: session.email
        }));
    }

    getUserId(): string | null {
        return this.userSession?.id || null;
    }

    getToken(): string | null {
        return this.userSession?.token || localStorage.getItem('token');
    }

    clearSession() {
        this.userSession = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
}

export default AuthService; 