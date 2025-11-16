import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useAuthSession } from "../hooks/useAuthSession";

export default function ProtectedRoute() {
  const hasAccess = useAuthStore((state) => state.hasAccess);
  const { initialized } = useAuthSession();

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
        Memuat sesi...
      </div>
    );
  }

  return hasAccess ? <Outlet /> : <Navigate to="/login" replace />;
}
