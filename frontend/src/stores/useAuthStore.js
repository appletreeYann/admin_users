import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const storageToken = () => localStorage.getItem("token") || "";

// Verifica si el token aún es válido
const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now(); // comparar en milisegundos
  } catch {
    return false;
  }
};

// Obtener rol (si es válido)
const getRole = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.role || null;
  } catch {
    return null;
  }
};

export const useAuthStore = create((set) => {
  const token = storageToken();
  const valid = isTokenValid(token);

  return {
    token: valid ? token : "",
    role: valid ? getRole(token) : null,
    isLoading: false,

    authenticate: async ({ email, password }) => {
      set({ isLoading: true });

      try {
        const response = await fetch("http://adminusers.local:8081/login.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Error al iniciar sesión");
        }

        const token = result.token;

        localStorage.setItem("token", token);

        set({
          token,
          role: getRole(token),
          isLoading: false,
        });

        toast.success("Inicio de sesión exitoso", { autoClose: 3000 });
        return true;

      } catch (error) {
        set({ isLoading: false });
        toast.error(`Error: ${error.message}`, { autoClose: 3000 });
        return false;
      }
    },

    logout: () => {
      localStorage.removeItem("token");
      set({ token: "", role: null });
      toast.info("Sesión cerrada", { autoClose: 2000 });
    }
  };
});
