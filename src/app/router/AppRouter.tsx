import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import AccessibilityPage from '../../features/accessibility/pages/AccessibilityPage';
import CompleteProfilePage from '../../features/auth/pages/CompleteProfilePage';
import LoginPage from '../../features/auth/pages/LoginPage';
import RegisterPage from '../../features/auth/pages/RegisterPage';
import CartPage from '../../features/cart/pages/CartPage';
import CheckoutPage from '../../features/checkout/pages/CheckoutPage';
import OrdersPage from '../../features/checkout/pages/OrdersPage';
import HelpPage from '../../features/help/pages/HelpPage';
import ProductComparePage from '../../features/products/pages/ProductComparePage';
import ProductDetailPage from '../../features/products/pages/ProductDetailPage';
import ProductsPage from '../../features/products/pages/ProductsPage';
import HomePage from '../../pages/HomePage';
import SiteMapPage from '../../pages/SiteMapPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/complete-profile" element={<CompleteProfilePage />} />
          <Route path="/profile" element={<CompleteProfilePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/compare" element={<ProductComparePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/site-map" element={<SiteMapPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
