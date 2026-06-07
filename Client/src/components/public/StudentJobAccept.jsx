import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../../socket-connection/socket";
import { API_BASE_URL } from "../../config/api";

export default function StudentJobAccept() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [debugOtp, setDebugOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    studentId: "",
    task: "",
    availabilityConfirmed: false,
    note: "",
  });

  const acceptedCount = job?.acceptedStudents?.length || 0;
  const requiredCount = job?.requiredStudents || 0;
  const remainingSlots = Math.max(requiredCount - acceptedCount, 0);
  const isFull = remainingSlots <= 0;
  const isClosed = job?.status === "completed";

  const scheduleText = useMemo(() => {
    if (!job?.jobSchedule) return "-";
    return new Date(job.jobSchedule).toLocaleString();
  }, [job?.jobSchedule]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch job details");
        }

        setJob(data.data);
        setForm((prev) => ({
          ...prev,
          task: prev.task || data.data.workType?.[0] || "",
        }));
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  useEffect(() => {
    const handleStudentAccepted = (payload) => {
      if (String(payload.jobId) !== String(jobId)) return;
      setJob(payload.data);
    };

    const handleProgressUpdated = (payload) => {
      if (String(payload.jobId) !== String(jobId)) return;
      setJob((current) => {
        if (!current) return current;
        return {
          ...current,
          status: payload.status,
          workProgress: payload.workProgress,
        };
      });
    };

    socket.on("job:studentAccepted", handleStudentAccepted);
    socket.on("job:progressUpdated", handleProgressUpdated);

    return () => {
      socket.off("job:studentAccepted", handleStudentAccepted);
      socket.off("job:progressUpdated", handleProgressUpdated);
    };
  }, [jobId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.studentId.trim()) {
      setError("Student ID is required.");
      return;
    }

    if (!form.availabilityConfirmed) {
      setError("Please confirm your availability to continue.");
      return;
    }

    if (!otpVerified) {
      setError("Please verify OTP before applying.");
      return;
    }

    if (isFull || isClosed) {
      setError("This job is not accepting applications now.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        studentId: form.studentId.trim().toUpperCase(),
        task: form.task,
        availabilityConfirmed: form.availabilityConfirmed,
        note: form.note.trim(),
      };

      const res = await fetch(
        `${API_BASE_URL}/jobs/${jobId}/accept-by-id`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to accept job");
      }

      setJob(data.data);
      setMessage("Application submitted successfully.");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendOtp = async () => {
    setError("");
    setMessage("");
    setDebugOtp("");

    if (!form.studentId.trim()) {
      setError("Enter Student ID before requesting OTP.");
      return;
    }

    try {
      setOtpSending(true);
      const res = await fetch(`${API_BASE_URL}/students/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: form.studentId.trim().toUpperCase(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setOtpSent(true);
      setOtpVerified(false);
      setMessage("OTP sent. Please verify to continue.");
      if (data.data?.otp) {
        setDebugOtp(data.data.otp);
      }
    } catch (sendError) {
      setError(sendError.message);
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setMessage("");

    if (!form.studentId.trim()) {
      setError("Student ID is required.");
      return;
    }

    if (!otp.trim()) {
      setError("Enter OTP first.");
      return;
    }

    try {
      setOtpVerifying(true);
      const res = await fetch(`${API_BASE_URL}/students/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: form.studentId.trim().toUpperCase(),
          otp: otp.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to verify OTP");
      }

      setOtpVerified(true);
      setMessage("OTP verified successfully.");
    } catch (verifyError) {
      setOtpVerified(false);
      setError(verifyError.message);
    } finally {
      setOtpVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow">
          Loading job details...
        </div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-2xl space-y-5">
        <section className="rounded-xl bg-white p-6 shadow">
          <h1 className="text-2xl font-semibold text-slate-900">Accept Job</h1>
          <p className="mt-1 text-sm text-slate-500">
            Use your Student ID to apply safely for this job.
          </p>

          <div className="mt-4 grid gap-2 text-sm text-slate-700">
            <p>
              <strong>Route:</strong> {job?.from} to {job?.to}
            </p>
            <p>
              <strong>Schedule:</strong> {scheduleText}
            </p>
            <p>
              <strong>Tasks:</strong> {job?.workType?.join(", ") || "-"}
            </p>
            <p>
              <strong>Slots:</strong> {acceptedCount}/{requiredCount} accepted
            </p>
            <p>
              <strong>Remaining:</strong> {remainingSlots}
            </p>
          </div>

          {(isFull || isClosed) && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              This job is currently closed for new applications.
            </p>
          )}
        </section>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-6 shadow space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Student ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.studentId}
                onChange={(event) => {
                  setForm((prev) => ({ ...prev, studentId: event.target.value }));
                  setOtpSent(false);
                  setOtpVerified(false);
                  setOtp("");
                  setDebugOtp("");
                }}
                placeholder="Example: STU-AB12CD34"
                className="w-full rounded-lg border border-slate-300 p-2.5"
                disabled={isFull || isClosed || submitting || otpVerifying}
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isFull || isClosed || submitting || otpSending}
                className="rounded-lg bg-slate-700 px-4 py-2.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {otpSending ? "Sending..." : "Send OTP"}
              </button>
            </div>
            {otpSent && (
              <p className="mt-2 text-xs text-slate-500">
                OTP sent to registered contact for this Student ID.
              </p>
            )}
            {debugOtp && (
              <p className="mt-1 text-xs text-amber-700">
                Dev OTP: {debugOtp}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              OTP Verification
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full rounded-lg border border-slate-300 p-2.5"
                disabled={isFull || isClosed || submitting || otpVerifying}
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isFull || isClosed || submitting || otpVerifying}
                className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {otpVerifying ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
            {otpVerified && (
              <p className="mt-2 text-xs text-green-700">
                OTP verified. You can apply now.
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Preferred Task
            </label>
            <select
              value={form.task}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, task: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 p-2.5"
              disabled={isFull || isClosed || submitting}
            >
              {(job?.workType || []).map((task) => (
                <option key={task} value={task}>
                  {task}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Optional Note
            </label>
            <textarea
              value={form.note}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, note: event.target.value }))
              }
              placeholder="Any short note for admin..."
              className="w-full rounded-lg border border-slate-300 p-2.5"
              rows={3}
              disabled={isFull || isClosed || submitting}
            />
          </div>

          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.availabilityConfirmed}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  availabilityConfirmed: event.target.checked,
                }))
              }
              disabled={isFull || isClosed || submitting}
            />
            I confirm I am available on the scheduled date and time.
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {message && (
            <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isFull || isClosed || submitting || !otpVerified}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Apply For This Job"}
          </button>
        </form>
      </div>
    </div>
  );
}
