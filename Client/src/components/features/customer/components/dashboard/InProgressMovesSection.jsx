import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerJobByQuote } from "../../services/customerQuoteService";
import MoveProgressTracker from "./MoveProgressTracker";
import { socket } from "../../../../../socket-connection/socket";

export default function InProgressMovesSection({ quotes }) {
  const navigate = useNavigate();
  const [moveJobs, setMoveJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const inProgressQuotes = quotes.filter(
    (quote) => quote.status === "in-progress",
  );

  useEffect(() => {
    const fetchJobs = async () => {
      if (inProgressQuotes.length === 0) {
        setMoveJobs([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const jobs = await Promise.all(
          inProgressQuotes.map(async (quote) => {
            try {
              const job = await getCustomerJobByQuote(quote._id);
              return { quote, job };
            } catch (error) {
              return { quote, job: null };
            }
          }),
        );

        setMoveJobs(jobs);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [quotes]);

  useEffect(() => {
    const handleProgressUpdated = (payload) => {
      setMoveJobs((currentJobs) =>
        currentJobs.map((item) => {
          if (String(item.quote._id) !== String(payload.quoteId)) {
            return item;
          }

          return {
            ...item,
            job: payload.data,
            quote: {
              ...item.quote,
              status: payload.status,
            },
          };
        }),
      );
    };

    socket.on("job:progressUpdated", handleProgressUpdated);

    return () => {
      socket.off("job:progressUpdated", handleProgressUpdated);
    };
  }, []);

  useEffect(() => {
    const handleStudentAccepted = (payload) => {
      setMoveJobs((currentJobs) =>
        currentJobs.map((item) => {
          if (String(item.quote._id) !== String(payload.quoteId)) {
            return item;
          }

          return {
            ...item,
            job: payload.data,
            quote: {
              ...item.quote,
              status: payload.status,
            },
          };
        }),
      );
    };

    socket.on("job:studentAccepted", handleStudentAccepted);

    return () => {
      socket.off("job:studentAccepted", handleStudentAccepted);
    };
  }, []);

  return (
    <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">
            In-Progress Moves
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Follow the live work progress for each active move.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-slate-500">
          Loading active move progress...
        </div>
      ) : moveJobs.length === 0 ? (
        <div className="py-8 text-center text-slate-500">
          No in-progress moves right now.
        </div>
      ) : (
        <div className="space-y-4">
          {moveJobs.map(({ quote, job }) => (
            <article
              key={quote._id}
              className="rounded-xl border border-slate-200 p-5"
            >
              <div className="mb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">
                      {quote.zipFrom} to {quote.zipTo}
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">
                      Move Date: {new Date(quote.moveDate).toLocaleDateString()}
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm capitalize text-blue-700">
                    {quote.status.replace("-", " ")}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                  <p>
                    <strong>From:</strong> {quote.zipFrom}
                  </p>
                  <p>
                    <strong>To:</strong> {quote.zipTo}
                  </p>
                  <p>
                    <strong>Status:</strong> in progress
                  </p>
                  <p>
                    <strong>Schedule:</strong>{" "}
                    {job?.jobSchedule
                      ? new Date(job.jobSchedule).toLocaleString()
                      : new Date(quote.moveDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <MoveProgressTracker
                quote={quote}
                job={job}
                title="Work Progress"
                description="Track packing, loading, travel, unloading, and setup for this move."
                className="mb-0 rounded-xl bg-slate-50 p-5"
              />

              <button
                onClick={() => navigate(`/customer/quotes/${quote._id}`)}
                className="mt-5 text-sm text-blue-600 hover:underline"
              >
                View Move Details
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
