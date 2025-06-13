import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Login from './modules/auth/pages/Login';
import Register from './modules/auth/pages/Register';
import Verify from './modules/auth/pages/Verify';
import VerifyLogin from './modules/auth/pages/VerifyLogin';
import KnowledgeBaseDatasetUpload from './modules/knowledge/pages/KnowledgeBaseDatasetUpload';
import KnowledgeBaseManagement from './modules/knowledge/pages/KnowledgeBaseManagement';
import KnowledgeBaseSearch from './modules/knowledge/pages/KnowledgeBaseSearch';
import ChatbotsPage from './modules/chatbots/pages/ChatbotsPage';
import { CrawlingListPage } from './modules/crawling/pages/CrawlingListPage';
import { CrawlingDetailPage } from './modules/crawling/pages/CrawlingDetailPage';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';
import Layout from './components/layout/Layout';
import UserProfile from './modules/user-profile/pages/UserProfile';
import Dashboard from './modules/dashboard/pages/Dashboard';

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
            <Route index element={<Dashboard />} />
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
