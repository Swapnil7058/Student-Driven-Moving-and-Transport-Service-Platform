import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { socket } from "../../../../socket-connection/socket";
import { API_BASE_URL } from "../../../../config/api";

export default function AdminJobDetails() {
  const navigate = useNavigate();

  const { quoteId } = useParams();
  // console.log(useParams());
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingProgress, setSavingProgress] = useState(false);
  const [progress, setProgress] = useState({
    packingDone: false,
    loadingDone: false,
    truckArrived: false,
    unloadingDone: false,
    objectsSetupDone: false,
  });

  useEffect(() => {
    console.log(quoteId);

    fetch(`${API_BASE_URL}/jobs/quote/${quoteId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setJob(data.data);
          setProgress({
            packingDone: Boolean(data.data.workProgress?.packingDone),
            loadingDone: Boolean(data.data.workProgress?.loadingDone),
            truckArrived: Boolean(data.data.workProgress?.truckArrived),
            unloadingDone: Boolean(data.data.workProgress?.unloadingDone),
            objectsSetupDone: Boolean(data.data.workProgress?.objectsSetupDone),
          });
        }
      })
      .finally(() => setLoading(false));
  }, [quoteId]);

  useEffect(() => {
    const handleProgressUpdated = (payload) => {
      if (String(payload.quoteId) !== String(quoteId)) {
        return;
      }

      setJob(payload.data);
      setProgress({
        packingDone: Boolean(payload.data.workProgress?.packingDone),
        loadingDone: Boolean(payload.data.workProgress?.loadingDone),
        truckArrived: Boolean(payload.data.workProgress?.truckArrived),
        unloadingDone: Boolean(payload.data.workProgress?.unloadingDone),
        objectsSetupDone: Boolean(payload.data.workProgress?.objectsSetupDone),
      });
    };

    socket.on("job:progressUpdated", handleProgressUpdated);

    return () => {
      socket.off("job:progressUpdated", handleProgressUpdated);
    };
  }, [quoteId]);

  useEffect(() => {
    const handleStudentAccepted = (payload) => {
      if (String(payload.quoteId) !== String(quoteId)) {
        return;
      }

      setJob(payload.data);
    };

    socket.on("job:studentAccepted", handleStudentAccepted);

    return () => {
      socket.off("job:studentAccepted", handleStudentAccepted);
    };
  }, [quoteId]);

  if (loading)
    return (
      <div className="p-10 text-center text-slate-500 animate-pulse">
        Loading job details...
      </div>
    );
  if (!job) return <p className="p-6">No job found</p>;

  const jobStatusStyle = {
    open: "bg-gray-100 text-gray-700",
    "partially-filled": "bg-yellow-100 text-yellow-700",
    filled: "bg-indigo-100 text-indigo-700",
    "in-progress": "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
  };

  // General job details Message
  const generateJobMessage = (job) => {
  const acceptanceLink = `${window.location.origin}/students/accept/${job._id}`;

  return [
    "NEW MOVING JOB AVAILABLE",
    `From: ${job.from}`,
    `To: ${job.to}`,
    `Date: ${new Date(job.jobSchedule).toLocaleString()}`,
    `Task: ${job.workType.join(", ")}`,
    `Required Students: ${job.requiredStudents}`,
    "To accept this job, open this link:",
    acceptanceLink,
    `Job ID: ${job._id}`,
  ].join("\n");
};


  // Sharing Links
  const generateWhatsAppLink = (job) => {
    const message = encodeURIComponent(generateJobMessage(job));
    return `https://wa.me/?text=${message}`;
  };
  const generateTelegramLink = (job) => {
    const message = encodeURIComponent(generateJobMessage(job));
    return `https://t.me/share/url?text=${message}`;
  };
  const generateEmailLink = (job) => {
    const subject = encodeURIComponent("New Moving Job Available");
    const body = encodeURIComponent(generateJobMessage(job));

    return `mailto:?subject=${subject}&body=${body}`;
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(generateJobMessage(job));
    alert("Message copied!");
  };

  const handleProgressChange = (key) => {
    setProgress((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const handleSaveProgress = async () => {
    try {
      setSavingProgress(true);

      const res = await fetch(
        `${API_BASE_URL}/jobs/${job._id}/progress`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(progress),
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update progress");
      }

      setJob(data.data);
      alert("Work progress updated");
    } catch (error) {
      alert(error.message);
    } finally {
      setSavingProgress(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Job Details</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition"
        >
          ← Back
        </button>
      </div>

      {/* CUSTOMER DETAILS */}
      <Section title="Customer Details">
        <Info label="Name" value={job.customerName} />
        <Info label="From" value={job.from} />
        <Info label="To" value={job.to} />
        <Info
          label="Schedule"
          value={new Date(job.jobSchedule).toLocaleString()}
        />
      </Section>

      {/* ASSIGNED TASKS */}
      <Section title="Assigned Tasks">
        <ul className="list-disc ml-6">
          {job.workType.map((task) => (
            <li key={task} className="capitalize">
              {task.replace("-", " ")}
            </li>
          ))}
        </ul>
      </Section>

      {/* JOB STATUS */}
      <Section title="Job Status">
        <div className=" flex flex-col gap-2">
          {/* STATUS BADGE */}
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
              jobStatusStyle[job.status] || "bg-gray-100"
            }`}
          >
            {job.status.replace("-", " ")}
          </span>

          {/* STUDENT COUNT */}
          <p className=" text-sm text-slate-600">
            Students Assigned:{" "}
            <strong>
              {job.acceptedStudents?.length || 0} / {job.requiredStudents}
            </strong>
          </p>

          {/* JOB FULL MESSAGE */}
          {job.acceptedStudents?.length >= job.requiredStudents && (
            <p className=" text-green-600 text-sm font-medium">
              ✔ Required student count reached
            </p>
          )}
        </div>
      </Section>

      <Section title="Work Progress Control">
        <div className="space-y-3">
          {[
            ["packingDone", "Packing Done"],
            ["loadingDone", "Loading Done"],
            ["truckArrived", "Truck Reached Destination"],
            ["unloadingDone", "Unloading Done"],
            ["objectsSetupDone", "Objects Setup Done"],
          ].map(([key, label]) => (
            <label
              key={key}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <input
                type="checkbox"
                checked={progress[key]}
                onChange={() => handleProgressChange(key)}
              />
              <span className="text-sm font-medium text-slate-700">
                {label}
              </span>
            </label>
          ))}

          <button
            onClick={handleSaveProgress}
            disabled={savingProgress}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {savingProgress ? "Saving..." : "Update Workflow Progress"}
          </button>
        </div>
      </Section>

      <Section title="Job Alert & sharing Options">
        <div className="flex flex-wrap gap-3">
          <a
            href={generateWhatsAppLink(job)}
            target="_blank"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            WhatsApp
          </a>

          <a
            href={generateTelegramLink(job)}
            target="_blank"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Telegram
          </a>

          <a
            href={generateEmailLink(job)}
            target="_blank"
            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm"
          >
            Email
          </a>

          <button
            onClick={copyMessage}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg"
          >
            Copy Message
          </button>
        </div>
      </Section>

      {/* ASSIGNED STUDENTS */}
      <Section title="Assigned Students">
        {!job.acceptedStudents || job.acceptedStudents.length === 0 ? (
          <p className="text-slate-500">No students assigned yet</p>
        ) : (
          job.acceptedStudents.map((s) => (
            <div key={s._id} className="border p-3 rounded-lg">
              <p className="font-medium">{s.name}</p>
              <p className="text-sm text-slate-500">{s.email}</p>
              <p className="text-sm text-slate-500">{s.phone}</p>
            </div>
          ))
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
