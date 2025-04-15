import { useNavigate } from "react-router-dom"

export default function Error404() {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
            <h1 className="text-9xl font-bold text-(--brand-color)">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mt-4">Página no encontrada</h2>
            <p className="text-gray-600 mt-2">
                Lo sentimos, la página que buscas no existe.
            </p>
            <button 
                onClick={() => navigate("/")}
                className="mt-6 px-6 py-2 bg-(--brand-color) text-white rounded-lg transition"
            >
                Volver al inicio
            </button>
        </div>
    )
}
