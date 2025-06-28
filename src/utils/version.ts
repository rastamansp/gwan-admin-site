// Utilitário para acessar a versão do package.json
export const getAppVersion = (): string => {
    // A versão é injetada pelo Vite durante o build
    return import.meta.env.VITE_APP_VERSION || '1.0.0';
}; 