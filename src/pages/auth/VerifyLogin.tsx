import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import env from '../../config/env';
import AuthFooter from '../../components/auth/AuthFooter';
import AuthService from '../../services/auth.service';

export default function VerifyLogin() {
  const { t, i18n } = useTranslation('auth');
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const authService = AuthService.getInstance();

  // Obtém o email do estado da navegação
  const email = location.state?.email;
  const message = location.state?.message;

  useEffect(() => {
    // Força o carregamento das traduções
    i18n.loadNamespaces(['auth']).then(() => {
      console.log('Traduções carregadas no VerifyLogin');
      console.log('Tradução atual:', t('verifyLoginCode'));
      console.log('Idioma atual:', i18n.language);
      console.log('Recursos carregados:', i18n.options.resources);
    });
  }, [i18n, t]);

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

      // Armazena o token e dados do usuário
      authService.setUserSession({
        id: data.user._id,
        email: data.user.email,
        token: data.token
      });

      console.log('Sessão do usuário armazenada com sucesso');

      // Redireciona para a página inicial
      console.log('Redirecionando para a página inicial...');
      navigate('/', { replace: true });
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
            Verificar código de login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {message || 'Digite o código de login enviado para seu WhatsApp'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Código de verificação
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800"
              placeholder="Digite o código de verificação"
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
              Verificar
            </button>
          </div>
        </form>
      </div>
      <AuthFooter />
    </div>
  );
} 