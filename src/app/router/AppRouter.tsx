import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import HomePage from '../../pages/HomePage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
