import React from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../stores/useAuthStore";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

export default function LoginView() {
  const { authenticate, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: initialValues });

  const handleLogin = async (loginData) => {
    const success = await authenticate(loginData);
    if (success) {
      navigate("/profile"); // redirige si el login fue exitoso
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="py-7 font-bold text-black text-3xl">Iniciar sesión</h1>
      </div>

      

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-8 p-10 bg-white rounded-sm border border-gray-300 shadow-lg"
        noValidate
      >
        {isLoading && (
          <div className="text-center text-gray-600 my-4">
            <Spinner />
          </div>
        )}
        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Correo electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="ejemplo@correo.com"
            disabled={isLoading}
            className="w-full p-3 border-gray-300 border rounded-lg"
            {...register("email", {
              required: "Introduzca su correo",
            })}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Contraseña</label>
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 border-gray-300 border rounded-lg"
            {...register("password", {
              required: "Introduzca una contraseña",
            })}
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>

        <input
          type="submit"
          value="Iniciar Sesión"
          className="bg-black hover:bg-gray-800 w-full p-3 text-white font-black text-xl cursor-pointer transition rounded-lg"
        />
      </form>

      <ToastContainer />
    </>
  );
}
