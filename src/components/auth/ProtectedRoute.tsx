import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../../services/auth.service';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const authService = AuthService.getInstance();

  console.log('ProtectedRoute - Token:', authService.getToken() ? 'Presente' : 'Ausente');
  console.log('ProtectedRoute - Localização atual:', location.pathname);

  if (!authService.isAuthenticated()) {
    console.log('ProtectedRoute - Redirecionando para login');
    // Redireciona para login mantendo a URL original para redirecionamento após login
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  console.log('ProtectedRoute - Renderizando conteúdo protegido');
  return <>{children}</>;
} 