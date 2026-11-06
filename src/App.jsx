import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";

import Products from "./components/Products";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import GlobalNavbar from "./components/GlobalNavbar";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { fetchAuthUser } from "./store/Slices/usersSlice";

export default function App() {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDark);
  const token = useSelector((state) => state.users.token);

  // Auto-detect authentication state on app load
  useEffect(() => {
    if (token) {
      dispatch(fetchAuthUser());
    }
  }, [dispatch, token]);

  return (
    <div
      className={`app-root d-flex flex-column min-vh-100 ${
        isDark ? "bg-dark text-white" : "bg-light text-dark"
      }`}
      data-bs-theme={isDark ? "dark" : "light"}
    >
      <GlobalNavbar />

      <main className="flex-grow-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <Container className="text-center py-5">
                <div className="display-1 text-muted fw-bold">404</div>
                <h2 className="fw-bold mb-3">Page Not Found</h2>
                <p className="text-muted mb-4">
                  The page you are looking for does not exist or has been moved.
                </p>
                <a href="/" className="btn btn-primary rounded-pill px-4">
                  Back to Home
                </a>
              </Container>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
