import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore"; // ajusta la ruta si es diferente
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://adminusers.local:8081/profile.php", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Error al cargar el perfil");
        }

        setUser(result.user);
      } catch (error) {
        toast.error(`Sesión inválida: ${error.message}`);
        logout();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, logout, navigate]);

  if (loading) return <div className="w-full mt-60 py-20 flex items-center justify-center"> <Spinner /> </div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-4 text-center">Mi perfil</h1>
      <ul className="space-y-2 text-lg">
        <li><strong>Nombre:</strong> {user.name}</li>
        <li><strong>Email:</strong> {user.email}</li>
        <li><strong>Estado:</strong> {user.state}</li>
        <li><strong>Fecha de nacimiento:</strong> {user.birthdate}</li>
        <li><strong>Rol:</strong> <span className="uppercase">{user.role}</span></li>
      </ul>
    </div>
  );
}
