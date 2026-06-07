import JobStatCard from "../components/JobStatCard";
import StudentsStats from "../components/StudentsStats";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <main className="flex-1 p-6">
        <h1 className="text-xl font-semibold mb-4">Moving Stats</h1>

        <JobStatCard />

        <h1 className="mt-8 mb-4 text-xl font-semibold">Student Stats</h1>
        <StudentsStats />
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <button
            onClick={() => navigate("/admin/bookings")}
            className="rounded-2xl bg-white p-6 text-left shadow transition hover:-translate-y-0.5"
          >
            <p className="text-sm font-medium text-slate-500">Quotes</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-800">
              Manage Bookings
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Review quote requests, pricing, and move confirmations.
            </p>
          </button>

          <button
            onClick={() => navigate("/admin/operations")}
            className="rounded-2xl bg-white p-6 text-left shadow transition hover:-translate-y-0.5"
          >
            <p className="text-sm font-medium text-slate-500">Operations</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-800">
              Control Live Jobs
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Track assigned moves and update packing, loading, and completion
              progress.
            </p>
          </button>

          <button
            onClick={() => navigate("/admin/students")}
            className="rounded-2xl bg-white p-6 text-left shadow transition hover:-translate-y-0.5"
          >
            <p className="text-sm font-medium text-slate-500">Students</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-800">
              Manage Student Team
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Review approvals, availability, and assigned move helpers.
            </p>
          </button>
        </section>
      </main>
    </div>
  );
}
