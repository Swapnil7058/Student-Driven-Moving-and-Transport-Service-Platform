import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomerQuoteBreakdown from "../components/CustomerQuoteBreakdown";
import QuoteResponseActions from "../components/QuoteResponseActions";
import { getCustomerQuote } from "../services/customerQuoteService";

export default function CustomerQuoteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const data = await getCustomerQuote(id);
        setQuote(data);
      } catch (error) {
        console.error("Quote details fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [id]);

  if (loading) {
    return <p className="p-8">Loading...</p>;
  }

  if (!quote) {
    return <p className="p-8">Quote not found.</p>;
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Quote Details</h1>
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Move Details</h2>
          <div className="space-y-2 text-slate-700">
            <p><strong>From:</strong> {quote.zipFrom}</p>
            <p><strong>To:</strong> {quote.zipTo}</p>
            <p><strong>Move Date:</strong> {quote.moveDate}</p>
            <p><strong>Property Size:</strong> {quote.propertySize}</p>
            <p><strong>Status:</strong> {quote.status}</p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Special Items</h2>
          <div className="space-y-2 text-slate-700">
            {quote.specialItemsList?.length > 0 && (
              <p>
                <strong>Selected Items:</strong> {quote.specialItemsList.join(", ")}
              </p>
            )}

            {quote.customItems?.length > 0 && (
              <div>
                <strong>Custom Items:</strong>
                <ul className="mt-2 list-disc pl-5">
                  {quote.customItems.map((item, index) => (
                    <li key={`${item.name}-${index}`}>
                      {item.name}
                      {item.instructions ? ` - ${item.instructions}` : ""}
                      {item.fragile ? " (Fragile)" : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!quote.specialItemsList?.length && !quote.customItems?.length && (
              <p>No special items added.</p>
            )}
          </div>
        </div>
      </div>

      {quote.invoice ? (
        <CustomerQuoteBreakdown quote={quote} />
      ) : (
        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-slate-900">
            Quote Price Breakdown
          </h2>
          <p className="mt-2 text-slate-600">
            The admin has not sent a detailed price breakdown yet.
          </p>
        </section>
      )}

      <QuoteResponseActions quote={quote} onQuoteUpdated={setQuote} />
    </div>
  );
}
