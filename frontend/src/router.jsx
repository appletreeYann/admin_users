import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/useAuthStore";
import AppLayout from "./layouts/AppLayout";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import UsersPage from "./pages/UsersPage";
import NotFoundPage from "./pages/NotFoundPage";
import SessionGuard from "./SessionGuard";

export default function AppRouter() {
  const { token, role } = useAuthStore();
  const isAuthenticated = Boolean(token);

  return (
    <Router>
      <SessionGuard>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/profile" /> : <LoginPage />
            }
          />

          {/* Rutas privadas dentro del layout */}
          {isAuthenticated && (
            <Route element={<AppLayout />}>
              <Route path="/profile" element={<ProfilePage />} />
              {role === "superadmin" && (
                <Route path="/users" element={<UsersPage />} />
              )}
            </Route>
          )}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </SessionGuard>
    </Router>
  );
}
