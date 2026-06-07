import { useState } from "react";
import { updateCustomerQuoteResponse } from "../services/customerQuoteService";

export default function QuoteResponseActions({ quote, onQuoteUpdated }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");

  const handleAccept = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      const updatedQuote = await updateCustomerQuoteResponse(quote._id, {
        status: "confirmed",
      });

      onQuoteUpdated(updatedQuote);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError("Please enter a reason for rejecting the quote.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const updatedQuote = await updateCustomerQuoteResponse(quote._id, {
        status: "rejected",
        rejectionReason: rejectionReason.trim(),
      });

      onQuoteUpdated(updatedQuote);
      setShowRejectBox(false);
      setRejectionReason("");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (quote.status !== "quoted" || !quote.invoice?.total) {
    return null;
  }

  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-slate-600">
          The admin has sent your quote price. Accept it to confirm your move or
          reject it with a reason.
        </p>
        <button
          onClick={handleAccept}
          disabled={isSubmitting}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Accept Quote
        </button>
        <button
          onClick={() => {
            setShowRejectBox((current) => !current);
            setError("");
          }}
          disabled={isSubmitting}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Reject Quote
        </button>
      </div>

      {showRejectBox && (
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Reason for rejection
          </label>
          <textarea
            value={rejectionReason}
            onChange={(event) => setRejectionReason(event.target.value)}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            placeholder="Tell the admin why you are rejecting this quote."
          />
          <div className="mt-3 flex gap-3">
            <button
              onClick={handleReject}
              disabled={isSubmitting}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Submit Rejection
            </button>
            <button
              onClick={() => {
                setShowRejectBox(false);
                setError("");
              }}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
