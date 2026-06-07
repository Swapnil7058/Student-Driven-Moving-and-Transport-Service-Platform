import { useNavigate } from "react-router-dom";

const visibleStatuses = ["pending", "quoted", "confirmed"];

const statusStyle = {
  pending: "bg-yellow-100 text-yellow-700",
  quoted: "bg-blue-100 text-blue-700",
  confirmed: "bg-indigo-100 text-indigo-700",
};

export default function LatestMovesSection({ quotes }) {
  const navigate = useNavigate();

  const latestMoves = quotes.filter((quote) =>
    visibleStatuses.includes(quote.status),
  );

  return (
    <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">Latest Moves</h3>
          <p className="mt-1 text-sm text-slate-500">
            Review your latest quotes before work starts.
          </p>
        </div>

        <button
          onClick={() => navigate("/customer/quotes")}
          className="rounded-lg border px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
        >
          View All Quotes
        </button>
      </div>

      {latestMoves.length === 0 ? (
        <div className="py-8 text-center text-slate-500">
          No pending, quoted, or confirmed moves right now.
        </div>
      ) : (
        <div className="space-y-4">
          {latestMoves.map((move) => (
            <article
              key={move._id}
              className="rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-slate-800">
                    {move.zipFrom} to {move.zipTo}
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">
                    Move Date: {new Date(move.moveDate).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-sm capitalize ${
                    statusStyle[move.status] || "bg-slate-100 text-slate-700"
                  }`}
                >
                  {move.status}
                </span>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                <p>
                  <strong>From:</strong> {move.zipFrom}
                </p>
                <p>
                  <strong>To:</strong> {move.zipTo}
                </p>
                <p>
                  <strong>Price:</strong>{" "}
                  {move.invoice?.total != null
                    ? `Rs. ${Number(move.invoice.total).toLocaleString()}`
                    : "Not quoted yet"}
                </p>
                <p>
                  <strong>Status:</strong> {move.status.replace("-", " ")}
                </p>
              </div>

              <button
                onClick={() => navigate(`/customer/quotes/${move._id}`)}
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
