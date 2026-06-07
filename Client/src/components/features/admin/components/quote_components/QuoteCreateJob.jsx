import { useEffect, useState } from "react";
import { createJob } from "../../services/quoteService";
import QuoteSection from "./QuoteSection";

function toDateTimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

function getInvoiceService(quote, serviceName) {
  return quote.invoice?.services?.find((service) => service.name === serviceName);
}

export default function QuoteCreateJob({ quote }) {
  const [job, setJob] = useState({
    workType: [],
    requiredStudents: "",
    truckRequired: "no",
    truckSize: "",
    truckCount: "",
    jobSchedule: "",
  });

  useEffect(() => {
    const laborService = getInvoiceService(quote, "labor");
    const truckService = getInvoiceService(quote, "truck");
    const truckCount = Number(truckService?.quantity || 0);

    setJob((currentJob) => ({
      ...currentJob,
      requiredStudents: laborService?.quantity
        ? String(laborService.quantity)
        : currentJob.requiredStudents,
      truckRequired: truckCount > 0 ? "yes" : "no",
      truckCount: truckCount > 0 ? String(truckCount) : "",
      jobSchedule: quote.moveDate
        ? toDateTimeLocal(quote.moveDate)
        : currentJob.jobSchedule,
    }));
  }, [quote]);

  const handleCreateJob = async () => {
    if (job.workType.length === 0 || !job.requiredStudents || !job.jobSchedule) {
      alert("Please fill required fields");
      return;
    }

    try {
      await createJob({
        quoteId: quote._id,
        workType: job.workType,
        requiredStudents: Number(job.requiredStudents),
        truckRequired: job.truckRequired,
        truckSize: job.truckSize,
        truckCount: Number(job.truckCount || 0),
        jobSchedule: job.jobSchedule,
      });

      alert("Job created and students notified");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <QuoteSection title="Create Job for Students">
      <div className="mb-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
        Required students, truck requirement, truck count, and job schedule are
        prefilled from the quote. Work type and truck size can still be adjusted.
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {["packing", "loading", "unloading", "careful-moving"].map((task) => (
          <label
            key={task}
            className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 hover:bg-slate-50"
          >
            <input
              type="checkbox"
              checked={job.workType.includes(task)}
              onChange={(event) => {
                const updated = event.target.checked
                  ? [...job.workType, task]
                  : job.workType.filter((item) => item !== task);

                setJob({ ...job, workType: updated });
              }}
            />

            <span className="text-sm capitalize">{task.replace("-", " ")}</span>
          </label>
        ))}
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">
          Required Students
        </label>

        <input
          type="number"
          min="1"
          value={job.requiredStudents}
          onChange={(event) =>
            setJob({ ...job, requiredStudents: event.target.value })
          }
          className="w-full rounded-lg border px-4 py-2"
          placeholder="e.g. 4"
        />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Truck Required?
          </label>

          <select
            value={job.truckRequired}
            onChange={(event) =>
              setJob({
                ...job,
                truckRequired: event.target.value,
                truckCount: event.target.value === "yes" ? job.truckCount : "",
                truckSize: event.target.value === "yes" ? job.truckSize : "",
              })
            }
            className="w-full rounded-lg border px-4 py-2"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        {job.truckRequired === "yes" && (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Truck Size
              </label>

              <select
                value={job.truckSize}
                onChange={(event) =>
                  setJob({ ...job, truckSize: event.target.value })
                }
                className="w-full rounded-lg border px-4 py-2"
              >
                <option value="">Select truck size</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Truck Count
              </label>

              <input
                type="number"
                value={job.truckCount}
                onChange={(event) =>
                  setJob({ ...job, truckCount: event.target.value })
                }
                className="w-full rounded-lg border px-4 py-2"
              />
            </div>
          </>
        )}
      </div>

      <div className="mb-6">
        <label className="mb-1 block text-sm font-medium">Job Schedule</label>

        <input
          type="datetime-local"
          value={job.jobSchedule}
          onChange={(event) =>
            setJob({ ...job, jobSchedule: event.target.value })
          }
          className="w-full rounded-lg border px-4 py-2"
        />
      </div>

      <button
        onClick={handleCreateJob}
        disabled={quote.status !== "confirmed"}
        className={`rounded-lg px-5 py-2 text-white ${
          quote.status === "confirmed"
            ? "bg-blue-600 hover:bg-blue-700"
            : "cursor-not-allowed bg-gray-400"
        }`}
      >
        Create Job & Notify Students
      </button>
    </QuoteSection>
  );
}
