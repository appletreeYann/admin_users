import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

export default function Header() {
  const { token, role, logout } = useAuthStore();
  const isAuthenticated = Boolean(token);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-gray-900 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/">AdminUsers</Link>
        </h1>

        {isAuthenticated && (
          <nav className="flex gap-4 items-center">
            <Link to="/profile" className="hover:underline">
              Mi perfil
            </Link>

            {role === "superadmin" && (
              <Link to="/users" className="hover:underline">
                Usuarios
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
            >
              Cerrar sesión
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
