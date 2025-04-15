import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

// Endpoint de tu backend local
const url = "http://adminusers.local:8081";

// Recuperar token de localStorage al iniciar
const storageToken = () => localStorage.getItem("token") || "";

// Decodificar rol desde el token
const decodeRole = (token) => {
  try {
    const decoded = jwt_decode(token);
    return decoded.role || null;
  } catch {
    return null;
  }
};

export const useAuthStore = create((set) => ({
  token: storageToken(),
  role: decodeRole(storageToken()),
  isLoading: false, // <- nuevo

  authenticate: async ({ email, password }) => {
    set({ isLoading: true }); // inicia carga

    try {
      const response = await fetch(`${url}/login.php`, {
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

      set(() => ({
        token,
        role: decodeRole(token),
        isLoading: false // ← termina carga con éxito
      }));

      toast.success("Inicio de sesión exitoso", {
        position: "top-right",
        autoClose: 3000,
      });

      return true;

    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });

      set({ isLoading: false }); // ← termina carga con error
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set(() => ({
      token: "",
      role: null,
    }));
  },
}));

