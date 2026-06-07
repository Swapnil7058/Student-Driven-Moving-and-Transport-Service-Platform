import { Link } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

export default function AdminSidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="min-h-screen w-64 bg-slate-900 p-6 text-slate-200">
      <h2 className="mb-8 text-2xl font-bold">VanMan Admin</h2>

      <nav className="space-y-4">
        <Link
          to={user.role === "admin" ? "/admin/dashboard" : "/customer/dashboard"}
          className="block transition hover:text-orange-500"
        >
          Dashboard
        </Link>
        <Link
          className="block transition hover:text-orange-500"
          to="/admin/bookings"
        >
          Bookings
        </Link>
        <Link
          className="block transition hover:text-orange-500"
          to="/admin/operations"
        >
          Operations
        </Link>
        <Link
          className="block transition hover:text-orange-500"
          to="/admin/students"
        >
          Students
        </Link>
        <button
          onClick={logout}
          className="block text-red-400 hover:text-red-300"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
