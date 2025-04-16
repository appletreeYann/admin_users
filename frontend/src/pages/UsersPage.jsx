import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

export default function UsersPage() {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const role = useAuthStore((state) => state.role);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edicion
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    birthdate: "",
    state: ""
  });


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://adminusers.local:8081/users.php", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      setUsers(result.users);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      logout();
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = confirm("¿Estás seguro que deseas eliminar este usuario?");
    if (!confirmed) return;

    try {
      const response = await fetch("http://adminusers.local:8081/delete_user.php", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      toast.success("Usuario eliminado");
      fetchUsers(); // refrescar tabla
    } catch (error) {
      toast.error(`Error al eliminar: ${error.message}`);
    }
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentUser(null);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://adminusers.local:8081/edit_user.php", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(currentUser)
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      toast.success("Usuario actualizado");
      closeModal();
      fetchUsers();
    } catch (error) {
      toast.error(`Error al editar: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  if (loading) return <div className="w-full mt-60 py-16 flex items-center justify-center"> <Spinner /> </div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">Usuarios registrados</h1>

      {role === "superadmin" && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-teal-400 text-white px-4 py-2 rounded hover:bg-teal-600 hover:cursor-pointer"
          >
            Crear nuevo usuario
          </button>
        </div>
      )}

      <table className="w-full border border-gray-300 rounded overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Rol</th>
            <th className="p-2 text-left">Estado</th>
            <th className="p-2 text-left">Nacimiento</th>
            <th className="p-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2 uppercase">{user.role}</td>
              <td className="p-2">{user.state}</td>
              <td className="p-2">{user.birthdate}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => openEditModal(user)}
                  className="text-blue-600 hover:underline"
                >
                   Editar
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600 hover:underline"
                >
                   Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-6">
              <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 shadow-xl">
                <Dialog.Title className="text-lg font-bold mb-4">Editar usuario</Dialog.Title>

                {currentUser && (
                  <form onSubmit={handleEdit} className="space-y-4">
                    <div>
                      <label htmlFor="edit-name" className="block font-medium text-gray-700">Nombre</label>
                      <input
                        id="edit-name"
                        name="name"
                        type="text"
                        value={currentUser.name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor="edit-email" className="block font-medium text-gray-700">Correo electrónico</label>
                      <input
                        id="edit-email"
                        name="email"
                        type="email"
                        value={currentUser.email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor="edit-role" className="block font-medium text-gray-700">Rol</label>
                      <select
                        id="edit-role"
                        name="role"
                        value={currentUser.role}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mt-1"
                      >
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="edit-state" className="block font-medium text-gray-700">Estado</label>
                      <input
                        id="edit-state"
                        name="state"
                        type="text"
                        value={currentUser.state}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor="edit-birthdate" className="block font-medium text-gray-700">Fecha de nacimiento</label>
                      <input
                        id="edit-birthdate"
                        name="birthdate"
                        type="date"
                        value={currentUser.birthdate}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded mt-1"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button type="button" onClick={closeModal} className="text-gray-600 hover:underline">
                        Cancelar
                      </button>
                      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Guardar cambios
                      </button>
                    </div>
                  </form>
                )}
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>


      <Transition appear show={showCreateModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setShowCreateModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-6">
              <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 shadow-xl">
                <Dialog.Title className="text-lg font-bold mb-4">Crear nuevo usuario</Dialog.Title>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      const response = await fetch("http://adminusers.local:8081/register.php", {
                        method: "POST",
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newUser),
                      });

                      const result = await response.json();

                      if (!response.ok) throw new Error(result.message);

                      toast.success("Usuario creado con éxito");
                      setShowCreateModal(false);
                      fetchUsers(); // actualizar lista
                    } catch (error) {
                      toast.error(`Error al crear: ${error.message}`);
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="name" className="block font-medium text-gray-700">Nombre</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      required
                      className="w-full p-2 border rounded mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block font-medium text-gray-700">Correo electrónico</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      required
                      className="w-full p-2 border rounded mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block font-medium text-gray-700">Contraseña</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      required
                      className="w-full p-2 border rounded mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="role" className="block font-medium text-gray-700">Rol</label>
                    <select
                      id="role"
                      name="role"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full p-2 border rounded mt-1"
                    >
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="state" className="block font-medium text-gray-700">Estado</label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={newUser.state}
                      onChange={(e) => setNewUser({ ...newUser, state: e.target.value })}
                      required
                      className="w-full p-2 border rounded mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="birthdate" className="block font-medium text-gray-700">Fecha de nacimiento</label>
                    <input
                      id="birthdate"
                      name="birthdate"
                      type="date"
                      value={newUser.birthdate}
                      onChange={(e) => setNewUser({ ...newUser, birthdate: e.target.value })}
                      required
                      className="w-full p-2 border rounded mt-1"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="text-gray-600 hover:underline"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Crear
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>


    </div>
  );
}
