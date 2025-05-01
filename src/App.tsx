import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Verify from './pages/auth/Verify';
import VerifyLogin from './pages/auth/VerifyLogin';
import Dashboard from './pages/Dashboard';
import DatasetUpload from './pages/DatasetUpload';
import KnowledgeBaseList from './pages/KnowledgeBaseList';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/layout/Layout';

// Inicializa o i18n antes de qualquer coisa
i18n.loadNamespaces(['auth', 'common', 'dashboard', 'knowledge']).then(() => {
  console.log('Traduções carregadas no App');
});

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/verify" element={<Verify />} />
          <Route path="/auth/verify-login" element={<VerifyLogin />} />
          <Route path="/login" element={<Login />} />

          {/* Rotas protegidas */}
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="datasets/upload" element={<DatasetUpload />} />
            <Route path="knowledge" element={<KnowledgeBaseList />} />
          </Route>
        </Routes>
      </Router>
    </I18nextProvider>
  );
}

export default App;
