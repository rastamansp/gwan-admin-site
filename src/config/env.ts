interface EnvConfig {
  API_URL: string;
}

const env: EnvConfig = {
  API_URL: import.meta.env.VITE_API_URL || 'https://bff.gwan.com.br',
};

export default env; 