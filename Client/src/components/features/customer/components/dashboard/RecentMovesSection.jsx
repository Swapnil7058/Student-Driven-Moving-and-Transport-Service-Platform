import { useNavigate } from "react-router-dom";
import MoveCard from "../MoveCard";

export default function RecentMovesSection({ quotes, isLoading }) {
  const navigate = useNavigate();

  return (
    <section className="bg-white rounded-xl shadow p-6 mb-8">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-semibold mb-4">Recent Moves</h3>

        <span className="text-sm text-slate-500">Last {quotes.length} requests</span>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-slate-500 animate-pulse">
          Loading your moves...
        </div>
      ) : quotes.length === 0 ? (
        <div className="text-center py-10 text-slate-500">
          No moves yet. Start by requesting a quote.
        </div>
      ) : (
        <div className="space-y-3">
          {quotes.map((move) => (
            <div key={move._id} className="space-y-3">
              <MoveCard
                from={move.zipFrom}
                to={move.zipTo}
                date={move.moveDate}
                status={move.status}
                price={move.invoice?.total}
              />
              <div className="flex justify-end">
                <button
                  onClick={() => navigate(`/customer/quotes/${move._id}`)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
