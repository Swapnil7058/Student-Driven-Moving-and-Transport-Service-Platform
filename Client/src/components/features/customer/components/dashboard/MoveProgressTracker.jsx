const milestoneTemplate = [
  {
    key: "confirmed",
    title: "Quote Confirmed",
    description: "Your quoted move has been approved and locked in.",
  },
  {
    key: "in-progress",
    title: "Move In Progress",
    description: "Your move has been opened for execution by the operations team.",
  },
  {
    key: "resources",
    title: "Assigned Workers / Resources",
    description: "Students, truck requirement, and support resources are assigned.",
  },
  {
    key: "scheduled",
    title: "Move Scheduled",
    description: "The job schedule is fixed according to your selected moving date.",
  },
  {
    key: "packing",
    title: "Packing Done",
    description: "Packing is completed and the move is ready for loading.",
  },
  {
    key: "loading",
    title: "Loading Done",
    description: "Items are loaded and prepared for transport.",
  },
  {
    key: "arrival",
    title: "Truck Arrived at Destination",
    description: "The truck has reached the destination point.",
  },
  {
    key: "unloading",
    title: "Unloading Done",
    description: "Items have been unloaded safely at the destination.",
  },
  {
    key: "setup",
    title: "Objects Setup Done",
    description: "Furniture and key objects have been arranged into place.",
  },
  {
    key: "completed",
    title: "Moving Completed",
    description: "Your move has been completed successfully.",
  },
];

function getCompletedMilestones(quote, job) {
  if (!quote) {
    return new Set();
  }

  if (quote.status === "completed") {
    return new Set(milestoneTemplate.map((item) => item.key));
  }

  const completed = new Set(["confirmed"]);

  if (quote.status === "in-progress") {
    completed.add("in-progress");
  }

  if (job) {
    completed.add("resources");

    if (job.jobSchedule || quote.moveDate) {
      completed.add("scheduled");
    }

    if (job.workProgress?.packingDone) {
      completed.add("packing");
    }

    if (job.workProgress?.loadingDone) {
      completed.add("loading");
    }

    if (job.workProgress?.truckArrived) {
      completed.add("arrival");
    }

    if (job.workProgress?.unloadingDone) {
      completed.add("unloading");
    }

    if (job.workProgress?.objectsSetupDone) {
      completed.add("setup");
    }
  }

  return completed;
}

export default function MoveProgressTracker({
  quote,
  job,
  title = "Move Progress",
  description = "Track the current stage of your confirmed move.",
  className = "mb-8 rounded-2xl bg-white p-6 shadow-sm",
}) {
  if (!quote || !["confirmed", "in-progress", "completed"].includes(quote.status)) {
    return null;
  }

  const completed = getCompletedMilestones(quote, job);

  return (
    <section className={className}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>

        <span className="rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium capitalize text-blue-700">
          {quote.status.replace("-", " ")}
        </span>
      </div>

      <div className="space-y-4">
        {milestoneTemplate.map((milestone, index) => {
          const isDone = completed.has(milestone.key);

          return (
            <div key={milestone.key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    isDone
                      ? "bg-green-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {index + 1}
                </div>
                {index < milestoneTemplate.length - 1 && (
                  <div
                    className={`mt-2 w-0.5 flex-1 ${
                      isDone ? "bg-green-300" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>

              <div className="pb-5">
                <p
                  className={`font-medium ${
                    isDone ? "text-slate-900" : "text-slate-500"
                  }`}
                >
                  {milestone.title}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {milestone.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
