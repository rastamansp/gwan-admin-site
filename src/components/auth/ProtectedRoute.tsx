import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const token = localStorage.getItem('token');

  console.log('ProtectedRoute - Token:', token ? 'Presente' : 'Ausente');
  console.log('ProtectedRoute - Localização atual:', location.pathname);

  if (!token) {
    console.log('ProtectedRoute - Redirecionando para login');
    // Redireciona para login mantendo a URL original para redirecionamento após login
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  console.log('ProtectedRoute - Renderizando conteúdo protegido');
  return <>{children}</>;
} 