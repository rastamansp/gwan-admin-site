interface EnvConfig {
  API_URL: string;
  ENV: string;
}

const env: EnvConfig = {
  API_URL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://bff.gwan.com.br/api' : 'http://localhost:3000/api'),
  ENV: import.meta.env.MODE,
};

export default env; 