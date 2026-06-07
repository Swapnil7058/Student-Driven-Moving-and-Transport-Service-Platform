import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../../config/api";

const statusOptions = ["all", "open", "partially-filled", "filled", "in-progress", "completed"];

const statusStyle = {
  open: "bg-gray-100 text-gray-700",
  "partially-filled": "bg-yellow-100 text-yellow-700",
  filled: "bg-indigo-100 text-indigo-700",
  "in-progress": "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

export default function AdminOperations() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/jobs?status=${status}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch jobs");
        }

        setJobs(data.data);
      } catch (error) {
        console.error("Operations fetch error:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [status]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold text-slate-800">Operations</h1>
        <p className="mt-2 text-slate-500">
          Track active move jobs and update work progress from one place.
        </p>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-800">Job Control</h2>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All Jobs" : option.replace("-", " ")}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-500">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="py-8 text-center text-slate-500">
            No jobs found for this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-sm text-slate-500">
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Route</th>
                  <th className="pb-3">Schedule</th>
                  <th className="pb-3">Students</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Progress</th>
                  <th className="pb-3">Open</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job) => {
                  const progressDone = [
                    job.workProgress?.packingDone,
                    job.workProgress?.loadingDone,
                    job.workProgress?.truckArrived,
                    job.workProgress?.unloadingDone,
                    job.workProgress?.objectsSetupDone,
                  ].filter(Boolean).length;

                  return (
                    <tr key={job._id} className="border-b">
                      <td className="py-3 font-medium text-slate-800">
                        {job.customerName}
                      </td>
                      <td className="text-sm text-slate-600">
                        {job.from} to {job.to}
                      </td>
                      <td className="text-sm text-slate-600">
                        {new Date(job.jobSchedule).toLocaleString()}
                      </td>
                      <td className="text-sm text-slate-600">
                        {job.acceptedStudents?.length || 0} / {job.requiredStudents}
                      </td>
                      <td>
                        <span
                          className={`rounded-full px-3 py-1 text-sm capitalize ${
                            statusStyle[job.status] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {job.status.replace("-", " ")}
                        </span>
                      </td>
                      <td className="text-sm text-slate-600">
                        {progressDone} / 5 steps
                      </td>
                      <td>
                        <button
                          onClick={() => navigate(`/admin/jobs/quote/${job.quoteId}`)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
