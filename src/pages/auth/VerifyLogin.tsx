import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import env from '../../config/env';
import AuthFooter from '../../components/auth/AuthFooter';

export default function VerifyLogin() {
  const { t } = useTranslation(['auth']);
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  // Obtém o email do estado da navegação
  const email = location.state?.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Enviando dados de verificação de login:', { email, code });

      const response = await fetch(`${env.API_URL}/auth/verify-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na resposta:', errorData);
        throw new Error(errorData.message || 'Verification failed');
      }

      const data = await response.json();
      console.log('Resposta da API:', data);

      // Verifica se o token existe na resposta
      if (!data.token) {
        console.error('Token não encontrado na resposta:', data);
        throw new Error('Token não recebido do servidor');
      }

      // Armazena o token
      localStorage.setItem('token', data.token);
      console.log('Token armazenado com sucesso');

      // Redireciona para o dashboard
      console.log('Redirecionando para o dashboard...');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Erro completo:', err);
      setError(t('verificationError'));
    }
  };

  // Se não tiver email, redireciona para login
  if (!email) {
    navigate('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('verifyLoginCode')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('enterLoginCode')}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="code" className="sr-only">
              {t('verificationCode')}
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800"
              placeholder={t('verificationCode')}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t('verify')}
            </button>
          </div>
        </form>
      </div>
      <AuthFooter />
    </div>
  );
} 