import { Link } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

export default function CustomerSidebar() {
  const { user, logout } = useAuth();
  return (
    <aside className="w-64 bg-slate-700 text-white min-h-screen p-6">
      <h2 className="text-2xl text-orange-300 font-bold mb-8">
        🚚 VanMan MoveEasy
      </h2>
      <hr className="mb-4 border-red-600"/>
      <nav className="space-y-4">
        <Link
          to={
            user.role === "admin" ? "/admin/dashboard" : "/customer/dashboard"
          }
          className="block hover:text-orange-500 transition"
        >
          Dashboard
        </Link>
        <Link
          to={user.role === "customer" ? "/customer/profile" : "/admin/dashboard"}
          className="block hover:text-orange-500 transition"
        >
          Profile
        </Link>
        <Link
          to="/customer/quote"
          className="block hover:text-orange-500 transition"
        >
          New Quote
        </Link>
        <Link
          to="/customer/quotes"
          className="block hover:text-orange-500 transition"
        >
          My Quotes
        </Link>
        <Link
          to="/customer/support"
          className="block hover:text-orange-500 transition"
        >
          Support
        </Link>
        <Link
          to="/customer/faqs"
          className="block hover:text-orange-500
          4 transition"
        >
          FAQ's
        </Link>
      </nav>
    </aside>
  );
}
