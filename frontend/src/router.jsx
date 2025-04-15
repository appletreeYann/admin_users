import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/useAuthStore"; // asegúrate de ajustar la ruta

// Páginas
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import UsersPage from "./pages/UsersPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function AppRouter() {
  const { token, role } = useAuthStore();

  const isAuthenticated = Boolean(token);

  return (
    <Router>
      <Routes>
        {/* Página raíz: redirecciona automáticamente */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to="/profile" />
              : <Navigate to="/login" />
          }
        />

        {/* Login: solo si no estás autenticado */}
        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/profile" />
              : <LoginPage />
          }
        />

        {/* Perfil: requiere autenticación */}
        <Route
          path="/profile"
          element={
            isAuthenticated
              ? <ProfilePage />
              : <Navigate to="/login" />
          }
        />

        {/* Users: solo para superadmin */}
        <Route
          path="/users"
          element={
            isAuthenticated && role === "superadmin"
              ? <UsersPage />
              : <Navigate to="/login" />
          }
        />

        {/* Ruta no encontrada */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
