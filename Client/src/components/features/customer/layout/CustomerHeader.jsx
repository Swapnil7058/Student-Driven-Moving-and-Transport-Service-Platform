import { useAuth } from "../../../../context/AuthContext";

export default function CustomerHeader({ username }) {
  const { logout } = useAuth();

  return (
    <header className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          My Dashboard
        </h1>
        <span className="text-slate-500 text-sm">
          Welcome, {username}
        </span>
      </div>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </header>
  );
}