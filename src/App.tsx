import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Register from './pages/auth/Register';
import Verify from './pages/auth/Verify';
import Login from './pages/auth/Login';
import VerifyLogin from './pages/auth/VerifyLogin';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const { t } = useTranslation();

  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/verify" element={<Verify />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/verify-login" element={<VerifyLogin />} />

        {/* Rotas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<div>Dashboard</div>} />
          {/* Adicione mais rotas protegidas aqui */}
        </Route>

        {/* Rota padrão */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
