interface EnvConfig {
  API_URL: string;
}

const env: EnvConfig = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
};

export default env; 