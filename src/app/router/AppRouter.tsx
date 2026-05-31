import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import CompleteProfilePage from '../../features/auth/pages/CompleteProfilePage';
import LoginPage from '../../features/auth/pages/LoginPage';
import RegisterPage from '../../features/auth/pages/RegisterPage';
import HomePage from '../../pages/HomePage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/complete-profile" element={<CompleteProfilePage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
