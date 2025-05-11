export class AuthError extends Error {
    constructor(message: string, public readonly cause?: unknown) {
        super(message);
        this.name = 'AuthError';
    }
}

export class NetworkError extends Error {
    constructor(message: string, public readonly cause?: unknown) {
        super(message);
        this.name = 'NetworkError';
    }
}

export class ValidationError extends Error {
    constructor(message: string, public readonly cause?: unknown) {
        super(message);
        this.name = 'ValidationError';
    }
} 