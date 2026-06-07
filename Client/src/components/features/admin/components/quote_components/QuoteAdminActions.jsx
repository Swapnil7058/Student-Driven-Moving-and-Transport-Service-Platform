import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuoteSection from "./QuoteSection";
import { updateQuote } from "../../services/quoteService";

export default function QuoteAdminActions({ quote, setQuote }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState(quote.status);
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    "pending",
    "quoted",
    "confirmed",
    "in-progress",
    "completed",
    "rejected",
  ];

  const hasInvoice = Boolean(quote.invoice?.services?.length);

  const handleStatusUpdate = async () => {
    try {
      setLoading(true);

      const updated = await updateQuote(quote._id, {
        status,
      });

      setQuote(updated);
      alert("Status updated");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);

      const updated = await updateQuote(quote._id, {
        status: "rejected",
      });

      setQuote(updated);
      setStatus("rejected");
      alert("Quote rejected");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <QuoteSection title="Admin Actions">
      {quote.invoice?.total && (
        <div className="rounded-lg bg-slate-100 p-4">
          <p className="text-sm text-slate-600">Calculated Quote Price</p>
          <p className="text-2xl font-semibold text-slate-900">
            Rs. {quote.invoice.total}
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={() => navigate(`/admin/quotes/${quote._id}/price-estimator`)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          {hasInvoice ? "View Price" : "Calculate Price"}
        </button>

        {hasInvoice && (
          <span className="rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
            Quote Ready
          </span>
        )}

        <button
          onClick={handleReject}
          disabled={loading}
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Reject
        </button>
      </div>

      <div className="mt-6 border-t pt-4">
        <p className="mb-2 text-sm text-slate-500">
          Manual Status Control (Testing)
        </p>

        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option.replace("-", " ")}
              </option>
            ))}
          </select>

          <button
            onClick={handleStatusUpdate}
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Update Status
          </button>
        </div>
      </div>
    </QuoteSection>
  );
}
