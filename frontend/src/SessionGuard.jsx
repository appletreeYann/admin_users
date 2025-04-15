import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "./stores/useAuthStore";
import { toast } from "react-toastify";

export default function SessionGuard({ children }) {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        logout();
        toast.info("Tu sesión ha expirado. Inicia sesión nuevamente.", {
          autoClose: 3000,
        });
        navigate("/login");
      }
    } catch (error) {
      logout();
      navigate("/login");
    }
  }, [token, location.pathname]);

  return children;
}
