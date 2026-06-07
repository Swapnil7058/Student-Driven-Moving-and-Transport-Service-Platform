import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getQuote } from "../services/quoteService";
import QuoteCustomerInfo from "../components/quote_components/QuoteCustomerInfo";
import QuoteMoveDetails from "../components/quote_components/QuoteMoveDetails";
import QuoteSpecialItems from "../components/quote_components/QuoteSpecialItems";
import QuoteCustomerResponse from "../components/quote_components/QuoteCustomerResponse";
import QuoteAdminActions from "../components/quote_components/QuoteAdminActions";
import QuoteCreateJob from "../components/quote_components/QuoteCreateJob";
import CustomerQuoteBreakdown from "../../customer/components/CustomerQuoteBreakdown";

export default function AdminQuoteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const data = await getQuote(id);
        setQuote(data);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center">Loading quote...</div>;
  }

  if (!quote) {
    return <div className="p-10 text-center">Quote not found</div>;
  }

  return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">
            Quote Details
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition"
          >
            ← Back
          </button>
        </div>

        {/* CONTENT */}
        <div className="space-y-6">
          <QuoteCustomerInfo quote={quote} />
          <QuoteMoveDetails quote={quote} />
          <QuoteSpecialItems quote={quote} />
          {quote.invoice && <CustomerQuoteBreakdown quote={quote} />}
          <QuoteCustomerResponse quote={quote} />
          {quote.status !== "rejected" && (
            <QuoteAdminActions quote={quote} setQuote={setQuote} />
          )}

          {quote.status === "confirmed" && <QuoteCreateJob quote={quote} />}
        </div>
      </div>
    
  );
}
