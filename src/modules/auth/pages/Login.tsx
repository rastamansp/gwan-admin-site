import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthFooter from '../../../components/auth/AuthFooter';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
  const { t, i18n } = useTranslation('auth');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    code: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // Debug logs for i18n
  useEffect(() => {
    console.log('Current language:', i18n.language);
    console.log('Available languages:', i18n.languages);
    console.log('Translation test:', t('login'));
    console.log('Translation test (email):', t('email'));
  }, [i18n.language, t, i18n.languages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email);
      navigate('/auth/verify-login', { state: { email: formData.email } });
    } catch {
      toast.error(t('loginError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('login')}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                {t('email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={t('email')}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? t('loggingIn', { defaultValue: 'Entrando...' }) : t('login')}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('noAccount')} <Link to="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">{t('register')}</Link>
          </p>
        </div>
      </div>
      <AuthFooter />
    </div>
  );
};

export default Login; 