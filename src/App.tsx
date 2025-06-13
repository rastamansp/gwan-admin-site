import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Verify from './pages/auth/Verify';
import VerifyLogin from './pages/auth/VerifyLogin';
import HomeDashboard from './pages/HomeDashboard';
import KnowledgeBaseDatasetUpload from './pages/KnowledgeBaseDatasetUpload';
import KnowledgeBaseManagement from './pages/KnowledgeBaseManagement';
import KnowledgeBaseSearch from './pages/KnowledgeBaseSearch';
import ChatbotsPage from './pages/ChatbotsPage';
import { CrawlingListPage } from './pages/CrawlingListPage';
import { CrawlingDetailPage } from './pages/CrawlingDetailPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import UserProfile from './pages/UserProfile';

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
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<HomeDashboard />} />
            <Route path="datasets/:knowledgeBaseId/documents" element={<KnowledgeBaseDatasetUpload />} />
            <Route path="datasets/:knowledgeBaseId/search" element={<KnowledgeBaseSearch />} />
            <Route path="knowledge" element={<KnowledgeBaseManagement />} />
            <Route path="chatbots" element={<ChatbotsPage />} />
            <Route path="crawling" element={<CrawlingListPage />} />
            <Route path="crawling/:id" element={<CrawlingDetailPage />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>
        </Routes>
      </Router>
    </I18nextProvider>
  );
}

export default App;
