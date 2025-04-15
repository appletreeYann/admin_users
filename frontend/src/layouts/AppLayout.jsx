import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <>
      <Header />
      <main className="p-6 min-h-screen bg-gray-100">
        <Outlet />
      </main>
    </>
  );
}
