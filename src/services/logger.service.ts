import env from '../config/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
    service?: string;
    method?: string;
    endpoint?: string;
    userId?: string;
    [key: string]: unknown;
}

class LoggerService {
    private static instance: LoggerService;
    private readonly isDevelopment: boolean;

    private constructor() {
        this.isDevelopment = env.ENV === 'development';
    }

    public static getInstance(): LoggerService {
        if (!LoggerService.instance) {
            LoggerService.instance = new LoggerService();
        }
        return LoggerService.instance;
    }

    private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
        const timestamp = new Date().toISOString();
        const contextStr = context ? ` ${JSON.stringify(context)}` : '';
        return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
    }

    private log(level: LogLevel, message: string, context?: LogContext) {
        const formattedMessage = this.formatMessage(level, message, context);

        // Em desenvolvimento, sempre loga no console
        if (this.isDevelopment) {
            switch (level) {
                case 'debug':
                    console.debug(formattedMessage);
                    break;
                case 'info':
                    console.info(formattedMessage);
                    break;
                case 'warn':
                    console.warn(formattedMessage);
                    break;
                case 'error':
                    console.error(formattedMessage);
                    break;
            }
        } else {
            // Em produção, loga apenas info, warn e error
            if (level !== 'debug') {
                switch (level) {
                    case 'info':
                        console.info(formattedMessage);
                        break;
                    case 'warn':
                        console.warn(formattedMessage);
                        break;
                    case 'error':
                        console.error(formattedMessage);
                        break;
                }
            }
        }

        // Aqui poderíamos adicionar integração com serviços de logging como Sentry, LogRocket, etc.
    }

    debug(message: string, context?: LogContext) {
        this.log('debug', message, context);
    }

    info(message: string, context?: LogContext) {
        this.log('info', message, context);
    }

    warn(message: string, context?: LogContext) {
        this.log('warn', message, context);
    }

    error(message: string, error?: Error, context?: LogContext) {
        const errorContext = {
            ...context,
            error: error ? {
                name: error.name,
                message: error.message,
                stack: error.stack
            } : undefined
        };
        this.log('error', message, errorContext);
    }

    // Métodos específicos para serviços comuns
    apiRequest(method: string, endpoint: string, context?: LogContext) {
        this.info(`API Request: ${method} ${endpoint}`, {
            service: 'api',
            method,
            endpoint,
            ...context
        });
    }

    apiResponse(method: string, endpoint: string, status: number, context?: LogContext) {
        this.info(`API Response: ${method} ${endpoint} - ${status}`, {
            service: 'api',
            method,
            endpoint,
            status,
            ...context
        });
    }

    apiError(method: string, endpoint: string, error: Error, context?: LogContext) {
        this.error(`API Error: ${method} ${endpoint}`, error, {
            service: 'api',
            method,
            endpoint,
            ...context
        });
    }

    authEvent(event: string, userId?: string, context?: LogContext) {
        this.info(`Auth Event: ${event}`, {
            service: 'auth',
            event,
            userId,
            ...context
        });
    }

    fileOperation(operation: string, fileName: string, context?: LogContext) {
        this.info(`File Operation: ${operation}`, {
            service: 'file',
            operation,
            fileName,
            ...context
        });
    }
}

export const logger = LoggerService.getInstance();
export default logger; 