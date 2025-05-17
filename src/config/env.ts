interface EnvConfig {
  API_URL: string;
  ENV: string;
}

const env: EnvConfig = {
  API_URL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://api.gwan.com.br/api' : 'http://localhost:3000/api'),
  ENV: import.meta.env.MODE,
};

// Log environment in development
if (import.meta.env.DEV) {
  console.log('Environment:', env.ENV);
  console.log('API URL:', env.API_URL);
}

export default env; 