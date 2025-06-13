import { Routes, Route } from 'react-router-dom';

import Layout from './pages/layout';

import HomePage from './pages/home';
import AuthPage from './pages/auth';
import { OauthSuccessPage } from './pages/oauth/oauth-success-page';

import { useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import { ProtectedRoute } from './components/protected-route';
import UserPage from './pages/user';
import SettingsPage from './pages/settings';
import Dashboard from './pages/dashboard';
import EditPage from './pages/edit';
import NotFoundPage from './pages/not-found';
import RequirePage from './pages/require';
import RequireDetailPage from './pages/require/id';

const App = () => {
  // 앱 전체 시작 시 토큰 로딩
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      useAuthStore.getState().setAccessToken(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return;
    }
  }, []);

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/oauth/success" element={<OauthSuccessPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route
          path="edit"
          element={
            <ProtectedRoute>
              <EditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="user"
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="require"
          element={
            <ProtectedRoute>
              <RequirePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="require/:id"
          element={
            <ProtectedRoute>
              <RequireDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} /> */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
